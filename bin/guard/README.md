# Org guard

A `PreToolUse` hook that stops destructive commands before they run.

## Why it exists

On 2026-09-13 `rm -rf Local` destroyed 1,040 files: seven project clones, the
offline practice exam, private client deliverables, every local backup, and git
bundles of rescued unpushed work. macOS folds case, so `Local` and `local` were
the same directory. `rm` bypasses the Trash and no Time Machine destination
exists on this Mac. Only the GitHub-backed clones came back.

Rule one went into `CLAUDE.md` the same day: nothing is ever deleted, it is
moved to quarantine with `bin/safe-delete`.

A rule in `CLAUDE.md` holds only while every agent reads it and chooses to
comply. This holds regardless. It runs before the command does.

## What it does

```
Claude Code  ──PreToolUse event──>  bin/guard/pretooluse.js
                                       │
                                       ├── lib/shell.js     tokenise like a shell
                                       ├── lib/classify.js  is this destructive?
                                       ├── lib/policy.js    where does it point?
                                       └── lib/decide.js    verdict + the way forward
                                       │
                          exit 0 allow │ exit 2 block, stderr goes back to the model
```

A block is never a dead end. It names the rule and prints the exact
`bin/safe-delete` command to run instead, because a block with no route forward
gets worked around, and working around gates is how the next incident starts.

### Decisions by zone

| Target | Verdict |
|---|---|
| Inside the workspace | blocked, routed to `bin/safe-delete` |
| iCloud Drive | blocked outright, a delete propagates to every device |
| `/tmp`, `/private/tmp`, `$CLAUDE_JOB_DIR` | allowed, scratch is for this |
| Anywhere else on disk | blocked, needs Atharva's yes for that exact path |
| `/`, `$HOME`, `/Users`, `~/Downloads` | blocked outright |
| A glob, a variable, unresolvable | blocked, the guard never guesses |

That last row matters most. `rm -rf $EMPTY/` is how home directories disappear.

## Why a parser and not a regex

`/\brm\s+-rf\b/` is decoration. Every one of these runs `rm`:

```bash
'rm' -rf local            $(echo rm) -rf local      /bin/rm -rf local
(cd /; rm -rf local)      { rm -rf local; }         sh -c 'rm -rf local'
git status; rm -rf local  sudo rm -rf local         FOO=1 rm -rf local
ls | xargs rm             bash payload.sh           python3 -c "shutil.rmtree('local')"
```

So the guard tokenises the way a shell does: quote-aware splitting on unquoted
`;` `|` `&` and newlines, wrapper stripping (`sudo`, `env`, `nice`, leading
`VAR=`), recursion into `$( )`, backticks, `( )`, `{ ; }` and `sh -c`, and
heredoc bodies treated as data rather than code. `bash script.sh` is followed
by reading the script.

ECC's GateGuard, which this borrows from, shipped a naive splitter and got
CVE'd for it (GHSA-4v57-ph3x-gf55). The lesson was free; the bug was not.

## Stricter than GateGuard, on purpose

GateGuard gates `rm` only when `-r` AND `-f` are both present. That is the wrong
bar here. Rule one is that nothing is deleted, so `rm notes.md` is as much a
violation as `rm -rf local`, and both are blocked.

## Running it

```bash
node bin/guard/doctor.js      # is it installed and actually blocking?
node bin/guard/tests/run.js   # 101 cases: evasions caught, ordinary work not
```

The hook is registered in `.claude/settings.json`, which is committed for
exactly one reason: on a fresh clone an unregistered hook never runs, and a
guard that is not installed is not a guard.

## Override

```bash
ORG_GUARD=off <command>
```

Deliberate, visible, rare, and the same switch `.githooks/pre-commit` uses. A
gate firing is a signal to pause and ask, never an obstacle to engineer around.
If a block is wrong, say so out loud before overriding.

## What it does not catch

Stated plainly, because a guard whose limits are unknown gets trusted further
than it earns.

- **Compiled binaries and unknown tools.** A Go program that deletes files is
  opaque. The guard classifies commands, not behaviour.
- **Interpreter tricks below the heuristic.** Inline `python -c` is matched on
  deletion-API text. Enough indirection (`getattr(shutil, 'rm' + 'tree')`)
  defeats that.
- **Scripts it cannot read.** `bash script.sh` is followed when the file is
  readable and under 256 KB. A generated or remote script is not.
- **Shell aliases and functions** defined earlier in a session.
- **Anything outside the Bash and Write tool paths**, including work done by a
  separate process the hook never sees.

It is a floor, not a ceiling. It makes the 2026-09-13 class of accident
mechanically impossible and raises the cost of the rest. Treat it as one layer
alongside `bin/safe-delete`, `.githooks/pre-commit`, and reading before removing.
