#!/usr/bin/env node
'use strict';
/**
 * run.js — the guard's test suite.
 *
 * A guard nobody tests is a guard nobody can trust. Every case below is either
 * an evasion that must be caught or an ordinary command that must not be.
 * The false-positive half matters as much as the true-positive half: a gate
 * that blocks routine work gets switched off, and then it protects nothing.
 *
 *   node bin/guard/tests/run.js
 */

const assert = require('assert');
const path = require('path');
const { execFileSync } = require('child_process');

const ROOT = path.resolve(__dirname, '..');
const ORG = path.resolve(ROOT, '..', '..');

const { evaluate } = require(path.join(ROOT, 'lib', 'decide'));
const { allSegments, commandBasename, stripHeredocBodies } = require(path.join(ROOT, 'lib', 'shell'));
const { classifyPath, ZONE } = require(path.join(ROOT, 'lib', 'policy'));

let pass = 0;
let fail = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    pass += 1;
  } catch (error) {
    fail += 1;
    failures.push(`${name}\n      ${error.message}`);
  }
}

/** Assert the guard blocks this command. */
function blocks(command, cwd = ORG) {
  const v = evaluate(command, cwd);
  assert.strictEqual(v.allow, false, `expected BLOCK, got ALLOW for: ${command}`);
}

/** Assert the guard lets this command through. */
function allows(command, cwd = ORG) {
  const v = evaluate(command, cwd);
  assert.strictEqual(v.allow, true,
    `expected ALLOW, got BLOCK for: ${command}\n      reason: ${v.reasons[0] || ''}`);
}

// ── 1. The incident itself ───────────────────────────────────────────────────
// 2026-09-13: `rm -rf Local` destroyed 1,040 files because macOS folded the
// case. Both spellings must be stopped.
test('rm -rf local is blocked', () => blocks('rm -rf local'));
test('rm -rf Local is blocked (case variant)', () => blocks('rm -rf Local'));
test('rm -rf on the workspace root is blocked', () => blocks(`rm -rf ${ORG}`));

// ── 2. Evasions — each of these runs rm ──────────────────────────────────────
test('quoted command word', () => blocks("'rm' -rf local"));
test('double-quoted command word', () => blocks('"rm" -rf local'));
test('absolute path to binary', () => blocks('/bin/rm -rf local'));
test('after a harmless command', () => blocks('git status; rm -rf local'));
test('after &&', () => blocks('ls && rm -rf local'));
test('on a second line', () => blocks('ls\nrm -rf local'));
test('inside a subshell', () => blocks('(cd /tmp; rm -rf ' + ORG + '/local)'));
test('inside a brace group', () => blocks('{ rm -rf local; }'));
test('inside sh -c', () => blocks(`sh -c "rm -rf local"`));
test('inside bash -c with single quotes', () => blocks("bash -c 'rm -rf local'"));
test('nested sh -c inside a subshell', () => blocks(`(sh -c "rm -rf local")`));
test('piped into something', () => blocks('echo y | rm -rf local'));
test('runtime-built command word fails closed', () => blocks('$(echo rm) -rf local'));
test('backtick command word fails closed', () => blocks('`echo rm` -rf local'));
test('eval fails closed', () => blocks('eval "rm -rf local"'));

// ── 3. Not just -rf. Rule one is every deletion. ─────────────────────────────
test('plain rm of one file', () => blocks('rm notes.md'));
test('rm -r without -f', () => blocks('rm -r docs'));
test('rmdir', () => blocks('rmdir org'));
test('shred', () => blocks('shred -u secret.txt'));
test('unlink', () => blocks('unlink CLAUDE.md'));
test('find -delete', () => blocks('find . -name "*.tmp" -delete'));
test('find -exec rm', () => blocks('find . -type f -exec rm {} \;'));
test('git rm', () => blocks('git rm README.md'));
test('truncate to zero', () => blocks('truncate -s 0 org/ACTIVITY.md'));

// ── 4. Globs and variables are never guessed ─────────────────────────────────
test('glob target is blocked', () => blocks('rm -rf *'));
test('variable target is blocked', () => blocks('rm -rf $TARGET/'));
test('empty-variable footgun is blocked', () => blocks('rm -rf $EMPTY/'));

// ── 5. Catastrophic targets ──────────────────────────────────────────────────
test('rm -rf /', () => blocks('rm -rf /'));
test('rm -rf home', () => blocks('rm -rf ~'));
test('rm -rf ~/Downloads', () => blocks('rm -rf ~/Downloads'));

// ── 6. iCloud never ──────────────────────────────────────────────────────────
test('iCloud Mobile Documents', () => blocks('rm -rf "~/Library/Mobile Documents/x"'));
test('iCloud CloudDocs', () => blocks('rm "/Users/x/Library/CloudDocs/a.txt"'));

// ── 7. Git operations that destroy uncommitted work ──────────────────────────
test('git reset --hard', () => blocks('git reset --hard'));
test('git clean -fd', () => blocks('git clean -fd'));
test('git clean -fdx', () => blocks('git clean -fdx'));
test('git checkout --force', () => blocks('git checkout --force main'));
test('git branch -D', () => blocks('git branch -D feature'));
test('git stash drop', () => blocks('git stash drop'));
test('git push --force to main', () => blocks('git push --force origin main'));
test('git push -f', () => blocks('git push -f origin main'));
test('git filter-branch', () => blocks('git filter-branch --tree-filter x HEAD'));
test('git -C elsewhere reset --hard still caught', () => blocks('git -C /tmp/repo reset --hard'));

// ── 8. Scratch is free ───────────────────────────────────────────────────────
test('rm in /tmp allowed', () => allows('rm -rf /tmp/scratch'));
test('rm in /private/tmp allowed', () => allows('rm -rf /private/tmp/claude-501/x'));

// ── 9. False positives — ordinary work must not be blocked ───────────────────
test('ls', () => allows('ls -la'));
test('git status', () => allows('git status'));
test('git push (no force)', () => allows('git push origin main'));
test('git commit', () => allows('git commit -m "fix: thing"'));
test('git add', () => allows('git add -A'));
test('git checkout a branch', () => allows('git checkout -b feature'));
test('git clean --dry-run', () => allows('git clean -n'));
test('npm test', () => allows('npm test'));
test('grep for the word rm', () => allows('grep -rn "rm" docs/'));
test('a commit message mentioning delete', () => allows('git commit -m "delete the stale row"'));
test('echo mentioning rm -rf', () => allows('echo "never run rm -rf"'));
test('find without delete', () => allows('find . -name "*.md"'));
test('truncate to a real size', () => allows('truncate -s 10M big.bin'));
test('cat a file', () => allows('cat README.md'));
test('a heredoc containing rm -rf is text, not a command', () =>
  allows("cat > /tmp/notes.md <<'EOF'\nnever run rm -rf local\nEOF"));
test('safe-delete itself is allowed', () => allows('bin/safe-delete local/stale "reason"'));
test('bin/daily-sync', () => allows('bin/daily-sync'));

// ── 9b. Bypasses found by attacking the guard on 2026-09-21 ─────────────────
// Each of these got through the first implementation. They are tests now so a
// later refactor cannot quietly reopen them.
test('sudo rm -rf', () => blocks('sudo rm -rf local'));
test('doas rm -rf', () => blocks('doas rm -rf local'));
test('env wrapper', () => blocks('env rm -rf local'));
test('leading env assignment', () => blocks('FOO=1 rm -rf local'));
test('nohup wrapper', () => blocks('nohup rm -rf local'));
test('piped into xargs rm', () => blocks('find . -name "*.tmp" | xargs rm'));
test('xargs with -I', () => blocks('ls | xargs -I{} rm {}'));
test('mv into /dev/null', () => blocks('mv local /dev/null'));
test('cp /dev/null over a file', () => blocks('cp /dev/null org/ACTIVITY.md'));
test('bare truncating redirect', () => blocks(': > org/ACTIVITY.md'));
test('git worktree remove', () => blocks('git worktree remove local/wt'));
test('rsync --delete', () => blocks('rsync -a --delete src/ dst/'));
test('trash is not the sanctioned route', () => blocks('trash local'));
test('python inline rmtree', () => blocks(`python3 -c "import shutil; shutil.rmtree('local')"`));
test('perl inline unlink', () => blocks(`perl -e "unlink glob('local/*')"`));
test('node inline rmSync', () => blocks(`node -e "require('fs').rmSync('local',{recursive:true})"`));
test('ruby inline rm_rf', () => blocks(`ruby -e "FileUtils.rm_rf('local')"`));
test('git checkout .', () => blocks('git checkout .'));
test('git restore a path', () => blocks('git restore assets/js/site.js'));
test('tab-separated rm', () => blocks('rm\t-rf\tlocal'));
test('cd then rm dot', () => blocks('cd local && rm -rf .'));
test('split quoting in the target', () => blocks("rm -rf lo''cal"));

// Interpreters doing harmless work must still pass.
test('python running a real script', () => allows('python3 tools/build.py'));
test('node running a real script', () => allows('node tools/check-consistency.mjs'));
test('python printing', () => allows(`python3 -c "print('hello')"`));
test('git checkout -b', () => allows('git checkout -b feature/x'));
test('git checkout a branch name', () => allows('git checkout main'));

// ── 10. Parser units ─────────────────────────────────────────────────────────
test('commandBasename normalises path, case and .exe', () => {
  assert.strictEqual(commandBasename('/usr/bin/RM'), 'rm');
  assert.strictEqual(commandBasename('rm.exe'), 'rm');
  assert.strictEqual(commandBasename('git'), 'git');
});
test('splitSegments strips quotes from the command word', () => {
  const segs = allSegments("'rm' -rf x");
  assert.strictEqual(segs[0][0], 'rm');
});
test('heredoc body is stripped', () => {
  const out = stripHeredocBodies("cat <<'EOF'\nrm -rf /\nEOF\nls");
  assert.ok(!out.includes('rm -rf /'), 'heredoc body survived');
  assert.ok(out.includes('ls'), 'code after the heredoc was lost');
});
test('classifyPath zones', () => {
  assert.strictEqual(classifyPath('local', ORG).zone, ZONE.WORKSPACE);
  assert.strictEqual(classifyPath('/tmp/x', ORG).zone, ZONE.SCRATCH);
  assert.strictEqual(classifyPath('*.log', ORG).zone, ZONE.UNKNOWN);
  assert.strictEqual(classifyPath('$X', ORG).zone, ZONE.UNKNOWN);
});

// ── 11. The hook end to end ──────────────────────────────────────────────────
function hookExit(event, env = {}) {
  try {
    execFileSync('node', [path.join(ROOT, 'pretooluse.js')], {
      input: JSON.stringify(event),
      env: { ...process.env, ...env },
      stdio: ['pipe', 'pipe', 'pipe']
    });
    return 0;
  } catch (error) {
    return error.status;
  }
}
const bashEvent = command => ({ tool_name: 'Bash', cwd: ORG, tool_input: { command } });

test('hook exits 0 on a safe command', () =>
  assert.strictEqual(hookExit(bashEvent('ls -la')), 0));
test('hook exits 2 on rm -rf local', () =>
  assert.strictEqual(hookExit(bashEvent('rm -rf local')), 2));
test('hook blocks project scaffolding writes', () =>
  assert.strictEqual(hookExit({
    tool_name: 'Write', cwd: ORG,
    tool_input: { file_path: path.join(ORG, 'ci', 'deploy.yml') }
  }), 2));
test('hook allows ordinary writes', () =>
  assert.strictEqual(hookExit({
    tool_name: 'Write', cwd: ORG,
    tool_input: { file_path: path.join(ORG, 'docs', 'note.md') }
  }), 0));
test('ORG_GUARD=off overrides', () =>
  assert.strictEqual(hookExit(bashEvent('rm -rf local'), { ORG_GUARD: 'off' }), 0));
test('malformed event fails closed', () => {
  let status = 0;
  try {
    execFileSync('node', [path.join(ROOT, 'pretooluse.js')],
      { input: 'not json', stdio: ['pipe', 'pipe', 'pipe'] });
  } catch (error) { status = error.status; }
  assert.strictEqual(status, 2, 'malformed event should fail closed');
});

// ── Report ───────────────────────────────────────────────────────────────────
console.log(`\n  ${pass} passed, ${fail} failed\n`);
if (fail > 0) {
  for (const f of failures) console.log(`  FAIL  ${f}\n`);
  process.exit(1);
}
process.exit(0);
