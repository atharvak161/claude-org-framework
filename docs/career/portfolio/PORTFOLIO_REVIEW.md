# Portfolio Website Review — Atharva Kulkarni

**Reviewer:** Portfolio Specialist (Career Advisory)
**Date:** 2026-06-01
**Subject site:** https://atharvak161.github.io (`index.html`)
**Companion:** GitHub profile README (`atharvak161-profile`)

---

## 1. What the current site says

**Title / SEO:** "Atharva Kulkarni — Junior Penetration Tester"
**Headline (hero H1):** ATHARVA KULKARNI
**Rotating role line:** Junior Penetration Tester → Ethical Hacker → Red Team Aspirant → Security Researcher → CTF Competitor
**Tagline:** "Turning deep infrastructure knowledge into offensive security expertise — finding the gaps before adversaries do."
**Open-to-work banner:** "Available for hire · London, UK"
**Hero stats:** CEH Certified · MSc Cyber Security · 4+ Years Experience · 85% CSAT Uplift

**What it showcases (section by section):**
1. Hero (name, rotating role, tagline, CTAs, LinkedIn + TryHackMe badges)
2. About Me (3 paragraphs + 3 highlight cards)
3. Skills (4 categories with animated proficiency bars — Cyber Security, Networking, Tools & Platforms, Programming & Data)
4. Experience (Eurostop, Diageo, Concentrix, Clariant — with achievements and tech badges)
5. Projects (4: ML Attacks on PUFs, Honey Encryption, NTFS Forensics, CTF/Pentest Labs)
6. Education & Certifications (MSc QUB, BSc Pillai; CEH, Fortinet NSE 1 & 2, THM Jr Path)
7. Currently Learning (Offensive Pentesting path, HTB, OSCP prep + a CEH→eJPT→OSCP→CRTO roadmap)
8. Testimonials (2 LinkedIn recommendations from Clariant managers)
9. Resume (embedded PDF viewer + download)
10. Contact (email, LinkedIn, phone, contact form)

The site is genuinely well-built: dark "hacker terminal" theme, glitch animations, scanlines, a loading boot sequence, a hidden Ctrl+Alt+T terminal easter egg, light/dark toggle, structured data (JSON-LD Person schema), Open Graph/Twitter cards, GoatCounter analytics, and a print stylesheet. This is **above** the standard of most junior-candidate portfolios.

---

## 2. Is the positioning clear for a UK cybersecurity professional?

**Mostly yes, with one strategic flaw.** The positioning is unambiguous: junior offensive-security candidate in London targeting pentest/red-team work. The "infrastructure-to-offence" narrative is coherent and differentiated — it turns a non-pentest job history into a credible story.

**The flaw: the site leads with a job title Atharva does not yet hold.** "Junior Penetration Tester" is aspirational — his actual roles are Technical Support Analyst / DSS Engineer / Network Ops. A sharp UK hiring manager will notice the mismatch between the banner title and the experience section within 10 seconds. This is not fatal, but it reads slightly as "wants to be" rather than "is." The fix is not to hide the ambition — it is to frame it honestly as a **transition** so the claim is bulletproof (e.g. "Security Analyst transitioning to offensive security" or "Aspiring Penetration Tester | MSc Cyber Security").

**Secondary positioning gaps:**
- **No proof of offensive output.** The site claims pentest skill but shows no writeups, no CTF blog, no GitHub tooling, no redacted report sample. For an offensive role, *demonstrated* work beats *claimed* skill every time. This is the single biggest content gap.
- **Self-assessed skill bars (75%, 80%, etc.)** are a liability in security. Assigning yourself "Penetration Testing 75%" invites a technical interviewer to test exactly that number. Recommend replacing percentages with evidence (rooms completed, CVEs read, tools used) or removing the numerals.
- **"4+ Years Experience"** slightly oversells — the roles are IT support/network ops, not 4 years of security. Keep the number but label it precisely ("4+ Yrs IT & Security Ops") to stay defensible.

---

## 3. Sections present vs. missing

| Present | Quality |
|---|---|
| Hero | Strong |
| About | Strong |
| Skills | Good, but self-rated bars are a risk |
| Experience | Strong |
| Projects | Good, but all academic/lab — none operational |
| Education & Certs | Strong |
| Currently Learning + Roadmap | Excellent — shows trajectory |
| Testimonials | Good (real, verifiable) |
| Resume viewer | Good |
| Contact | Good |

**Missing / would add the most value:**
1. **A Writeups / Blog section** — CTF walkthroughs, HTB machine notes, a vuln-of-the-week. This is the #1 missing element for an offensive candidate.
2. **A "Selected Work" artefact** — one sanitised pentest-style report PDF (even from a HTB box or a deliberately vulnerable app like DVWA/Juice Shop) proving report-writing ability, which is what actually gets junior pentesters hired.
3. **GitHub link in the nav/hero** — the GitHub profile README is excellent and currently under-surfaced on the site. Link it prominently.
4. **THM/HTB live rank or badge with numbers** — there is a THM badge image but no concrete "X rooms / top Y%" figure.
5. **Right-to-work / availability clarity** — UK employers screen for visa status fast. A single discreet line ("Eligible to work in the UK" if true) removes friction. (Confirm before adding.)

---

## 4. How well does it communicate skills, experience, value?

- **Skills:** communicated broadly but with the self-rating risk above. Coverage is comprehensive (offensive, networking, tooling, scripting).
- **Experience:** well-communicated and quantified (35%, 80%, 30%, 25%, 250+ devices). The achievements are framed through a security lens, which is the right move.
- **Value:** the "I know how systems are built, so I know how they break" thesis is the strongest asset and is consistently reinforced. Good.
- **Weakness:** value is *asserted* more than *evidenced* on the offensive side. Every claim about networking/AD/support is backed by a real job; every claim about pentesting is backed by "labs" and "in progress." Closing that evidence gap is the highest-leverage improvement to the whole site.

---

## 5. Highest-impact content improvements (ranked)

1. **Reframe the headline from a held title to an honest transition** (removes the credibility mismatch). See options below.
2. **Add a Writeups/Blog section with 2–3 real CTF/HTB walkthroughs** — converts "claimed" into "proven."
3. **Publish one sanitised pentest report artefact** linked from Projects.
4. **Replace self-rated % skill bars with evidence-based labels** (or keep bars but drop the numbers).
5. **Surface GitHub prominently** and keep the README in sync with the site (currently the README still says "Jr Pentest Path" in progress/complete inconsistently vs. the site — align them).
6. **Tighten hero stats** to defensible phrasing.
7. **Add right-to-work line** (if applicable).
8. **Fix the THM TryHackMe contact link** (`href="https://tryhackme.com"` in the README points to the homepage, not the profile — minor, but fix).

---

## 6. Design assessment (inferred from HTML/CSS)

**Strengths:** The dark terminal aesthetic is on-brand for offensive security and executed to a high standard — consistent design tokens, responsive breakpoints at 900px/600px, accessibility touches (aria labels, role="log", reduced reliance on colour alone in nav), a print stylesheet that converts the page to a clean serif CV, and performance-conscious choices (preconnect, lazy iframe, async analytics).

**Risks / watch-outs:**
- **Animation density.** Scanlines, glitch effects on the name and every section title, pulsing glows, a 2.4s loader. Impressive once; potentially fatiguing or "try-hard" to a senior hiring manager who just wants the facts. Recommend honouring `prefers-reduced-motion` and considering toning the glitch frequency down. (There is currently no `prefers-reduced-motion` media query — add one.)
- **Loader gate.** A 2.4s boot animation before content is a small friction cost on a recruiter's time. The 5s safety fallback is good defensive coding, but consider making the loader skippable/instant on repeat visits.
- **Contrast in light mode.** `--text3: #94a3b8` on light backgrounds for small uppercase labels may fall below WCAG AA — worth a quick contrast check.
- **Overall verdict:** design is appropriate and a net asset. The aesthetic signals competence and attention to detail, which matters in security. Just keep substance ahead of spectacle.

---

# IMPROVED CONTENT (ready to paste)

## A. Professional headline — 4 options

**Option 1 — Honest transition (recommended, strongest credibility):**
> **Atharva Kulkarni** — Security Analyst transitioning to Offensive Security
> CEH V12 · MSc Applied Cyber Security (GCHQ-Accredited) · Targeting Penetration Testing & Red Team

**Option 2 — Capability-led:**
> **Atharva Kulkarni** — Aspiring Penetration Tester | Breaking what I spent 4 years building
> Enterprise infrastructure background · Offensive security focus · London, UK

**Option 3 — Outcome-led:**
> **Atharva Kulkarni** — Offensive Security | Finding the gaps before adversaries do
> CEH-certified · MSc Cyber Security · Hands-on across AD, networks & web app testing

**Option 4 — Keep the ambition, qualify it (lightest-touch change to current site):**
> **Atharva Kulkarni** — Junior Penetration Tester (in transition) | MSc Cyber Security · CEH
> From building enterprise systems to breaking them.

## B. About / Bio — 3 variants

**One-liner:**
> GCHQ-accredited MSc Cyber Security graduate and CEH-certified ethical hacker, moving from four years of enterprise infrastructure and security operations into hands-on penetration testing.

**Short paragraph:**
> I am a CEH-certified ethical hacker with a GCHQ-accredited MSc in Applied Cyber Security, transitioning into offensive security from a foundation in enterprise IT — Active Directory, endpoint hardening, network operations, and incident investigation. That background gives me an attacker's instinct for where real systems break: misconfigurations, weak identity boundaries, and overlooked integrations. I sharpen my offensive skills daily on TryHackMe and HackTheBox, and I am working toward the eJPT and OSCP. Long-term goal: red team operations.

**Full bio:**
> I am a GCHQ-accredited MSc Cyber Security graduate and Certified Ethical Hacker making a deliberate move into offensive security.
>
> My career began in enterprise IT and network operations — configuring and hardening 250+ devices, managing Active Directory and endpoint compliance, and running incident investigations across complex Windows environments. At Eurostop I now own data integrity and conduct security assessments across enterprise EPOS platforms, middleware, a cloud POS, and internal integrations, applying root-cause analysis and operational-security thinking at scale. The thread through all of it is the same instinct that drives good penetration testing: trace the data, find the anomaly, secure the boundary.
>
> Academically, my research is offensive in nature — my MSc dissertation weaponised Generative Adversarial Networks against hardware Physical Unclonable Functions, and I have published work on Honey Encryption and NTFS forensics. Outside work I am continuously hands-on: completing the TryHackMe pentest paths, working live HackTheBox machines, and building toward the eJPT and OSCP, with red team operations and the CRTO as the long-term target.
>
> I know how enterprise environments are built — which is exactly why I know where they break. I am based in London and open to junior penetration testing and security analyst roles across the UK.

## C. Recommended page structure (section by section)

The current structure is strong. Recommended evolution (changes in **bold**):

1. **Hero** — reframed headline (Option 1/4), defensible stats, add **GitHub** badge alongside LinkedIn/THM.
2. **About** — swap in the full bio above; keep the 3 highlight cards.
3. **Skills** — keep 4 categories; **replace % bars with evidence-based grouping** (Core / Working / Familiar) or keep bars without numerals.
4. **Experience** — keep as-is; it is the strongest section.
5. **NEW: Writeups / Lab Notes** — 2–3 CTF/HTB walkthroughs with screenshots and methodology. *This is the priority addition.*
6. **Projects** — keep the 4 academic projects; **add the sanitised pentest report artefact** here as a 5th card.
7. **Education & Certifications** — keep as-is.
8. **Currently Learning + Roadmap** — keep; it is excellent and signals trajectory.
9. **Testimonials** — keep.
10. **Resume** — keep the embedded viewer.
11. **Contact** — keep; **add right-to-work line** if applicable.

## D. What to feature and how to describe it

**Lead with the offensive academic work (already strong) — but sharpen the framing to emphasise transferable pentest skills:**

- **ML Attacks on PUFs (MSc dissertation):** *Keep.* This is the crown jewel — it is genuinely offensive research. Reframe the outcome line to lead with the attacker result: "Built ML models that predicted hardware-PUF responses from GAN-synthesised data, defeating a hardware authentication primitive and quantifying attack success rates."
- **Honey Encryption:** *Keep.* Frames defensive cryptography thinking; good balance to the offensive work.
- **NTFS Forensics:** *Keep.* Signals incident-response/DFIR adjacency, which broadens hireable roles.
- **CTF & Pentest Labs:** *Upgrade from a generic card to linked, dated writeups.* Replace "Practising manual exploit identification" with specific named machines/rooms and a link to each walkthrough. Add concrete numbers (rooms completed, current THM/HTB rank).

**Add (priority):**
- **One end-to-end pentest report** against a legal target (HTB box, DVWA, OWASP Juice Shop, or a personal lab). Include: scope, methodology, findings with CVSS, screenshots, remediation. This single artefact is what most directly converts "studying pentesting" into "can do the job from day one" in a UK junior-pentester hiring decision.
- **A small offensive tool or script on GitHub** (e.g. an enumeration helper in Python) — pins the "I can code my own tooling" claim that the skills section makes.

---

## Summary judgement

The portfolio is well above average in **craft** and **narrative** but has a **credibility-evidence gap on the offensive side** and a **headline that claims a title not yet held**. The two highest-ROI moves are: (1) reframe the headline as an honest transition, and (2) add real, dated offensive output (writeups + one pentest report). Do those two things and this becomes a genuinely strong junior-pentester portfolio for the UK market.
