# CTF Writeup Design Consultation
**Prepared by:** Creative Director  
**Date:** 2026-06-02  
**Subject:** Visual design recommendations for the CTF writeup section and writeup pages at atharvak161.github.io

---

## Context

The portfolio runs a coherent design system: `#080b10` background, `#00d4ff` cyan and `#00ff9d` green accents, Share Tech Mono and Barlow Condensed typefaces, scanline overlay, glitch animations on section headings, and a consistent card language (`--surface` background, `--border` border, left-accent hover state). Five CTF writeup pages are being published at `/writeups/`.

The core question is not aesthetic — it is positional. Writeups must read as documented professional work product, not as a gaming scoreboard.

---

## 1. CTF Section on the Main Portfolio — Treatment

**Recommendation: Give writeups a distinct sub-section treatment within Projects, not a peer section of their own.**

The current implementation (a horizontal rule headed "CTF Writeups" inside the Projects section, followed by the same `.projects-grid` card layout) is directionally correct but undersells the output. The problem is the current cards sit visually identical to the academic projects above them. A hiring manager scanning quickly cannot tell whether "CTF & Penetration Testing Labs" is a writeup or a project.

### What to change

**Separate the signal from the noise.** Treat the writeup block as a secondary panel inside Projects — not a new section, not the same rank as the MSc dissertation. The heading should use `--text2` colour rather than `--text`, keeping it one visual level below the section title. Add a muted descriptor line beneath the heading:

```
CTF Writeups  ·  Documented attack chains and technique breakdowns
```

**Differentiate the card skin.** The writeup cards should share the same `--surface`/`--border` base but carry a left-border accent in `--accent2` (green) by default — shifting to `--accent` (cyan) on hover — the inverse of the project card behaviour. This creates a subtle but readable distinction: blue-accented cards are projects (built things), green-accented cards are writeups (found things).

**Do not use a separate section in the navbar.** A "Writeups" nav link implies volume and ongoing publication cadence. Five entries do not justify that weight. Link from Projects, surface the writeup index page from the section CTA.

**Add a "View All Writeups" link** at the bottom of the writeup card grid, styled as `.btn-secondary`, pointing to a dedicated `/writeups/index.html`. This does two things: it signals there is a collection worth indexing, and it removes pressure to surface every writeup on the main page.

---

## 2. The Writeup Pages Themselves — Credibility vs Student Blog

The single most important distinction between a professional security writeup and a blog post is **methodology structure**. A blog post narrates what happened. A professional writeup documents what was done, why each action was taken, and what the finding means in a real-world context.

### What signals credibility

**A fixed document header, not a hero banner.** Every writeup page should open with a structured metadata block, monospaced, styled to resemble a pentest report header:

```
Target          Capture!
Platform        TryHackMe
Category        Web · Authentication Bypass
Difficulty      Easy
Date Completed  2026-05-XX
Tools Used      Python, Burp Suite, Hydra
```

This is the first thing a hiring manager or senior pentester reads. It tells them immediately what domain knowledge is being demonstrated before they read a single word of prose.

**A Methodology section, not just a walkthrough.** The structure should be:

1. Summary (2–3 sentences: what the target was, what the vulnerability was, what was achieved)
2. Reconnaissance
3. Vulnerability Identification (with the "why this works" reasoning, not just "I ran X and got Y")
4. Exploitation
5. Post-Exploitation / Flags
6. Key Takeaways (what a defender should do, what tool/technique this demonstrates)

The Key Takeaways section is the single biggest credibility marker. It shows the writer understands both sides of the engagement. Omitting it is the clearest marker of a student write-up.

**Code blocks must be complete and copyable.** If a Python script is referenced, show the full script with comments, not a trimmed excerpt. Truncated code reads as someone who does not want to show their working.

**Tool invocations must include flags and rationale.** Not just `nmap -sV target`, but `nmap -sV -sC -p- target` with a brief note on why `-p-` rather than the default port range.

### What signals student blog

- Narrative-first prose ("First I tried X, then I tried Y, then it worked")
- Screenshots of terminal output with no surrounding context
- Missing CVE references when a known CVE was exploited
- No mention of what a real attacker would do next after achieving the objective
- Difficulty badges styled like achievement icons rather than classification metadata
- Emoji in section headings inside the writeup body

---

## 3. Card Design — Information Hierarchy

The current writeup cards carry: icon · difficulty badge (top row) → platform · title → description → tech badges → CTA link.

This hierarchy has one problem: **Platform and Difficulty carry equal or less visual weight than the tech badges**, but they are the two fastest pieces of information a technical reader uses to triage whether a writeup is relevant to them.

### Recommended hierarchy (top to bottom)

**Row 1 — Classification metadata (right-aligned, small, monospaced)**  
Platform + Difficulty badge side by side, both top-right. Use distinct colour coding by difficulty: Easy = `--accent2` (green), Medium = `#f5a623` (gold), Hard = `--accent3` (red/pink). Difficulty colouring should be on the badge border and text, not background fill, to keep it from competing with the card hover state.

**Row 2 — Category tag (below the icon)**  
A single small tag: `Web`, `PWN`, `SQLi`, `Forensics`, etc. This is the fastest filter for someone scanning the section. It should sit directly beneath the icon, styled like the existing `.tech-badge` but in `--accent` with slightly higher opacity.

**Row 3 — Title**  
Large, Barlow Condensed, `--text`. No change from current.

**Row 4 — One-sentence attack summary**  
This is the description field. It should be one sentence that describes the attack vector and outcome — not what the room is about. "Bypassed a math-CAPTCHA login form using a custom Python brute-forcer exploiting username enumeration" is correct. "A beginner-friendly TryHackMe room" is not.

**Row 5 — Tools used (tech badges)**  
Keep as-is. Three badges maximum on the card. If more tools were used, they belong on the writeup page.

**Row 6 — CTA**  
"Read Writeup →" is good. Keep it in `--accent`, keep it small, keep it bottom-aligned within the card. Consider adding a secondary piece of metadata here: estimated read time (e.g. "5 min read") in `--text3`. This sets professional expectations.

---

## 4. One Specific Recommendation — The Differentiator

**Add a "Technique" or "Vulnerability Class" field to every writeup card and to the writeup page header, linked to an external reference.**

Example on the card:

```
Vuln Class    Authentication Bypass · CWE-307
```

Example on the writeup page header metadata block:

```
Vulnerability Class    Authentication Bypass
CWE Reference          CWE-307 (Improper Restriction of Excessive Auth Attempts)
OWASP Mapping          A07:2021 – Identification and Authentication Failures
```

This single addition does more to separate the work from a TryHackMe profile than any visual treatment could. It demonstrates that the writer does not just know how to exploit something in a lab — they know where it maps in the industry classification system. That is the vocabulary of a practitioner. CWE and OWASP references appear in every professional pentest report. Showing them on a portfolio writeup card signals that the output format is report-ready.

The link on the card should go to the relevant CWE entry at cwe.mitre.org — a hard external link, not styled as a button, just the reference in `--text3` with `--accent` underline on hover. It costs one line per card. It signals an entirely different professional level.

---

## Implementation Notes

- The existing `.project-card` CSS is reusable for writeup cards with one addition: a `--accent2` left-border default state (currently cards default to `--border` and shift to `--accent` on hover).
- Difficulty colouring by badge: consider a CSS class per difficulty level (`diff-easy`, `diff-medium`, `diff-hard`) rather than inline styles. This will make bulk updates easier as more writeups are added.
- The writeup index page (`/writeups/index.html`) should carry the same section header pattern (`section-num //` + glitch title + section-line) to feel like a continuation of the portfolio, not a separate site.
- On writeup body pages: the metadata block at the top is best implemented as a `<table>` element with `border-collapse: collapse` and monospaced font, styled to look like a report header rather than a web table. Avoid div-soup for this — semantic table markup is appropriate here and is more accessible.

---

## Summary

The CTF section is structurally sound. The gap between current state and professional credibility is not in the visual language — the site's aesthetic is already strong — it is in the information architecture of the cards and the structure of the writeup pages themselves. The three changes that will move the needle most:

1. CWE/OWASP references on every card and writeup header
2. A mandatory Key Takeaways section on every writeup page
3. Difficulty colour-coded by class (not just green for all)

Everything else is polish. These three are signal.
