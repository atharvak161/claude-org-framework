#!/usr/bin/env node
'use strict';
/**
 * pretooluse.js — the PreToolUse gate.
 *
 * Claude Code pipes a JSON event on stdin before it runs a tool. Exit 0 lets
 * the call through; exit 2 blocks it and hands stderr back to the model as the
 * reason. That is the whole contract.
 *
 * This is the layer CLAUDE.md could never be. A written rule holds only while
 * every agent reads it and chooses to comply. This holds regardless: it runs
 * before the command does, whatever the agent intended.
 *
 * Deliberate override, visible and rare, matching .githooks:
 *     ORG_GUARD=off <command>
 *
 * Failure policy: closed. A parse error, a truncated event or an unreadable
 * payload blocks rather than waves through. A guard that fails open is theatre.
 */

const fs = require('fs');
const path = require('path');
const { StringDecoder } = require('string_decoder');

const { evaluate } = require('./lib/decide');
const { ORG_ROOT, classifyPath, ZONE } = require('./lib/policy');

const MAX_STDIN = 1024 * 1024;           // 1 MiB, matching Claude Code's own cap
const EXIT_ALLOW = 0;
const EXIT_BLOCK = 2;

/** Read stdin with a hard cap, reporting truncation so we can fail closed. */
function readStdin() {
  return new Promise(resolve => {
    const decoder = new StringDecoder('utf8');
    let raw = '';
    let bytes = 0;
    let truncated = false;
    let settled = false;

    const finish = ok => {
      if (settled) return;
      settled = true;
      if (ok && !truncated) raw += decoder.end();
      resolve({ raw, truncated: truncated || !ok });
    };

    process.stdin.on('data', chunk => {
      const buf = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      const room = Math.max(0, MAX_STDIN - bytes);
      const taken = buf.subarray(0, room);
      if (taken.length > 0) { raw += decoder.write(taken); bytes += taken.length; }
      if (taken.length < buf.length) truncated = true;
    });
    process.stdin.once('end', () => finish(true));
    // A transport error can leave a syntactically plausible prefix behind.
    process.stdin.once('error', () => finish(false));
    process.stdin.once('close', () => finish(false));
  });
}

/**
 * Read a script the command is about to run, so `bash deploy.sh` can be judged
 * by what deploy.sh actually does. Size-capped, and silent on any failure: an
 * unreadable script is simply not followed.
 */
function readScript(absPath) {
  try {
    const stat = fs.statSync(absPath);
    if (!stat.isFile() || stat.size > 256 * 1024) return null;
    return fs.readFileSync(absPath, 'utf8');
  } catch {
    return null;
  }
}

/** Append a block to the activity log. Never let logging break the gate. */
function logBlock(tool, detail) {
  try {
    const stamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const line = `[${stamp}] ORG_GUARD — BLOCKED ${tool} — ${String(detail).replace(/\s+/g, ' ').slice(0, 300)}\n`;
    fs.appendFileSync(path.join(ORG_ROOT, 'org', 'ACTIVITY.md'), line);
  } catch { /* the log is not the gate */ }
}

function block(tool, reasons) {
  const body = reasons.join('\n');
  process.stderr.write(`\nORG GUARD — BLOCKED\n\n${body}\n\n` +
    'This is a stop, not an obstacle. If the block is genuinely wrong, say so out loud\n' +
    'to Atharva before overriding with ORG_GUARD=off.\n');
  logBlock(tool, reasons[0] || 'no reason recorded');
  process.exit(EXIT_BLOCK);
}

/** Root-level scaffolding that belongs in local/repos/<project>/, not here. */
const ROOT_SCAFFOLDING = /^(src|tests|ci|infra)\//i;

/** Write/Edit guard: catch misplaced project scaffolding at write time. */
function checkFileWrite(input, cwd) {
  const target = input.file_path || input.path || input.notebook_path;
  if (!target) return null;

  const { zone, resolved } = classifyPath(target, cwd);
  if (zone === ZONE.ICLOUD) {
    return [
      `Blocked: writing to ${resolved}, which is in iCloud Drive.`,
      'iCloud propagates to every device. Write it in the workspace instead.'
    ];
  }
  if (zone !== ZONE.WORKSPACE || !resolved) return null;

  const rel = path.relative(ORG_ROOT, resolved);
  if (ROOT_SCAFFOLDING.test(rel)) {
    return [
      `Blocked: ${rel} creates project scaffolding at the framework root.`,
      'Project code lives in local/repos/<project>/. A ci/ or tests/ directory here cannot say which project it belongs to.',
      'The pre-commit hook blocks this at commit time; this catches it before the file exists.'
    ];
  }
  return null;
}

async function main() {
  if (String(process.env.ORG_GUARD || 'on').toLowerCase() === 'off') process.exit(EXIT_ALLOW);

  const { raw, truncated } = await readStdin();
  if (truncated) {
    block('unknown', [
      'The hook event was truncated, so the command could not be checked in full.',
      'Blocking because a safety check on a partial command is not a safety check.'
    ]);
  }
  if (!raw.trim()) process.exit(EXIT_ALLOW);   // nothing to judge

  let event;
  try {
    event = JSON.parse(raw);
  } catch (error) {
    block('unknown', [
      `The hook event could not be parsed: ${error.message}`,
      'Blocking because an unreadable event cannot be shown to be safe.'
    ]);
  }

  const tool = String(event.tool_name || '');
  const input = event.tool_input || {};
  const cwd = event.cwd || process.cwd();

  if (tool === 'Bash' || tool === 'BashOutput') {
    const command = input.command;
    if (typeof command !== 'string' || !command.trim()) process.exit(EXIT_ALLOW);
    const verdict = evaluate(command, cwd, { readScript });
    if (!verdict.allow) block(tool, verdict.reasons);
    process.exit(EXIT_ALLOW);
  }

  if (tool === 'Write' || tool === 'Edit' || tool === 'MultiEdit' || tool === 'NotebookEdit') {
    const reasons = checkFileWrite(input, cwd);
    if (reasons) block(tool, reasons);
    process.exit(EXIT_ALLOW);
  }

  process.exit(EXIT_ALLOW);
}

main().catch(error => {
  // An unexpected crash is still a failure to verify. Fail closed.
  process.stderr.write(`\nORG GUARD — BLOCKED\n\nThe guard crashed: ${error.message}\n` +
    'Blocking because an unchecked command is not a checked one.\n' +
    'Report this — a crashing guard is a defect, not a reason to disable it.\n');
  process.exit(EXIT_BLOCK);
});
