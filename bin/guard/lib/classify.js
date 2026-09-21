'use strict';
/**
 * classify.js — decide whether a token array destroys something, and what.
 *
 * Each classifier returns null (harmless) or a finding:
 *   { kind, command, targets: string[], detail }
 *
 * `targets` is the raw operand text. Resolution is policy.js's job; keeping
 * them separate means the classifier stays pure and testable.
 */

const { commandBasename } = require('./shell');

/** Split a token list into flags and operands, honouring `--`. */
function operands(tokens) {
  const out = [];
  let endOfFlags = false;
  for (const t of tokens.slice(1)) {
    if (!endOfFlags && t === '--') { endOfFlags = true; continue; }
    if (!endOfFlags && t.startsWith('-') && t.length > 1) continue;
    out.push(t);
  }
  return out;
}

/** True if any short or long flag in `tokens` matches `re`. */
function hasFlag(tokens, re) {
  return tokens.slice(1).some(t => t.startsWith('-') && re.test(t));
}

/** Commands that remove files outright. */
const REMOVERS = new Set(['rm', 'rmdir', 'shred', 'unlink', 'srm', 'trash']);

/**
 * Any removal at all — not just `rm -rf`.
 *
 * ECC's GateGuard only gates `-r` AND `-f` together. That is the wrong bar for
 * this workspace: rule one is that nothing is ever deleted, so a bare
 * `rm notes.md` is just as much a violation as `rm -rf local`.
 */
function classifyRemove(tokens) {
  if (tokens.length === 0) return null;
  const cmd = commandBasename(tokens[0]);
  if (!REMOVERS.has(cmd)) return null;
  return {
    kind: 'delete',
    command: cmd,
    targets: operands(tokens),
    detail: `${cmd} removes files permanently; macOS ${cmd} bypasses the Trash`
  };
}

/** `find ... -delete` and `find ... -exec rm ...`. */
function classifyFind(tokens) {
  if (tokens.length === 0 || commandBasename(tokens[0]) !== 'find') return null;

  const rest = tokens.slice(1);
  const deleteFlag = rest.includes('-delete');
  const execIndex = rest.findIndex(t => t === '-exec' || t === '-execdir'
    || t === '-ok' || t === '-okdir');
  const execCmd = execIndex !== -1 ? commandBasename(rest[execIndex + 1]) : '';
  const execDestroys = REMOVERS.has(execCmd) || execCmd === 'truncate';

  if (!deleteFlag && !execDestroys) return null;

  // Operands before the first predicate are the search roots.
  const roots = [];
  for (const t of rest) {
    if (t.startsWith('-')) break;
    roots.push(t);
  }
  return {
    kind: 'delete',
    command: 'find',
    targets: roots.length ? roots : ['.'],
    detail: deleteFlag
      ? 'find -delete removes every match, with no listing first'
      : `find -exec ${execCmd} removes every match, with no listing first`
  };
}

/** Redirections that empty an existing file, and dd/truncate. */
function classifyTruncate(tokens) {
  if (tokens.length === 0) return null;
  const cmd = commandBasename(tokens[0]);

  if (cmd === 'truncate') {
    // Size arrives as `-s 0`, `-s0`, `--size=0` or `--size 0`. Only an exact
    // zero empties the file; `-s 10M` merely resizes and must not be flagged.
    let size = null;
    let consumed = null;
    for (let i = 1; i < tokens.length; i += 1) {
      const t = tokens[i];
      if (t === '-s' || t === '--size') { size = tokens[i + 1]; consumed = tokens[i + 1]; break; }
      if (t.startsWith('--size=')) { size = t.slice(7); break; }
      if (/^-s.+/.test(t)) { size = t.slice(2); break; }
    }
    if (size !== undefined && size !== null && /^[+-]?0+$/.test(String(size).trim())) {
      return {
        kind: 'truncate',
        command: 'truncate',
        targets: operands(tokens).filter(t => t !== consumed),
        detail: 'truncate -s 0 empties the file in place, keeping the name'
      };
    }
    return null;
  }

  if (cmd === 'dd') {
    const of = tokens.find(t => t.startsWith('of='));
    if (of) {
      return {
        kind: 'truncate',
        command: 'dd',
        targets: [of.slice(3)],
        detail: 'dd of= overwrites the destination from the first byte'
      };
    }
  }
  return null;
}

/** git subcommand, skipping git's own value-taking global options. */
function gitSubcommand(tokens) {
  if (tokens.length === 0 || commandBasename(tokens[0]) !== 'git') return null;
  const takesValue = new Set(['-c', '-C', '--git-dir', '--work-tree', '--namespace']);
  let i = 1;
  while (i < tokens.length) {
    const t = tokens[i];
    if (takesValue.has(t)) { i += 2; continue; }
    if (t.startsWith('-')) { i += 1; continue; }
    return { name: t.toLowerCase(), rest: tokens.slice(i + 1), all: tokens };
  }
  return null;
}

const SHARED_BRANCHES = new Set(['main', 'master', 'develop', 'trunk']);

/**
 * Git operations that destroy work which was never committed, or rewrite
 * history other clones are built on. `git bundle` of rescued work exists in
 * local/rescued/ precisely because this class of command ran once already.
 */
function classifyGit(tokens) {
  const sub = gitSubcommand(tokens);
  if (!sub) return null;
  const { name, rest, all } = sub;
  const flags = ['git', ...rest];

  if (name === 'reset' && hasFlag(flags, /^--hard$/)) {
    return { kind: 'git-destructive', command: 'git reset --hard', targets: [],
      detail: 'discards every uncommitted change in the working tree' };
  }
  if (name === 'clean' && hasFlag(flags, /^-[a-z]*[fx]|^--force$/i)) {
    return { kind: 'git-destructive', command: 'git clean', targets: rest.filter(t => !t.startsWith('-')),
      detail: 'deletes untracked files outright, including ignored ones with -x' };
  }
  if (name === 'checkout' || name === 'restore') {
    const forced = hasFlag(flags, /^(-f|--force)$/) || rest.includes('--');
    // `git checkout .` and `git restore src/` overwrite the working tree from
    // the index with no flag at all. Creating a branch (-b/-B) is not that.
    const makesBranch = hasFlag(flags, /^-[bB]$/);
    const pathOperand = !makesBranch && rest.some(t => t === '.' || t.includes('/') || t.endsWith('.md') || t.endsWith('.js'));
    if (forced || pathOperand) {
      return { kind: 'git-destructive', command: `git ${name}`, targets: [],
        detail: 'overwrites working-tree files from the index, losing local edits' };
    }
    return null;
  }
  if (name === 'branch' && hasFlag(flags, /^-[a-zA-Z]*D/)) {
    return { kind: 'git-destructive', command: 'git branch -D', targets: rest.filter(t => !t.startsWith('-')),
      detail: 'force-deletes a branch even if it is unmerged' };
  }
  if (name === 'stash' && (rest.includes('drop') || rest.includes('clear'))) {
    return { kind: 'git-destructive', command: 'git stash drop/clear', targets: [],
      detail: 'discards stashed work with no reflog entry to recover from' };
  }
  if (name === 'rm') {
    return { kind: 'delete', command: 'git rm', targets: operands(['git', ...rest]),
      detail: 'git rm deletes the file from the working tree, not just the index' };
  }
  if (name === 'push' && hasFlag(flags, /^(-f|--force)$/)) {
    const branch = rest.filter(t => !t.startsWith('-')).pop() || '';
    const shared = SHARED_BRANCHES.has(branch.replace(/^.*:/, ''));
    return { kind: 'git-history', command: 'git push --force', targets: [branch],
      detail: shared
        ? `force-pushing ${branch} rewrites history every other clone is built on`
        : 'force-push rewrites remote history' };
  }
  if (name === 'filter-branch' || name === 'filter-repo') {
    return { kind: 'git-history', command: `git ${name}`, targets: [],
      detail: 'rewrites every commit; local clones must be reconciled or they re-leak' };
  }
  return null;
}

/**
 * Wrapper commands that run another command. `sudo rm -rf local` must be read
 * as `rm -rf local`, not waved through because token 0 happened to be `sudo`.
 */
const WRAPPERS = new Set(['sudo', 'doas', 'env', 'nice', 'ionice', 'nohup',
  'time', 'command', 'builtin', 'setsid', 'stdbuf', 'timeout', 'caffeinate']);

/** Wrapper flags that swallow the following token as their value. */
const WRAPPER_VALUE_FLAGS = new Set(['-u', '-g', '-p', '-C', '-n', '-k', '-s', '--user', '--group']);

/**
 * Strip wrapper commands and leading env assignments so the real command word
 * is at index 0. Returns the same array when there is nothing to strip.
 *
 * @param {string[]} tokens
 * @param {number} [depth]
 * @returns {string[]}
 */
function unwrap(tokens, depth = 0) {
  if (depth > 4 || tokens.length === 0) return tokens;

  // Leading VAR=value assignments: `FOO=1 rm -rf x`.
  let i = 0;
  while (i < tokens.length && /^[A-Za-z_][A-Za-z0-9_]*=/.test(tokens[i])) i += 1;
  if (i > 0) return unwrap(tokens.slice(i), depth + 1);

  if (!WRAPPERS.has(commandBasename(tokens[0]))) return tokens;

  i = 1;
  while (i < tokens.length) {
    const t = tokens[i];
    if (WRAPPER_VALUE_FLAGS.has(t)) { i += 2; continue; }
    if (t.startsWith('-')) { i += 1; continue; }
    if (/^[A-Za-z_][A-Za-z0-9_]*=/.test(t)) { i += 1; continue; }
    break;
  }
  return i < tokens.length ? unwrap(tokens.slice(i), depth + 1) : tokens;
}

/**
 * `... | xargs rm` — the remover is real but its operands arrive on stdin, so
 * the targets cannot be known ahead of time. Unknown targets fail closed.
 */
function classifyXargs(tokens) {
  if (tokens.length === 0 || commandBasename(tokens[0]) !== 'xargs') return null;
  let i = 1;
  const valueFlags = new Set(['-I', '-i', '-n', '-P', '-s', '-d', '-E', '-a', '--replace', '--max-args']);
  while (i < tokens.length) {
    const t = tokens[i];
    if (valueFlags.has(t)) { i += 2; continue; }
    if (t.startsWith('-')) { i += 1; continue; }
    break;
  }
  const inner = unwrap(tokens.slice(i));
  const cmd = commandBasename(inner[0]);
  if (!REMOVERS.has(cmd) && cmd !== 'truncate') return null;
  return {
    kind: 'delete',
    command: `xargs ${cmd}`,
    targets: ['$STDIN'],           // deliberately unresolvable — fails closed
    detail: `xargs ${cmd} removes whatever the pipe feeds it, which cannot be checked in advance`
  };
}

/** `mv <path> /dev/null` destroys the source just as surely as rm. */
function classifyMv(tokens) {
  if (tokens.length === 0 || commandBasename(tokens[0]) !== 'mv') return null;
  const ops = operands(tokens);
  if (ops.length < 2) return null;
  const dest = ops[ops.length - 1];
  if (!/^\/dev\/null\/?$/.test(dest)) return null;
  return {
    kind: 'delete',
    command: 'mv to /dev/null',
    targets: ops.slice(0, -1),
    detail: 'moving into /dev/null destroys the source with no recovery'
  };
}

/** `cp /dev/null FILE` and `: > FILE` are the shell's truncation idioms. */
function classifyTruncateIdiom(tokens) {
  if (tokens.length === 0) return null;
  const cmd = commandBasename(tokens[0]);

  if (cmd === 'cp') {
    const ops = operands(tokens);
    if (ops.length === 2 && /^\/dev\/null$/.test(ops[0])) {
      return { kind: 'truncate', command: 'cp /dev/null', targets: [ops[1]],
        detail: 'copying /dev/null over a file empties it in place' };
    }
    return null;
  }

  // `: > file` / `true > file` — a no-op command whose only effect is the
  // truncating redirect. A redirect after a real command is ordinary writing
  // and is deliberately not flagged.
  if (cmd === ':' || cmd === 'true') {
    const gt = tokens.indexOf('>');
    const target = gt !== -1 ? tokens[gt + 1] : tokens.slice(1).find(t => t.startsWith('>'))?.slice(1);
    if (target) {
      return { kind: 'truncate', command: `${cmd} >`, targets: [target],
        detail: 'a bare redirect over an existing file empties it' };
    }
  }
  return null;
}

/** `git worktree remove` deletes the worktree directory from disk. */
function classifyWorktree(tokens) {
  const sub = gitSubcommand(tokens);
  if (!sub || sub.name !== 'worktree') return null;
  if (!sub.rest.includes('remove') && !sub.rest.includes('prune')) return null;
  return {
    kind: 'delete',
    command: 'git worktree remove',
    targets: sub.rest.filter(t => !t.startsWith('-') && t !== 'remove' && t !== 'prune'),
    detail: 'removing a worktree deletes its directory, including uncommitted work in it'
  };
}

/** `rsync --delete` removes files in the destination that are not in the source. */
function classifyRsync(tokens) {
  if (tokens.length === 0 || commandBasename(tokens[0]) !== 'rsync') return null;
  if (!tokens.some(t => t.startsWith('--delete'))) return null;
  const ops = operands(tokens);
  return {
    kind: 'delete',
    command: 'rsync --delete',
    targets: ops.length ? [ops[ops.length - 1]] : [],
    detail: 'rsync --delete removes destination files that are absent from the source'
  };
}

/**
 * Interpreters that take a program on the command line. `python3 -c
 * "shutil.rmtree('local')"` deletes exactly as thoroughly as `rm -rf local`
 * while containing no shell command at all, so token classification alone
 * never sees it.
 */
const INTERPRETERS = new Map([
  ['python', '-c'], ['python2', '-c'], ['python3', '-c'],
  ['perl', '-e'], ['ruby', '-e'], ['php', '-r'],
  ['node', '-e'], ['nodejs', '-e'], ['bun', '-e'], ['deno', '-e']
]);

/**
 * Deletion APIs across those languages. Matching on source text is a
 * heuristic, not a parse, and it is deliberately tuned to over-block: an
 * inline one-liner that mentions rmtree almost certainly calls it, and the
 * cost of a false block is one clear message versus an unrecoverable delete.
 */
const DELETE_APIS = new RegExp([
  // Python
  'shutil\\.rmtree', 'os\\.remove', 'os\\.unlink', 'os\\.rmdir', 'os\\.removedirs',
  '\\.unlink\\s*\\(', '\\brmtree\\b',
  // Perl / Ruby
  '\\bunlink\\b', '\\brm_rf\\b', '\\brm_r\\b', 'FileUtils\\.rm',
  // Node
  '\\brmSync\\b', '\\brmdirSync\\b', '\\bunlinkSync\\b', 'fs\\.rm\\b', 'promises\\.rm\\b',
  // Rust / general
  'remove_dir_all', '\\bshred\\b'
].join('|'), 'i');

/**
 * Inline interpreter programs that delete. Targets are unresolvable from the
 * outside, so these always fail closed.
 */
function classifyInterpreter(tokens) {
  if (tokens.length === 0) return null;
  const cmd = commandBasename(tokens[0]).replace(/[0-9.]+$/, '') || commandBasename(tokens[0]);
  const flag = INTERPRETERS.get(commandBasename(tokens[0])) || INTERPRETERS.get(cmd);
  if (!flag) return null;

  const idx = tokens.indexOf(flag);
  const program = idx !== -1 ? tokens[idx + 1] : null;
  if (!program || !DELETE_APIS.test(program)) return null;

  return {
    kind: 'delete',
    command: `${commandBasename(tokens[0])} ${flag}`,
    targets: ['$INLINE_PROGRAM'],      // unresolvable by construction
    detail: `an inline ${commandBasename(tokens[0])} program calls a file-deletion API`
  };
}

const CLASSIFIERS = [classifyRemove, classifyFind, classifyTruncate, classifyGit, classifyInterpreter,
  classifyXargs, classifyMv, classifyTruncateIdiom, classifyWorktree, classifyRsync];

/**
 * Run every classifier over one token array.
 *
 * @param {string[]} tokens
 * @returns {object[]} findings, possibly empty
 */
function classifySegment(rawTokens) {
  const findings = [];
  // `sudo rm -rf x` and `FOO=1 rm -rf x` must classify as `rm -rf x`.
  const tokens = unwrap(rawTokens);
  for (const fn of CLASSIFIERS) {
    const found = fn(tokens);
    if (found) findings.push(found);
  }
  return findings;
}

module.exports = { classifySegment, operands, hasFlag, gitSubcommand, unwrap, REMOVERS, WRAPPERS };
