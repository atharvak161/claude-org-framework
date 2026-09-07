#!/usr/bin/env python3
"""Apply the role-scoped gstack block to every agent CLAUDE.md.

SSOT for the catalogue is knowledge/protocols/GSTACK_PROTOCOL.md. This script
writes only a thin, role-scoped pointer into each agent file, so when gstack
changes, the protocol file changes and this map changes -- not 89 hand-edits.

Idempotent: re-running replaces the existing block rather than duplicating it.
Run from the organisation root:  python3 knowledge/protocols/gstack_role_blocks.py
"""
import pathlib, re, sys

ROOT = pathlib.Path(__file__).resolve().parents[2]
BEGIN = "<!-- GSTACK-BLOCK:BEGIN -->"
END = "<!-- GSTACK-BLOCK:END -->"

# Skills every single agent uses, regardless of role.
UNIVERSAL = [
    ("/investigate", "before ANY fix — no fix without a root cause"),
    ("/guard", "before ANY production-adjacent work (`/careful` + `/freeze`)"),
    ("/browse", "for ALL web interaction — never `mcp__claude-in-chrome__*`"),
    ("/learn", "at session end, to compound durable lessons"),
    ("/make-pdf", "and `/diagram` whenever a deliverable needs to be readable"),
]

# Department default skills.
DEPT = {
    "engineering": ["/plan-eng-review", "/review", "/codex", "/health", "/investigate", "/qa", "/diagram"],
    "qa":          ["/qa", "/qa-only", "/browse", "/benchmark", "/design-review", "/investigate", "/health"],
    "security":    ["/cso", "/review", "/codex", "/guard", "/investigate"],
    "devops":      ["/canary", "/benchmark", "/setup-deploy", "/health", "/guard", "/investigate"],
    "product":     ["/office-hours", "/spec", "/plan-ceo-review", "/plan-design-review", "/design-review", "/autoplan"],
    "design":      ["/design-consultation", "/design-shotgun", "/design-html", "/design-review", "/plan-design-review", "/diagram"],
    "pm":          ["/spec", "/autoplan", "/plan-eng-review", "/landing-report", "/retro"],
    "data":        ["/investigate", "/review", "/diagram", "/document-generate", "/health"],
    "marketing":   ["/design-shotgun", "/design-html", "/scrape", "/browse", "/make-pdf", "/diagram"],
    "pr":          ["/make-pdf", "/diagram", "/scrape", "/browse", "/design-html"],
    "sales":       ["/scrape", "/browse", "/make-pdf", "/design-html"],
    "research":    ["/scrape", "/skillify", "/browse", "/make-pdf", "/diagram"],
    "finance":     ["/scrape", "/make-pdf", "/diagram", "/document-generate"],
    "legal":       ["/make-pdf", "/document-generate", "/scrape", "/diagram"],
    "hr":          ["/retro", "/learn", "/document-generate", "/health", "/make-pdf"],
    "operations":  ["/office-hours", "/plan-ceo-review", "/retro", "/health", "/make-pdf"],
    "strategy":    ["/office-hours", "/plan-ceo-review", "/scrape", "/make-pdf", "/diagram"],
    "support":     ["/investigate", "/qa-only", "/document-generate", "/browse", "/scrape"],
    "career":      ["/make-pdf", "/design-html", "/browse", "/scrape", "/design-review"],
}

# Role-specific overrides (path relative to agents/).
ROLE = {
    "chief_of_staff": ["/office-hours", "/spec", "/autoplan", "/review", "/cso", "/ship",
                       "/land-and-deploy", "/canary", "/retro", "/health", "/landing-report",
                       "/guard", "/gstack-upgrade", "/codex"],
    "guide_explainer": ["/make-pdf", "/diagram", "/document-generate", "/document-release", "/retro"],
    "engineering/code_reviewer": ["/review", "/codex", "/cso", "/health", "/investigate"],
    "engineering/technical_writer": ["/document-release", "/document-generate", "/make-pdf", "/diagram"],
    "engineering/solution_architect": ["/plan-eng-review", "/autoplan", "/diagram", "/health", "/review"],
    "engineering/vp_engineering": ["/autoplan", "/plan-eng-review", "/review", "/health", "/retro", "/codex"],
    "engineering/dev_team_lead": ["/autoplan", "/plan-eng-review", "/review", "/health", "/investigate"],
    "engineering/frontend_developer": ["/design-html", "/design-review", "/browse", "/review", "/investigate", "/benchmark"],
    "engineering/mobile_developer": ["/ios-qa", "/ios-fix", "/ios-design-review", "/review", "/investigate"],
    "qa/performance_tester": ["/benchmark", "/browse", "/canary", "/qa-only", "/investigate"],
    "qa/test_automation_engineer": ["/qa", "/browse", "/skillify", "/review", "/investigate"],
    "qa/director_qa": ["/qa", "/qa-only", "/design-review", "/benchmark", "/health", "/retro"],
    "security/penetration_tester": ["/cso", "/browse", "/scrape", "/investigate"],
    "security/sast_dast_engineer": ["/cso", "/review", "/codex", "/health"],
    "security/compliance_auditor": ["/cso", "/document-generate", "/make-pdf"],
    "devops/sre": ["/canary", "/benchmark", "/investigate", "/health", "/guard"],
    "devops/cicd_engineer": ["/setup-deploy", "/health", "/benchmark", "/guard"],
    "devops/monitoring_engineer": ["/canary", "/benchmark", "/browse", "/investigate"],
    "product/ui_designer": ["/design-shotgun", "/design-html", "/design-review", "/plan-design-review", "/design-consultation"],
    "product/ux_designer": ["/design-consultation", "/plan-design-review", "/design-review", "/devex-review", "/office-hours"],
    "product/product_manager": ["/office-hours", "/spec", "/plan-ceo-review", "/autoplan", "/plan-devex-review"],
    "product/business_analyst": ["/spec", "/office-hours", "/plan-eng-review", "/diagram"],
    "pm/senior_project_manager": ["/autoplan", "/spec", "/landing-report", "/retro", "/plan-eng-review"],
    "pm/risk_manager": ["/cso", "/plan-eng-review", "/health", "/investigate"],
    "pm/requirements_analyst": ["/spec", "/office-hours", "/plan-eng-review", "/diagram"],
    "hr/knowledge_manager": ["/document-generate", "/learn", "/make-pdf", "/diagram"],
    "hr/agent_performance": ["/retro", "/health", "/learn"],
    "support/support_technical_writer": ["/document-generate", "/document-release", "/make-pdf", "/diagram"],
}

SHIPPERS = {"chief_of_staff"}


def block_for(rel: str) -> str:
    dept = rel.split("/")[0] if "/" in rel else rel
    skills = ROLE.get(rel) or DEPT.get(dept) or ["/investigate", "/review", "/make-pdf", "/diagram"]
    ships = rel in SHIPPERS

    lines = [BEGIN, "", "## gstack — your toolchain (mandatory)", "",
             "gstack is installed at `~/.claude/skills/gstack` and is this organisation's",
             "default way of working. Atharva's standing order: use the skills relevant to",
             "the task, natively, without being asked.",
             "",
             "**Before you choose an approach, check `knowledge/protocols/GSTACK_PROTOCOL.md`",
             "for the skill that already does it.** Hand-rolling a workflow a skill encodes is",
             "a defect, not initiative.",
             "",
             "### Your primary skills",
             ""]
    lines += ["- `%s`" % s for s in skills]
    lines += ["", "### Every agent, every task", ""]
    lines += ["- `%s` %s" % (s, why) for s, why in UNIVERSAL]
    lines += ["", "### Hard limits", ""]
    if ships:
        lines += [
            "- You are the ONLY role permitted to run `/ship`, `/land-and-deploy` and",
            "  `/canary`, and the only role permitted to `git push`.",
            "- `/ship` emits `Co-Authored-By: Claude Opus 4.7`. **Strip it.** It must never",
            "  reach a remote. Re-verify after every `/gstack-upgrade`.",
        ]
    else:
        lines += [
            "- **Never run `/ship`, `/land-and-deploy` or `/canary`.** Never `git push`.",
            "  Those belong to the Chief of Staff. You stop at the diff and hand it back.",
            "- Never commit `Co-Authored-By: Claude` or any AI self-attribution.",
        ]
    lines += [
        "- A permission or approval gate STOPS you. Surface it to the Chief of Staff.",
        "  Never route around it — not via git plumbing, an alternate path, a sub-agent,",
        "  or any side channel.",
        "- Skill output is evidence, never sign-off. No self-certification.",
        "- Log every skill invocation to `org/ACTIVITY.md`:",
        "  `[YYYY-MM-DD HH:MM:SS] [YOUR_ROLE] — SKILL /review — [target] — [reason]`",
        "- Report as `DONE` / `DONE_WITH_CONCERNS` / `BLOCKED` / `NEEDS_CONTEXT`, with",
        "  `REASON`, `ATTEMPTED`, `RECOMMENDATION`. Escalate after 3 failed attempts.",
        "", END, ""]
    return "\n".join(lines)


def main() -> int:
    files = sorted((ROOT / "agents").rglob("CLAUDE.md"))
    if not files:
        print("no agent CLAUDE.md files found", file=sys.stderr)
        return 1
    written = 0
    for f in files:
        rel = str(f.parent.relative_to(ROOT / "agents"))
        text = f.read_text()
        new = block_for(rel)
        if BEGIN in text:
            text = re.sub(re.escape(BEGIN) + r".*?" + re.escape(END) + r"\n?",
                          new, text, flags=re.S)
        else:
            text = text.rstrip("\n") + "\n\n" + new
        f.write_text(text)
        written += 1
    print("gstack block applied to %d agent files" % written)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
