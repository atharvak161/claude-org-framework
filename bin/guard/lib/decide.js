'use strict';
/**
 * decide.js — turn findings into a verdict.
 *
 * A verdict is { allow: boolean, reasons: string[] }. The reasons are written
 * for whoever has to act on them: what was stopped, which rule stopped it, and
 * the exact command to run instead. A block with no route forward just gets
 * worked around, which is how gate-dodging starts.
 */

const path = require('path');
const { allSegments, commandBasename } = require('./shell');
const { classifySegment } = require('./classify');
const { ZONE, classifyPath, isCatastrophic, SAFE_DELETE, ORG_ROOT } = require('./policy');

/** Words that make an unresolvable command word worth failing closed over. */
const DESTRUCTIVE_HINT = /\b(rm|rmdir|shred|unlink|srm|delete|--delete|clean|reset|truncate|dd)\b/;

const RULE_ONE =
  'Rule one: NOTHING IS EVER DELETED. Deleting means moving it out, not destroying it.';

function quote(p) {
  return /[\s'"$`\\]/.test(p) ? `"${p.replace(/(["$`\\])/g, '\\$1')}"` : p;
}

/** The sanctioned replacement for a blocked removal. */
function safeDeleteHint(targets) {
  const rel = p => (p && p.startsWith(ORG_ROOT + path.sep) ? path.relative(ORG_ROOT, p) : p);
  const list = targets.filter(Boolean);
  if (list.length === 0) return `  ${SAFE_DELETE} <path> "reason"`;
  return list.map(t => `  bin/safe-delete ${quote(rel(t))} "reason"`).join('\n');
}

/**
 * Shell wrappers that execute a script FILE rather than an inline string.
 * `bash deploy.sh` reveals nothing about what deploy.sh does, so the only way
 * to classify it is to read it.
 */
const SCRIPT_RUNNERS = new Set(['sh', 'bash', 'zsh', 'dash', 'ksh', 'source', '.']);

/**
 * Evaluate one command string.
 *
 * @param {string} command raw Bash command
 * @param {string} cwd directory it would run in
 * @param {{ readScript?: (absPath: string) => string|null, depth?: number }} [options]
 *   `readScript` lets the caller resolve `bash script.sh` by supplying the
 *   file's contents. Omitted, this function stays pure and does no I/O, which
 *   is what keeps it testable.
 * @returns {{ allow: boolean, reasons: string[], findings: object[] }}
 */
function evaluate(command, cwd, options = {}) {
  const segments = allSegments(command);
  const findings = segments.flatMap(classifySegment);
  const reasons = [];

  // Fail closed when the command word itself cannot be resolved and the line
  // mentions something destructive. `$(echo rm) -rf local` is the shape.
  for (const tokens of segments) {
    const head = tokens[0] || '';
    const opaque = head.includes('$(') || head.includes('`') || commandBasename(head) === 'eval';
    if (opaque && DESTRUCTIVE_HINT.test(command)) {
      reasons.push(
        `The command name is built at runtime (\`${head}\`) and the line mentions a destructive operation.`,
        'The guard cannot know what this resolves to without running it, so it fails closed.',
        'Write the command out literally and it will be checked normally.'
      );
      return { allow: false, reasons, findings };
    }
  }

  // Follow `bash script.sh` into the script, when the caller can read it.
  const depth = options.depth || 0;
  if (options.readScript && depth < 3) {
    for (const tokens of segments) {
      if (tokens.length < 2) continue;
      if (!SCRIPT_RUNNERS.has(commandBasename(tokens[0]))) continue;
      if (tokens.includes('-c')) continue;              // inline form, already covered
      const file = tokens.slice(1).find(t => !t.startsWith('-'));
      if (!file) continue;
      const body = options.readScript(path.resolve(cwd, file));
      if (!body) continue;                              // missing or unreadable: it would fail anyway
      const inner = evaluate(body, cwd, { ...options, depth: depth + 1 });
      if (!inner.allow) {
        reasons.push(`Blocked: \`${tokens.join(' ')}\` runs a script that would be blocked on its own.`);
        reasons.push(...inner.reasons);
        return { allow: false, reasons, findings: [...findings, ...inner.findings] };
      }
    }
  }

  for (const finding of findings) {
    const zones = finding.targets.map(t => ({ raw: t, ...classifyPath(t, cwd) }));
    const has = z => zones.some(x => x.zone === z);

    if (finding.kind === 'git-history') {
      reasons.push(
        `Blocked: \`${finding.command}\` — ${finding.detail}.`,
        'History rewrites and force-pushes are Atharva\'s call, not an agent\'s. Surface it and stop.'
      );
      continue;
    }

    if (finding.kind === 'git-destructive') {
      reasons.push(
        `Blocked: \`${finding.command}\` — ${finding.detail}.`,
        'Uncommitted work has no backup. Commit or stash first, then ask Atharva.',
        'If the work is genuinely disposable, say so out loud and re-run with ORG_GUARD=off.'
      );
      continue;
    }

    // delete / truncate — decided by where the targets live.
    if (zones.length === 0) {
      reasons.push(
        `Blocked: \`${finding.command}\` with no resolvable target — ${finding.detail}.`,
        RULE_ONE
      );
      continue;
    }
    if (zones.some(z => isCatastrophic(z.resolved))) {
      const bad = zones.find(z => isCatastrophic(z.resolved));
      reasons.push(
        `Blocked: \`${finding.command}\` targets ${bad.resolved}.`,
        'That is a system or home root. Never, under any circumstances.'
      );
      continue;
    }
    if (has(ZONE.ICLOUD)) {
      reasons.push(
        `Blocked: \`${finding.command}\` targets iCloud Drive.`,
        'An iCloud delete propagates to every device. Treat iCloud as read-only.'
      );
      continue;
    }
    if (has(ZONE.UNKNOWN)) {
      const u = zones.find(z => z.zone === ZONE.UNKNOWN);
      reasons.push(
        `Blocked: \`${finding.command} ${u.raw}\` — the target ${u.reason}.`,
        'The guard will not guess what a glob or variable expands to. `rm -rf $EMPTY/` is how home directories disappear.',
        'Resolve it to a literal path first (ls it, confirm what matches), then act on exactly what you meant.'
      );
      continue;
    }
    if (has(ZONE.WORKSPACE)) {
      const inside = zones.filter(z => z.zone === ZONE.WORKSPACE);
      reasons.push(
        `Blocked: \`${finding.command}\` targets the organisation workspace — ${finding.detail}.`,
        RULE_ONE,
        'Move it to quarantine instead, where Atharva reviews it and deletes what he does not want:',
        safeDeleteHint(inside.map(z => z.resolved))
      );
      continue;
    }
    if (has(ZONE.OUTSIDE)) {
      const out = zones.filter(z => z.zone === ZONE.OUTSIDE).map(z => z.resolved);
      reasons.push(
        `Blocked: \`${finding.command}\` targets ${out.join(', ')}, outside the workspace.`,
        'safe-delete refuses outside the workspace by design, so this needs Atharva\'s explicit yes for this exact path.',
        'Ask, get a clear yes, then re-run with ORG_GUARD=off.'
      );
      continue;
    }
    // Everything left is scratch, which is what scratch is for.
  }

  return { allow: reasons.length === 0, reasons, findings };
}

module.exports = { evaluate, RULE_ONE, safeDeleteHint };
