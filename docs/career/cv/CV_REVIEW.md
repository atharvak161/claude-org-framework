# CV / Resume Review — Atharva Kulkarni

**Reviewer:** CV Specialist (Career Advisory)
**Date:** 2026-06-01
**Source:** `Atharva_Kulkarni_Resume.pdf` (2 pages)

---

## 1. UK CV standards compliance

| Standard | Status | Notes |
|---|---|---|
| 2 pages maximum | PASS | Exactly 2 pages. Good. |
| No photo | PASS | No photo present. Correct for UK. |
| Reverse chronological | PASS | Eurostop → Diageo → Concentrix → Clariant. Correct. |
| No DOB / marital status / nationality | PASS | None present. Correct. |
| Personal email + phone + location | PASS | London, mobile, Gmail, LinkedIn all present. |
| Spelling/grammar (UK English) | MOSTLY PASS | "organisation", "synchronisation" correct. Minor: `chat_bot` (underscore artefact), "in-store" split across a line break ("instore"), and "Eurostop" misrendered as "Eurostop"/"Eurostop" consistency — verify the literal spelling. |
| Consistent date format | PASS | MM/YYYY throughout experience; YYYY for education. Consistent within sections. |
| Reverse-chron within education | PASS | MSc before BSc. |

**Verdict:** The CV is structurally compliant with UK norms. This is already a solid, recruiter-safe baseline.

**Layout note:** Title line crams six elements ("London | phone | email | Junior Penetration Tester | linkedin"). Putting the *target role* in the contact line is unusual — better as a headline directly under the name. Also: a clickable LinkedIn and an email mailto improve usability if the PDF is opened digitally (confirm hyperlinks are live, not just text).

---

## 2. ATS optimisation for cybersecurity roles

**Strengths:**
- Standard section headings (Summary, Experience, Education, Skills, Certifications, Projects) — ATS-parseable.
- Single-column body text (the visual two-column **Skills** block is the one risk — see below).
- Good keyword density: Penetration Testing, Vulnerability Assessment, OWASP Top 10, Active Directory, MITRE ATT&CK, OSINT, Burp Suite, Python, Bash, Zero Trust, Intune, SIEM-adjacent terms.

**ATS weaknesses to fix:**
1. **Two-column Skills layout** — many ATS parsers read left-to-right across columns and scramble multi-column text. Safest fix: render skills as a single column or comma-separated lines, OR ensure the underlying PDF text order is linear (test by copy-pasting the PDF into Notepad — if it reads coherently, it's fine).
2. **Missing high-value keywords** UK cyber JDs commonly screen for and that Atharva can legitimately claim: *SIEM, Nessus/OpenVAS, Wireshark, Nmap, Metasploit, Kali Linux, PowerShell, vulnerability scanning, network security, incident response, GDPR, Cyber Essentials, ISO 27001 (awareness), penetration testing methodology.* Several appear on the website but NOT on the CV — align them.
3. **No skills "hard tools" line** — recruiters and ATS both look for an explicit tools list (Nmap, Burp Suite, Metasploit, Wireshark, Nessus, Kali). Currently tools are implied, not listed discretely.
4. **Acronyms without expansion on first use** in a couple of places (DSS, EPOS) — fine for human readers, but spell out once.
5. **No LinkedIn/portfolio as live hyperlinks confirmed** — ensure `atharvak161.github.io` (portfolio) is ON the CV. It strengthens an offensive application and is currently absent from the PDF.

**ATS score (subjective):** ~7/10. Strong keyword base; fix the column risk and add the missing tool/keyword set to reach ~9/10.

---

## 3. Professional summary — assessment

**Current summary** is competent but has three weaknesses:
- **Too long / dense** — one ~90-word block; recruiters skim. Should be 3–4 tight sentences.
- **Overclaims slightly** — "hands-on practical development in web application security assessment, OWASP Top 10 testing... across real-world systems" is strong language for what is, in practice, lab work plus security assessment of internal tools at Eurostop. Defensible but keep it precise to avoid an interview trap.
- **Leads with a hedge** — "actively transitioning into offensive security" is honest (good) but the strongest credential (GCHQ MSc + CEH) should hit first.

---

## 4. Are achievements quantified?

**Yes, well — on the IT/ops side.** Strong metrics: 35% faster query resolution, 80% fewer escalations, 30% faster outage response, 250+ machines configured, 25% fewer breaches, 20% efficiency, 15% awareness uplift.

**No — on the security/offensive side.** There are zero quantified offensive metrics: no count of CTF rooms/boxes, no vulnerabilities found, no count of systems assessed at Eurostop, no THM rank. The Eurostop "security assessments" bullet is the strongest security content but is unquantified ("identifying potential vulnerabilities"). **Quantify it:** how many systems assessed, how many issues found/reported.

**Caution:** A few metrics look suspiciously round and stacked (25% breaches + 20% incidents + 15% awareness at a 6-month internship). Be ready to defend each in interview; consider consolidating to the 1–2 most credible numbers per early role to avoid a "metric inflation" impression.

---

## 5. Skills section — comprehensiveness

**Current skills list (12 items):** Pentest & Vuln Assessment · Web App Security (OWASP Top 10) · Network/Host Enumeration · Manual Assessment & Exploit ID · Firewall/Network Security Config · Threat Intel (OSINT, MITRE ATT&CK) · Active Directory & Endpoint (Intune, Zero Trust) · Scripting (Python, Bash) · Vuln Reporting & Documentation · Red Team Concepts (THM, CTF) · SQL Diagnostics · Burp Suite & Web Tooling.

**Assessment:** Good coverage, well-pitched at junior-offensive level. **Gaps vs. typical UK cyber JDs:** named tools as a discrete line (Nmap, Metasploit, Wireshark, Nessus/OpenVAS, Kali, PowerShell), SIEM/log analysis, cloud security basics (Azure — given the Intune/M365 background, this is a free win), and compliance awareness (Cyber Essentials, ISO 27001, GDPR). Recommend a restructured skills block (below) that separates **Offensive**, **Tools**, **Infrastructure/Defensive**, and **Programming** for both ATS and human scanning.

---

## 6. Most important improvements (ranked)

1. **Rewrite the summary** — shorter, credential-first, precise (below).
2. **Add a discrete Tools line and the missing keywords** (Nmap, Metasploit, Wireshark, Nessus, Kali, PowerShell, Azure, SIEM).
3. **Add the portfolio URL** to the header.
4. **Quantify the Eurostop security-assessment bullet.**
5. **De-risk the two-column skills block** for ATS.
6. **Move target role out of the contact line into a proper headline.**
7. **Add a THM/HTB metric** (rooms/rank) — even one number makes the offensive claim concrete.

---

# REWRITTEN CONTENT (ready to paste)

## A. Professional summary (rewrite)

> **Certified Ethical Hacker (CEH V12) and GCHQ-accredited MSc Cyber Security graduate** transitioning into offensive security, backed by 4 years across enterprise IT, network operations, Active Directory, and endpoint security. Conducts security assessments of live enterprise systems — identifying and reporting vulnerabilities across cloud POS, integrations, and internal applications — and applies the same instinct daily on TryHackMe and HackTheBox. Strong foundation in web application testing (OWASP Top 10), network enumeration, and threat intelligence (OSINT, MITRE ATT&CK). Targeting junior penetration testing and security analyst roles, with a long-term goal of red team operations.

*(4 sentences, credential-first, precise, keyword-dense.)*

## B. Improved skills section (single-column, ATS-safe, grouped)

> **Offensive Security:** Penetration Testing · Vulnerability Assessment · Web Application Security (OWASP Top 10) · Network & Host Enumeration / Reconnaissance · Manual Exploitation & Exploit Identification · Privilege Escalation · Threat Intelligence (OSINT, MITRE ATT&CK) · Vulnerability Reporting & Technical Documentation
>
> **Tools:** Burp Suite · Nmap · Metasploit · Wireshark · Nessus / OpenVAS · Kali Linux · ServiceNow
>
> **Infrastructure & Defensive:** Active Directory · Endpoint Security (Intune, Autopilot, Zero Trust) · Firewall & Network Security Configuration · Microsoft 365 / Azure AD · Incident Investigation · Cyber Essentials & GDPR awareness
>
> **Programming & Scripting:** Python · Bash · PowerShell · SQL
>
> **Practice & Certs in progress:** TryHackMe (Jr Pentest + Offensive paths) · HackTheBox · eJPT (in progress) · OSCP (preparing)

## C. Suggested bullet rewrites by role

### Technical Support Analyst — Eurostop (09/2025–Present)
*Lead with the security content; quantify it.*
> - Conduct security assessments of live enterprise systems — cloud-based POS, stock-control platform, internal integrations, and a self-hosted LLM chatbot — identifying and documenting vulnerabilities and feeding findings into the organisation's security posture. *(Add: "...across N systems, reporting X issues.")*
> - Own end-to-end data integrity across EPOS tills, middleware, head-office platforms, and third-party integrations, securing access and ensuring reliable synchronisation across retail environments.
> - Perform cross-system root-cause analysis on data, pricing, and product-lifecycle failures within large datasets, resolving discrepancies and hardening process controls.
> - Support incident investigation and operational security controls, ensuring secure access and continuity across interconnected systems.

### DSS Engineer — Diageo (02/2025–09/2025)
> - Implemented and advised on security-focused endpoint management — Intune-Autopilot integration, tenant lock, and device-compliance enforcement — strengthening asset protection and reducing exposure.
> - Resolved Active Directory, authentication, and device-compliance issues, contributing to Zero Trust-aligned access controls and centralised asset tracking via Nexthink and ServiceNow.
> - Delivered frontline IT support across hardware, network, Windows OS, and application-level issues for enterprise and VIP users, with a focus on asset security and account management.

### Technical Support Engineer — Concentrix / BT (01/2024–01/2025)
> - Educated customers on phishing and social-engineering threats, measurably reducing breach incidents and raising cyber awareness across a broad user base.
> - Improved query resolution efficiency by 35% through structured diagnostic workflows.
> - Reduced escalated tickets by 80% across broadband, mobile, and home-tech products.

### Network Operations Specialist — Clariant India (01/2022–07/2022)
> - Hardened endpoint security configurations across the estate, contributing to a 25% reduction in security breaches.
> - Configured and secured 250+ machines and maintained network switches/routers, cutting outage response time 30% via ServiceNow-integrated processes.
> - Developed and delivered cybersecurity awareness training, raising employee security awareness by 15%.

*(Consolidated overlapping metrics into the most defensible ones; led each role with the most security-relevant bullet.)*

## D. Structural changes needed

1. **Header:** Move "Junior Penetration Tester" out of the contact pipe-line into a centered headline under the name: *"Aspiring Penetration Tester | CEH V12 | MSc Applied Cyber Security."* Add **portfolio URL** (atharvak161.github.io) and ensure LinkedIn/email are live hyperlinks.
2. **Skills:** Convert two-column block to the single-column grouped format above (ATS safety + scannability).
3. **Certifications:** Note the CEH and Fortinet are good; add eJPT (in progress) and OSCP (planned) here to show trajectory — but only the ones genuinely underway.
4. **Projects:** Keep all three academic projects — they are a differentiator at junior level. If a sanitised pentest report exists, add it as a 4th project ("End-to-end penetration test — methodology, findings, remediation"). This is the single most valuable addition for an offensive CV.
5. **Consistency:** Align titles/dates with the website (website says "Network Security Operations Specialist" for Clariant; CV says "Network Operations Specialist" — pick one). Fix the `chat_bot` underscore and any "instore"/"in-store" line-break artefacts.

---

## Summary judgement

The CV is **UK-compliant, well-quantified on the IT side, and ATS-decent** — a strong baseline. The gaps are all on the offensive side: a summary that buries the lead, no quantified security output, missing tool keywords, an ATS-risky two-column skills block, and no portfolio link. Apply the rewritten summary, the grouped skills block, the quantified Eurostop bullet, and the header fix, and this becomes a genuinely competitive junior-pentester CV for the UK market.
