# Access & Credentials Reference
# Owner: Chief of Staff
# Accessible to: Chief of Staff, Dev Team Lead, all Engineering agents
# Last updated: 2026-06-01
# IMPORTANT: This file contains locations only — never the actual credential values

---

## GitHub

**Account:** atharvak161 (Atharva Kulkarni)
**Protocol:** HTTPS
**Repos:** All repos under github.com/atharvak161

### Where the credential is stored

| Store | Location | How to retrieve |
|-------|----------|-----------------|
| macOS Keychain | host=github.com, account=atharvak161 | `security find-internet-password -s github.com -a atharvak161 -w` |
| gh CLI keyring | System keyring | `gh auth token` |

### How to verify access in any session

```bash
gh auth status
```

Expected output: `✓ Logged in to github.com account atharvak161`

If not logged in, restore from Keychain:
```bash
security find-internet-password -s github.com -a atharvak161 -w | gh auth login --with-token
```

### Token type & scopes

Type: GitHub Classic PAT
Scopes: repo (full), workflow, admin:org, gist, user, delete_repo, packages, codespace, audit_log, notifications, project

### Repositories with push access

| Repo | URL | Branch |
|------|-----|--------|
| finance-dashboard | https://github.com/atharvak161/finance-dashboard.git | main |

---

## Rules for all agents using GitHub access

1. **Never print or log the token value** — always reference the Keychain location only
2. **Never commit secrets** — no tokens, passwords, or API keys in any file ever
3. **Always confirm with Chief of Staff before force-pushing** to main
4. **Always confirm with Chief of Staff before creating or deleting repos**
5. **All pushes must have a commit message** approved by the requesting agent
6. **dev team lead must review all commits** before push to production branches
