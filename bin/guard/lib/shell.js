'use strict';
/**
 * shell.js — quote-aware shell parsing for the org guard.
 *
 * Why this exists rather than a regex:
 *   /\brm\s+-rf\b/ is trivially bypassed. Every one of these runs `rm`:
 *       rm -rf local          'rm' -rf local        "rm" -rf local
 *       $(echo rm) -rf local  `echo rm` -rf local
 *       (cd /; rm -rf local)  { rm -rf local; }
 *       sh -c 'rm -rf local'  /bin/rm -rf local
 *       git status; rm -rf local
 *   A classifier that misses any of them is decoration, not a guard.
 *
 * Approach adapted from ECC's GateGuard (github.com/affaan-m/ECC, MIT) whose
 * naive splitter was itself bypassed — see GHSA-4v57-ph3x-gf55. The fix there,
 * and here, is to tokenise the way the shell does instead of matching text.
 *
 * Everything in this file is pure and synchronous. No I/O, no dependencies.
 */

const SEGMENT_SEPARATORS = new Set([';', '|', '&', '\n', '\r']);

/**
 * Remove heredoc bodies. Their contents are data handed to a command's stdin,
 * not commands the shell runs, so `cat <<'EOF' ... rm -rf / ... EOF` is text.
 * Keeping them would produce false blocks on every doc written via heredoc —
 * which is how this very file was created.
 *
 * @param {string} input
 * @returns {string}
 */
function stripHeredocBodies(input) {
  const source = String(input || '');
  if (!source.includes('<<')) return source;

  const lines = source.split('\n');
  const kept = [];
  let terminator = null;
  let stripTabs = false;

  for (const line of lines) {
    if (terminator !== null) {
      const probe = stripTabs ? line.replace(/^\t+/, '') : line;
      if (probe.trim() === terminator) terminator = null;
      continue;
    }

    // <<EOF  <<-EOF  <<'EOF'  <<"EOF"  — last one on the line wins the body.
    const marks = [...line.matchAll(/<<(-?)\s*(['"]?)([A-Za-z_][A-Za-z0-9_]*)\2/g)];
    kept.push(line);
    if (marks.length > 0) {
      const last = marks[marks.length - 1];
      stripTabs = last[1] === '-';
      terminator = last[3];
    }
  }

  return kept.join('\n');
}

/**
 * Split a command line into segments of tokens, the way a shell would.
 *
 * Splits only on UNQUOTED `;`, `|`, `&` and newlines, and strips quotes from
 * the resulting words so a quoted command name (`'rm'`) normalises to `rm`.
 *
 * @param {string} input
 * @returns {string[][]} one token array per segment, empties dropped
 */
function splitSegments(input) {
  const source = String(input || '');
  const segments = [];
  let tokens = [];
  let current = '';
  let hasWord = false;
  let quote = null;

  const flushWord = () => {
    if (hasWord) tokens.push(current);
    current = '';
    hasWord = false;
  };
  const flushSegment = () => {
    flushWord();
    if (tokens.length > 0) segments.push(tokens);
    tokens = [];
  };

  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];

    if (ch === '\\' && quote !== "'") {
      const next = source[i + 1];
      if (next !== undefined && next !== '\n') {
        current += next;
        hasWord = true;
        i += 1;
      }
      continue;
    }
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
      hasWord = true;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch;
      hasWord = true;           // entering a quote starts a word, even if empty
      continue;
    }
    if (SEGMENT_SEPARATORS.has(ch)) {
      flushSegment();
      continue;
    }
    if (/\s/.test(ch)) {
      flushWord();
      continue;
    }
    current += ch;
    hasWord = true;
  }
  flushSegment();
  return segments;
}

/**
 * Strip directory and a trailing .exe so `/bin/rm`, `rm.exe` and `RM` all
 * normalise to `rm`. Case is folded because macOS resolves `RM` to `rm`.
 *
 * @param {string} token
 * @returns {string}
 */
function commandBasename(token) {
  if (!token) return '';
  return String(token).replace(/^.*[\\/]/, '').replace(/\.exe$/i, '').toLowerCase();
}

/**
 * Walk `$( )`, backtick, `( )` and `{ ; }` spans and yield each body, so a
 * command hidden one level down is still classified. Recurses into what it
 * finds, with a depth cap so a pathological input cannot spin.
 *
 * @param {string} input
 * @param {number} [depth]
 * @returns {string[]}
 */
function extractNestedCommands(input, depth = 0) {
  const source = String(input || '');
  if (depth > 6 || !source) return [];

  const found = [];
  let inSingle = false;
  let inDouble = false;

  /** Read a balanced span, honouring nested quotes. */
  const readBalanced = (startIndex, open, close) => {
    let body = '';
    let level = 1;
    let q = null;
    let i = startIndex;
    while (i < source.length && level > 0) {
      const c = source[i];
      if (c === '\\' && q !== "'") {
        body += c + (source[i + 1] ?? '');
        i += 2;
        continue;
      }
      if (q) {
        if (c === q) q = null;
      } else if (c === "'" || c === '"') {
        q = c;
      } else if (c === open) {
        level += 1;
      } else if (c === close) {
        level -= 1;
        if (level === 0) break;
      }
      body += c;
      i += 1;
    }
    return { body, endIndex: i };
  };

  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];

    if (ch === '\\' && !inSingle) { i += 1; continue; }
    if (ch === "'" && !inDouble) { inSingle = !inSingle; continue; }
    if (ch === '"' && !inSingle) { inDouble = !inDouble; continue; }
    if (inSingle) continue;                 // single quotes are fully literal

    // $( ) survives inside double quotes; bare ( ) and { } do not.
    if (ch === '$' && source[i + 1] === '(') {
      const { body, endIndex } = readBalanced(i + 2, '(', ')');
      i = endIndex;
      if (body.trim()) found.push(body);
      continue;
    }
    if (inDouble) continue;

    if (ch === '`') {
      let body = '';
      let j = i + 1;
      while (j < source.length && source[j] !== '`') {
        if (source[j] === '\\') { body += source[j + 1] ?? ''; j += 2; continue; }
        body += source[j];
        j += 1;
      }
      i = j;
      if (body.trim()) found.push(body);
      continue;
    }
    if (ch === '(') {
      const { body, endIndex } = readBalanced(i + 1, '(', ')');
      i = endIndex;
      if (body.trim()) found.push(body);
      continue;
    }
    // `{` opens a brace group only as a reserved word: whitespace after it and
    // a boundary before it. `{foo}` is brace expansion, not a group.
    if (ch === '{' && /\s/.test(source[i + 1] || '')) {
      const prev = source[i - 1];
      if (i === 0 || /[\s;|&(]/.test(prev)) {
        const { body, endIndex } = readBalanced(i + 1, '{', '}');
        i = endIndex;
        if (body.trim()) found.push(body);
        continue;
      }
    }
  }

  const nested = [];
  for (const body of found) nested.push(...extractNestedCommands(body, depth + 1));
  return [...found, ...nested];
}

/** Shell wrappers whose `-c` argument is another command line. */
const SHELL_WRAPPERS = new Set(['sh', 'bash', 'zsh', 'dash', 'ksh', 'fish']);

/**
 * Every executable command line reachable from `input`: the line itself, each
 * nested span, and the body of any `sh -c '...'` wrapper.
 *
 * @param {string} input
 * @param {number} [depth]
 * @returns {string[]}
 */
function allCommandLines(input, depth = 0) {
  const base = stripHeredocBodies(input);
  if (depth > 4) return [base];

  const lines = [base, ...extractNestedCommands(base)];
  const expanded = [];

  for (const line of lines) {
    expanded.push(line);
    for (const tokens of splitSegments(line)) {
      if (tokens.length === 0) continue;
      if (!SHELL_WRAPPERS.has(commandBasename(tokens[0]))) continue;
      const flag = tokens.findIndex(t => t === '-c');
      const payload = flag !== -1 ? tokens[flag + 1] : undefined;
      if (payload) expanded.push(...allCommandLines(payload, depth + 1));
    }
  }
  return expanded;
}

/**
 * Flatten `input` to every token array the shell would execute.
 *
 * @param {string} input
 * @returns {string[][]}
 */
function allSegments(input) {
  const out = [];
  for (const line of allCommandLines(input)) out.push(...splitSegments(line));
  return out;
}

module.exports = {
  allCommandLines,
  allSegments,
  commandBasename,
  extractNestedCommands,
  splitSegments,
  stripHeredocBodies,
  SHELL_WRAPPERS
};
