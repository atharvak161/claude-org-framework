# CTF Writeup Changes Applied

Date: 2026-06-02
Applied by: Frontend Developer
Status: HOLDING FOR PUSH (no git commands run — build only)

Portfolio root: `/Users/atharva/Downloads/organisation/src/projects/atharvak161-github-io/`

Files modified:
- `index.html`
- `writeups/flagvault2.html`
- `writeups/flagvault.html`
- `writeups/capture.html`
- `writeups/simplectf.html`
- `writeups/picklerick.html`

---

## index.html

### Change 1 — Section rename + intro
- Heading changed from "CTF Writeups" to **"Offensive Security Writeups"** (emoji retained).
- Added intro paragraph below heading:
  `Documented security research — vulnerability analysis, exploitation methodology, and remediation.`
  (styled with `--text2`, matching site subtitle style).

### Change 2 — Card reorder
New card order in the grid:
1. Flag Vault 2
2. Flag Vault
3. Capture!
4. Simple CTF
5. Pickle Rick
`reveal-delay` classes reassigned so the stagger animation follows the new order.

### Change 3 — Difficulty labels removed
Removed all "Easy" / "Beginner" difficulty pill `<span>` elements (and the now-empty flex wrappers were collapsed to just hold the icon). No replacement added.

### Change 4 — Active-voice descriptions
Card one-liners replaced with the exact provided strings for all five writeups.

### Change 5 — CWE/OWASP tag per card
Added a monospace `--text3` tag div between description and the "Read Writeup →" link on each card:
- Flag Vault 2: `CWE-134 · CWE-787 · A03:2021`
- Flag Vault: `CWE-121 · CWE-676 · A04:2021`
- Capture!: `CWE-307 · CWE-200 · A07:2021`
- Simple CTF: `CVE-2019-9053 · CWE-89 · A01:2021`
- Pickle Rick: `CWE-540 · CWE-284 · A01:2021`

### Change 6 — Green left border
Added `border-left:3px solid var(--accent2);` to the inline style of all five writeup cards (project cards elsewhere keep the neutral border).

---

## Each writeup page (Changes 7–9)

### Change 7 — Severity badge row in `.wr-summary`
Added a `Severity` row with an inline pill badge:
- Flag Vault 2: **HIGH** (red)
- Flag Vault: **HIGH** (red)
- Capture!: **MEDIUM** (amber)
- Simple CTF: **CRITICAL** (red, bold, with "(CVSSv3 9.8)" note)
- Pickle Rick: **LOW** (green)

### Change 8 — References row in `.wr-summary`
Added a `References` row with CWE/OWASP string matching Change 4:
- Flag Vault 2: `CWE-134 · CWE-787 · OWASP A03:2021`
- Flag Vault: `CWE-121 · CWE-676 · OWASP A04:2021`
- Capture!: `CWE-307 · CWE-200 · OWASP A07:2021`
- Simple CTF: `CVE-2019-9053 · CWE-89 · OWASP A01:2021`
- Pickle Rick: `CWE-540 · CWE-284 · OWASP A01:2021`

### Change 9 — Key Takeaways section
Replaced the existing `.wr-lesson` "Key Lesson" box at the end of each page (before the footer) with a two-column **Key Takeaways** section (`Attacker Perspective` + `Defender / Remediation`) using the provided structure and the specific attacker/defender takeaways for each writeup. The unused `.wr-lesson` CSS rules remain in the `<style>` blocks (harmless, no markup references them).

---

## Verification
- 0 remaining `<div class="wr-lesson">` markup instances.
- 5/5 Severity rows, 5/5 References rows, 5/5 Key Takeaways sections present.
- index.html card order confirmed: flagvault2 → flagvault → capture → simplectf → picklerick.
- 0 "Easy"/"Beginner" pills remaining in index.html.
- All five writeup cards carry the green left border.

No git operations were performed. Changes are on disk only, holding for push.
