# Organisation

A fully structured multi-agent engineering organisation built for Claude Code.
35 agents across 8 departments. Every agent has a defined identity,
responsibilities, outputs, and escalation path.

## How to use this

Open Claude Code in any agent's directory and it becomes that agent.
Or open Claude Code at the root and address the Chief of Staff directly.

To start a project:

Tell the Chief of Staff what you want to build in plain English.

Example: "Build me a REST API for user authentication with JWT tokens"

The Chief of Staff will:
- Produce a Master Execution Plan
- Spawn the Project Manager and Guide
- Coordinate all departments
- Deliver a working product to review/

You review review/DELIVERY_SUMMARY.md (plain English)
You write APPROVED in review/APPROVAL.md
You push to GitHub

## Directory structure

| Directory | Purpose | Who writes here |
|-----------|---------|-----------------|
| agents/ | All agent CLAUDE.md identity files | HR Manager creates |
| src/ | All application source code | Engineering team |
| tests/ | All test code and results | QA + Engineering |
| docs/ | All documentation | All teams |
| infra/ | All infrastructure as code | DevOps team |
| ci/ | CI/CD pipeline configuration | CI/CD Engineer |
| org/ | Agent logs and status (not in git) | All agents |
| review/ | Your staging area (not in git) | Delivery Manager |
| knowledge/ | Organisation knowledge base | Knowledge Manager |

## The 35 agents

### Executive
- Chief of Staff — coordinates everything, owns final quality gate
- Guide and Explainer — translates all work into plain English for you

### HR (4 agents)
- HR Manager, Agent Performance Manager, Org Designer, Knowledge Manager

### Project Management (4 agents)
- Senior Project Manager, Risk Manager, Requirements Analyst, Delivery Manager

### Product (4 agents)
- Product Manager, UX Designer, UI Designer, Business Analyst

### Engineering (9 agents)
- Solution Architect, Dev Team Lead, Backend Developer, Frontend Developer
- DB Engineer, Mobile Developer, Integration Engineer, Code Reviewer
- Technical Writer

### Security (4 agents)
- Security Architect, Penetration Tester, SAST/DAST Engineer, Compliance Auditor

### QA (3 agents)
- Full Stack Tester, Performance Tester, Test Automation Engineer

### DevOps (5 agents)
- Infrastructure Engineer, CI/CD Engineer, Monitoring Engineer
- Container Engineer, SRE

## Pushing to GitHub

Agents do not push to GitHub. You do.

When review/APPROVAL.md says APPROVED:

```
git add .
git commit -m "describe what was built"
git push origin main
```

The CI/CD pipeline runs automatically on push.

## Contact

Owner: Atharva
