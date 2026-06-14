# Career Strategy — Atharva Kulkarni

**Author:** Career Coach (Career Advisory)
**Date:** 2026-06-01
**Subject:** 12-month UK cybersecurity career plan
**Inputs:** Portfolio website, GitHub profile, 2-page resume

---

## 1. Current career level

**Assessment: Early-career / entry-level, in transition — NOT yet a working penetration tester.**

The evidence:
- **Credentials are mid-tier-ready:** GCHQ-accredited MSc Applied Cyber Security + CEH V12 + Fortinet NSE 1/2. This is a genuinely strong academic and certification base — stronger than many people already working as junior pentesters.
- **Experience is entry-level *for security specifically*:** ~4 years, but in IT support, network operations, and endpoint/identity administration — not in a security-titled role. The Eurostop role includes self-initiated security assessments, which is the closest thing to relevant experience, but it is adjacent, not core.
- **Offensive proof is at "studying" stage:** TryHackMe paths, HackTheBox, CTFs, academic offensive research. Real and valuable, but lab-based rather than client-delivered.

**Net:** Atharva sits at the **junior/entry tier** for offensive security roles, but with an **above-average foundation** (the MSc + CEH + infrastructure depth) that lets him credibly compete for junior pentest and security analyst roles now, and that will accelerate him past peers once he adds the eJPT/OSCP and demonstrable output. He is *infrastructure-experienced* but *security-junior*.

---

## 2. Most logical next role title

**Primary target: Security Analyst / SOC Analyst (Tier 1) OR Junior Penetration Tester / Junior Security Consultant.**

**Why this, and why a fork:**

The honest market reality in the UK is that **junior pentest roles are scarce and competitive** — most firms (Big 4, NCC Group, Bridewell, WithSecure, PwC, Nettitude, boutiques) hire a small number of graduate pentesters per year and the bar (OSCP-level, demonstrable writeups) is high. So two routes both make sense:

- **Route A — Direct (higher reward, harder):** Junior Penetration Tester / Junior Security Consultant. Pursue this aggressively because the MSc + CEH genuinely qualifies Atharva to apply. Needs eJPT now, OSCP within 12 months, and 2–3 public writeups + one report artefact to be competitive.
- **Route B — Bridge (faster, very high success rate):** **Security Analyst / SOC Analyst.** This role values exactly what Atharva already has — networks, AD, endpoint, incident investigation, MITRE ATT&CK — and is a proven 12–24 month springboard into pentesting. A SOC analyst who holds a CEH and is OSCP-studying is a *strong* internal candidate to move to the red/offensive team.

**Recommendation:** Apply to BOTH in parallel for the next 6 months. Take the first credible security-titled offer (most likely a SOC/Security Analyst role), because *any* security-titled role removes the "transitioning" hedge from every future application and resets the clock. Keep driving toward OSCP regardless, so the pentest move is teed up 12–18 months out.

Realistic secondary/adjacent targets that the profile also fits: **GRC Analyst, Vulnerability Management Analyst, IT Security Engineer, Threat Intelligence Analyst.** Vulnerability Management Analyst is a particularly good fit and an underrated bridge to offensive work.

---

## 3. Certifications by ROI (highest first)

| Cert | ROI | Why / Timing |
|---|---|---|
| **eJPT (INE/eLearnSecurity)** | **Highest right now** | Already in progress. Cheap, hands-on, proves practical pentest ability, and is the credibility step between CEH (theory-heavy, sometimes dismissed) and OSCP. **Finish this in the next 4–8 weeks.** |
| **CompTIA Security+** | **Very high (if not held)** | The de-facto UK baseline filter — many SOC/Security Analyst job adverts and MSP/defence roles list it as a hard requirement, and it's a requirement for some UK gov/SC-cleared roles. Fast win that unlocks Route B job applications. Get it if not already held. |
| **OSCP (OffSec)** | **Highest long-term** | The single cert that most changes hireability for pentest roles in the UK. Expensive (~£1.2k+) and demanding (~3–6 months prep). **Target completion within this 12-month plan.** This is the flagship goal. |
| **BTL1 / Blue Team Level 1** | Medium-high (if going Route B/SOC) | Cheap, practical, strongly respected for SOC roles. Worth it only if SOC becomes the chosen bridge. |
| **CRTO (Certified Red Team Operator)** | High but later | Excellent and directly on the red-team goal, but sequence it *after* OSCP. It's a 12–24 month horizon item, not now. |
| **AZ-500 / Azure Security** | Medium (free-ish win) | Given the heavy Intune/M365 background, an Azure security cert is low-effort/high-relevance and broadens cloud-security roles. Opportunistic. |

**Do NOT** spend money on more theory certs (e.g. another CEH-tier cert). Money goes to **eJPT → Security+ (if needed) → OSCP.**

---

## 4. Recommended 12-month plan

**Guiding principle:** Convert "studying offensive security" into "demonstrably does offensive security," while landing a security-titled role to remove the transition hedge.

### Months 1–3 — Finish the proof, start applying
- **Cert:** Complete **eJPT** (already in progress). If Security+ not held and targeting SOC, schedule it.
- **Output:** Publish **2–3 HackTheBox/TryHackMe writeups** on the portfolio + GitHub (methodology, screenshots, remediation). Produce **one full sanitised pentest report** (HTB box or DVWA/Juice Shop) — this is the highest-leverage artefact.
- **CV/Portfolio:** Apply the CV and Portfolio review changes (reframed headline as transition, grouped skills, tool keywords, portfolio link, quantified Eurostop bullet).
- **Apply:** Begin applying to Security Analyst / SOC Analyst / Vulnerability Management roles (Route B) AND junior pentest roles (Route A) — target 10–15 quality applications/week, not spray-and-pray.

### Months 4–6 — Land the bridge role, begin OSCP
- **Goal:** Secure a **security-titled role** (most likely SOC/Security Analyst or Vuln Management). Take the first credible offer.
- **Cert:** Start **OSCP** prep (PEN-200 labs). Treat it as the year's flagship.
- **Network:** Attend BSides / local DEF CON groups / OWASP chapter meetups in London; build relationships at the firms that hire junior pentesters. Get active on the security side of LinkedIn (post the writeups).

### Months 7–9 — Build OSCP momentum + perform in role
- **Cert:** Push OSCP labs hard (50+ machines, the exam methodology).
- **In-role:** Excel in the new security role; volunteer for anything offensive-adjacent (internal vuln scanning, purple-team exercises, threat hunting). Make the internal move to offensive a visible goal to the manager.
- **Output:** Keep the writeup cadence (≥1/month). Consider a small offensive tool on GitHub (Python enumeration helper) to back the "writes own tooling" claim.

### Months 10–12 — Pass OSCP, pivot to pentest applications
- **Cert:** **Sit and pass OSCP.** This is the year's defining milestone.
- **Move:** With OSCP + a year of security-titled experience + a body of writeups, **actively apply to Junior Penetration Tester / Security Consultant roles** (or trigger the internal move). The profile at this point is genuinely competitive for Route A.
- **Plan next:** Map CRTO and red-team specialisation for year 2.

**12-month success definition:** eJPT done · OSCP passed (or in final stages) · in a security-titled role · 6+ public writeups + 1 pentest report published · actively interviewing for junior pentest positions from a position of strength.

---

## 5. UK salary targets

*(London-weighted; ranges reflect the 2025–26 UK market. Adjust ~10–20% lower outside London/SE, higher for SC/DV-cleared or specialist contexts.)*

| Stage / Role | Realistic UK range (London) | Notes |
|---|---|---|
| **Current market value (entry security, transitioning)** | **£28k–£38k** | Where Atharva can land a first security-titled role now. Infrastructure background + MSc + CEH push toward the upper half. |
| **SOC / Security Analyst (Tier 1, with his profile)** | **£30k–£42k** | Most likely near-term landing zone (Route B). The GCHQ MSc + CEH justify the top of band. |
| **Junior Penetration Tester / Security Consultant** | **£32k–£45k** | Route A. Boutiques/MSSPs lower; Big 4 / top consultancies higher. OSCP is what unlocks the upper end and the offers themselves. |
| **Vulnerability Management Analyst** | **£35k–£45k** | Strong-fit bridge; often pays slightly above Tier-1 SOC. |
| **Post-OSCP Pentester (12–18 months out)** | **£40k–£55k** | With OSCP + a year of security experience + portfolio. |
| **Experienced Pentester (year 2–3)** | **£50k–£70k+** | Realistic trajectory; £70k+ with consulting/SC clearance/specialisation. |

**Negotiation guidance:**
- **Anchor on the MSc (GCHQ-accredited) + CEH + infrastructure depth** — this combination is worth more than the raw years of security experience suggest. Aim for the **upper third** of each band, not the midpoint.
- **Do not accept below ~£30k** for a London security-titled role given the credentials — it would undervalue the MSc.
- **SC / DV clearance eligibility** is a major salary and opportunity multiplier in the UK (defence, gov, GCHQ-adjacent, many consultancies). If eligible (right-to-work + residency history permitting), state it — it can add £5k–£10k and open a whole tier of roles.
- **First job priority is the title and the learning, not the salary.** A £32k SOC role that becomes an offensive-team move in 18 months beats a £40k dead-end. Optimise for trajectory now; salary compounds fast (often +30–50% on the OSCP-pentester step).

---

## Bottom line

Atharva is an **entry-level security candidate with a mid-tier foundation**. The winning strategy is a **two-track job search** (Security/SOC Analyst as the high-probability bridge, Junior Pentester as the stretch), **eJPT now → OSCP within 12 months** as the cert spine, and **public offensive output** (writeups + one pentest report) to convert credentials into proof. Land any security-titled role in the next 6 months to kill the "transitioning" hedge, pass OSCP by month 12, and the pentest pivot becomes a strong-position move rather than a long shot. Near-term salary target **£30k–£42k**; **£40k–£55k** within 12–18 months post-OSCP.
