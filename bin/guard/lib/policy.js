'use strict';
/**
 * policy.js — where the org's rules become data.
 *
 * Paths and classifications live here so a guard never hardcodes a location
 * and a rule change is a one-line edit in one file.
 */

const path = require('path');
const os = require('os');

const HOME = os.homedir();

/** The workspace rule one protects. */
const ORG_ROOT = process.env.ORG_ROOT || path.join(HOME, 'Downloads', 'organisation');

/** Where safe-delete moves things instead of destroying them. */
const QUARANTINE = path.join(HOME, 'Downloads', '_QUARANTINE - safe to delete');

/** The sanctioned route for removing anything. */
const SAFE_DELETE = path.join(ORG_ROOT, 'bin', 'safe-delete');

/**
 * Scratch areas where destruction is fine: session scratchpads and system
 * temp. Testing never touches real data, so it has to have somewhere to go.
 */
const SCRATCH_PREFIXES = [
  '/tmp/',
  '/private/tmp/',
  '/var/folders/',
  path.join(os.tmpdir(), path.sep),
  ...(process.env.CLAUDE_JOB_DIR ? [path.join(process.env.CLAUDE_JOB_DIR, path.sep)] : [])
];

/** iCloud is read-only as far as deletion goes: a delete propagates to every device. */
const ICLOUD_MARKERS = ['Mobile Documents', 'CloudDocs', 'iCloud Drive'];

/** Classification of a filesystem target. */
const ZONE = {
  WORKSPACE: 'workspace',   // inside the org repo — safe-delete only
  ICLOUD: 'icloud',         // never, under any circumstances
  SCRATCH: 'scratch',       // free to destroy
  OUTSIDE: 'outside',       // elsewhere on the disk — needs Atharva's explicit yes
  UNKNOWN: 'unknown'        // could not be resolved — fail closed
};

/**
 * Classify a path argument without touching the filesystem.
 *
 * Resolution is deliberately conservative: anything containing a variable, a
 * substitution or a glob is UNKNOWN rather than guessed, because guessing is
 * how `rm -rf $EMPTY_VAR/` erases a home directory.
 *
 * @param {string} target raw token as written on the command line
 * @param {string} [cwd] directory the command would run in
 * @returns {{ zone: string, resolved: string|null, reason?: string }}
 */
function classifyPath(target, cwd = process.cwd()) {
  const raw = String(target || '').trim();
  if (!raw) return { zone: ZONE.UNKNOWN, resolved: null, reason: 'empty path' };

  if (/[$`]/.test(raw)) {
    return { zone: ZONE.UNKNOWN, resolved: null, reason: 'contains a variable or substitution' };
  }
  if (/[*?]|\[[^\]]*\]/.test(raw)) {
    return { zone: ZONE.UNKNOWN, resolved: null, reason: 'contains a glob' };
  }

  const expanded = raw.startsWith('~') ? path.join(HOME, raw.slice(1)) : raw;
  const resolved = path.resolve(cwd, expanded);

  if (ICLOUD_MARKERS.some(m => resolved.includes(m))) {
    return { zone: ZONE.ICLOUD, resolved };
  }
  if (SCRATCH_PREFIXES.some(p => resolved.startsWith(p))) {
    return { zone: ZONE.SCRATCH, resolved };
  }
  if (resolved === ORG_ROOT || resolved.startsWith(ORG_ROOT + path.sep)) {
    return { zone: ZONE.WORKSPACE, resolved };
  }
  return { zone: ZONE.OUTSIDE, resolved };
}

/** Root-ish paths that must never be a destructive target, whatever the zone. */
function isCatastrophic(resolved) {
  if (!resolved) return false;
  const p = resolved.replace(/\/+$/, '') || '/';
  return p === '/' || p === HOME || p === '/Users' || p === '/System'
    || p === '/Applications' || p === '/Library' || p === HOME + '/Downloads';
}

module.exports = {
  HOME,
  ORG_ROOT,
  QUARANTINE,
  SAFE_DELETE,
  SCRATCH_PREFIXES,
  ICLOUD_MARKERS,
  ZONE,
  classifyPath,
  isCatastrophic
};
