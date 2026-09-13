#!/usr/bin/env python3
"""Apply the WORKSPACE PATHS block to every agent CLAUDE.md.

One canonical statement of where things live, injected into all 89 agent
files. Idempotent — re-running replaces the block rather than duplicating it.
Companion to gstack_role_blocks.py; both are run from the organisation root.

    python3 knowledge/protocols/workspace_paths_block.py
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
BEGIN, END = "<!-- PATHS-BLOCK:BEGIN -->", "<!-- PATHS-BLOCK:END -->"

BLOCK = f"""{BEGIN}

## Where things live — read before writing any file

This repository is **public**. Two halves, and mixing them up publishes
something that should not be published.

### Tracked and pushed
`agents/` · `bin/` · `knowledge/protocols/` ·
`knowledge/lessons-learned/PLAYBOOK.md` · `WORKSPACE.md` · `CLAUDE.md` ·
`README.md` · `bin/` · `.githooks/`.

### `local/` — never pushed, ignored wholesale
Everything machine-only lives under one root:

```
local/repos/          working clones of the GitHub repos
                      each has its own _local/ scratch folder, excluded by
                      that clone's .git/info/exclude
local/practice-exam/  offline practice exam — not a repo, never push it
local/client-work/    private client material
local/tools/          local-only scripts
local/backups/        pre-edit file backups
local/rescued/        git bundles of work recovered from deleted clones
```

**Working on one of Atharva's projects?** It is in `local/repos/<name>/`.
Fetch before you touch it — a stale clone that gets pushed reverts live work:

```bash
cd local/repos/<name> && git fetch origin && git status
```

Scratch notes for that project go in its `_local/`, beside the code, never in
the repo root and never in a shared dump.

### Operational logs are untracked too
`org/ACTIVITY.md`, `org/DECISIONS.md`, `org/COMPANY_LOG.md`, `org/STATUS.md`,
`org/BLOCKERS.md`, `org/LIVE.md`, `org/bugs/` and `review/SIGN_OFFS.md` are
gitignored — they accumulate real client names and internal detail. Still
write to them; just never `git add -f` them. `bin/bootstrap-org` recreates
them from `org/templates/` on a fresh clone.

Full detail: `local/README.md` and `WORKSPACE.md`.

{END}
"""


def main() -> int:
    files = sorted((ROOT / "agents").rglob("CLAUDE.md"))
    if not files:
        print("no agent CLAUDE.md files found", file=sys.stderr)
        return 1
    for f in files:
        t = f.read_text()
        if BEGIN in t:
            t = re.sub(re.escape(BEGIN) + r".*?" + re.escape(END) + r"\n?", BLOCK, t, flags=re.S)
        else:
            t = t.rstrip("\n") + "\n\n" + BLOCK
        f.write_text(t)
    print(f"paths block applied to {len(files)} agent files")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
