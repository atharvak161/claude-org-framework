#!/usr/bin/env node
'use strict';
/**
 * doctor.js — prove the guard is installed and actually blocking.
 *
 * An uninstalled guard and a working guard look identical from the outside:
 * in both cases nothing happens. This runs a live command through the real
 * hook and reports what came back, so "is it on?" has an evidence-backed
 * answer rather than an assumption.
 *
 *   node bin/guard/doctor.js
 */

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname);
const ORG = path.resolve(ROOT, '..', '..');

let problems = 0;
const ok = m => console.log(`  ok    ${m}`);
const bad = m => { problems += 1; console.log(`  FAIL  ${m}`); };

console.log('\nOrg guard — install check\n');

// 1. Files present.
for (const rel of ['pretooluse.js', 'lib/shell.js', 'lib/policy.js',
  'lib/classify.js', 'lib/decide.js', 'tests/run.js']) {
  fs.existsSync(path.join(ROOT, rel)) ? ok(`present: bin/guard/${rel}`)
    : bad(`missing: bin/guard/${rel}`);
}

// 2. Hook registered, and pointing at a file that exists.
const settingsPath = path.join(ORG, '.claude', 'settings.json');
if (!fs.existsSync(settingsPath)) {
  bad('.claude/settings.json is missing — the hook is not registered, so nothing runs');
} else {
  try {
    const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    const pre = settings?.hooks?.PreToolUse || [];
    const entry = pre.find(h => JSON.stringify(h).includes('bin/guard/pretooluse.js'));
    if (!entry) bad('.claude/settings.json has no PreToolUse hook for bin/guard/pretooluse.js');
    else {
      ok(`hook registered for: ${entry.matcher}`);
      for (const tool of ['Bash', 'Write', 'Edit']) {
        new RegExp(`^(${entry.matcher})$`).test(tool)
          ? ok(`matcher covers ${tool}`)
          : bad(`matcher does NOT cover ${tool}`);
      }
    }
  } catch (error) {
    bad(`.claude/settings.json is not valid JSON: ${error.message}`);
  }
}

// 3. The guard is committed, so a fresh clone gets it.
try {
  const tracked = execFileSync('git', ['ls-files', '.claude/settings.json'],
    { cwd: ORG, encoding: 'utf8' }).trim();
  tracked ? ok('.claude/settings.json is tracked by git')
    : bad('.claude/settings.json is NOT tracked — a fresh clone would have no guard');
} catch {
  console.log('  skip  git not available');
}

// 4. Live behaviour. This is the part that actually matters.
function hookExit(event, env = {}) {
  try {
    execFileSync('node', [path.join(ROOT, 'pretooluse.js')], {
      input: JSON.stringify(event), env: { ...process.env, ...env },
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return 0;
  } catch (error) { return error.status; }
}
const bash = command => ({ tool_name: 'Bash', cwd: ORG, tool_input: { command } });

hookExit(bash('rm -rf local')) === 2
  ? ok('live: `rm -rf local` is BLOCKED')
  : bad('live: `rm -rf local` was ALLOWED — the guard is not working');
hookExit(bash('sudo rm -rf local')) === 2
  ? ok('live: `sudo rm -rf local` is BLOCKED')
  : bad('live: `sudo rm -rf local` was ALLOWED');
hookExit(bash('ls -la')) === 0
  ? ok('live: `ls -la` is allowed')
  : bad('live: `ls -la` was blocked — the guard is over-blocking');
hookExit(bash('rm -rf local'), { ORG_GUARD: 'off' }) === 0
  ? ok('live: ORG_GUARD=off overrides')
  : bad('live: ORG_GUARD=off did not override');

// 5. safe-delete, the route every block points at.
const safeDelete = path.join(ORG, 'bin', 'safe-delete');
if (!fs.existsSync(safeDelete)) bad('bin/safe-delete is missing — blocks point at a route that does not exist');
else {
  try {
    fs.accessSync(safeDelete, fs.constants.X_OK);
    ok('bin/safe-delete is present and executable');
  } catch { bad('bin/safe-delete is not executable'); }
}

console.log(problems === 0
  ? '\nGuard is installed and blocking.\n'
  : `\n${problems} problem(s). The guard is NOT fully protecting this workspace.\n`);
process.exit(problems === 0 ? 0 : 1);
