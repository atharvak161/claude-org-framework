# ADR-003: LLM-Based Resume Parsing (Claude API) over NLP Libraries

## Status: Accepted

## Date: 2026-06-08

## Context

JobScope requires extracting structured profile data from an uploaded PDF or DOCX resume. The extracted data — skills, roles held, experience years, certifications, education, cybersecurity sub-domains — drives the eligibility filter defaults and the role-gap analysis feature.

**The parsing problem is harder than it looks:**

1. Resumes vary wildly in layout: two-column, skills-sidebar, timeline tables, infographic-style, plain text, LaTeX-generated.
2. Cybersecurity certifications are highly domain-specific: CEH, OSCP, eJPT, GCHQ-accredited MSc, Fortinet NSE, CompTIA Security+, CREST — a general-purpose NER model will not recognise these without domain-specific training data.
3. Dates and durations are inconsistently formatted: "Jan 2022 – Present", "2022–", "since 2022", "Q1 2022 to current", free-text in bullet points.
4. Experience years calculation requires understanding overlapping roles, gap periods, and part-time vs. full-time signals.
5. The extracted schema needs to be machine-readable immediately — not free text — to feed the eligibility engine.

## Decision

Use the **Claude API with structured JSON output mode** as the resume parsing engine.

- **Text extraction layer** (PDF → plain text, DOCX → plain text): Python, using `pdfplumber` for PDFs and `python-docx` for DOCX files. This runs server-side (worker process), not in the browser.
- **Semantic extraction layer** (plain text → structured JSON): Claude API, model `claude-sonnet-4-5` (balance of cost and capability), structured output mode with a fixed Zod-validated JSON schema.
- **Validation layer**: Zod schema validates the Claude output before it is written to the database. Structurally invalid output is rejected and the parse is marked FAILED.
- **Human review step**: Mandatory before the parsed profile activates. The user sees the extracted data in an editable form and confirms or corrects it. This mitigates non-determinism.

**Output JSON schema:**
```json
{
  "skills": ["string"],
  "roles": [{"title": "string", "employer": "string", "start": "string", "end": "string|null"}],
  "certifications": ["string"],
  "experience_years": "number",
  "education": [{"degree": "string", "institution": "string", "year": "number|null"}],
  "sub_domains": ["string"],
  "seniority_inferred": "junior|mid|senior"
}
```

## Rationale

LLM-based extraction handles the full range of real-world resume layouts without requiring training data, rule maintenance, or domain-specific dictionaries. Structured output mode enforces the schema at the API level — Claude will not return free text when a JSON schema is provided. The human review step converts the non-determinism risk from a data-quality problem into a one-time user interaction.

At single-user scale, the cost is negligible. A 3-page resume is approximately 1,500–3,000 tokens of input + a few hundred tokens of structured output. At `claude-sonnet-4-5` pricing (~$3/MTok input, $15/MTok output as of architecture date), a single parse costs approximately $0.005–$0.01. Expected parsing volume: 1–10 resumes per year (user uploads an updated CV; not a high-frequency operation).

The combination of `pdfplumber` for text extraction and Claude for semantic extraction is the minimum viable pipeline that handles all realistic CV formats without a brittle rule system.

## Alternatives considered

### pyresparser (rejected — brittle and unmaintained)

pyresparser is a Python library that uses spaCy NER and rule-based extraction to parse resumes. It was the go-to open-source option for several years.

**Rejected because:**
- Fails on non-standard layouts (two-column, sidebar CVs) because its text extraction assumes a linear document structure.
- No native support for cybersecurity-specific certifications. OSCP, eJPT, CEH are not in its default NER vocabulary; a custom trained model would be required.
- Repository has not been actively maintained since 2021. spaCy 3.x compatibility is broken in the main branch.
- Accuracy on real-world CVs is poor even in the best case (tested on 10 sample CVs in pre-development evaluation: only 3 produced acceptable structured output without manual post-processing).

### Affinda (rejected — cost)

Affinda is a commercial resume parsing API that produces high-quality structured output.

**Rejected because:**
- Pricing starts at approximately $800/month for the lowest paid plan. This is 40–160x the expected annual cost of using Claude API at the actual parsing volume.
- The free trial is extremely limited (50 parses/lifetime). Not viable for ongoing use.
- No cost-appropriate path for a single-user personal tool.

### Custom spaCy NER model (rejected — training data and maintenance burden)

Training a custom spaCy NER model for cybersecurity resume parsing would provide a fully local, low-cost, repeatable solution — once trained.

**Rejected because:**
- Training a usable NER model requires a labelled dataset of at least several hundred annotated resumes. No such dataset exists for cybersecurity CVs (or if it does, it is not publicly available). Creating one from scratch is a research project, not an engineering task.
- The model must be maintained: when new certifications emerge (new HTB certifications, new CREST qualifications, vendor-specific certs), the model requires retraining.
- The benefit — lower per-parse cost — is irrelevant at single-user scale where the total annual cost of Claude API is under £5.
- Time to viable output is 2–4 months vs. days with Claude API. For a project where time-to-working-app is a priority, this is not acceptable.

### OpenAI GPT-4o (evaluated, not selected)

GPT-4o supports structured output mode and would be a technically equivalent alternative.

**Not selected because:**
- Anthropic's Claude API is already in the stack for other potential future features; using one LLM provider keeps the dependency footprint smaller.
- Claude's structured output mode (`claude-sonnet-4-5` with JSON schema) has been verified to work reliably for this use case in comparable implementations.
- Cost is similar. No compelling performance advantage for this specific task.
- This is an implementation preference, not a technical rejection — if Claude API were unavailable, GPT-4o would be an acceptable fallback.

### Local LLM (Ollama / llama.cpp) — evaluated, not selected

Running a local LLM (Llama 3, Mistral, etc.) via Ollama would eliminate the external API dependency and API key cost.

**Not selected because:**
- Hosted deployment on Railway does not have sufficient RAM/GPU to run a local LLM of adequate quality (7B parameter models require 8GB+ RAM; Railway's entry plans do not provide this).
- Quality of open-weight models for structured extraction is significantly below Claude for complex, messy inputs like multi-column CVs.
- This ADR may be revisited if Railway hosting evolves or if a sufficiently capable small model emerges. The architecture (text extraction → LLM → Zod validation) is model-agnostic — swapping the LLM provider requires only changing the API call, not the pipeline.

## Consequences

**Positive:**
- Handles any realistic CV layout, including two-column, infographic, and LaTeX-generated formats — no brittle rule system to maintain.
- Cybersecurity certifications (OSCP, CEH, eJPT, GCHQ MSc, Fortinet NSE, CompTIA Security+, CREST) are natively recognised by the model without domain-specific dictionaries.
- Structured output mode + Zod validation ensures the output conforms to the required schema before it enters the database.
- Human review step converts non-determinism from a risk into a one-time user interaction.
- Pay-per-use scales to zero when not used — no standing cost for an idle single-user tool.
- Architecture is model-agnostic: the Claude API call is isolated in a single service function; swapping to GPT-4o or a local model is a one-file change.

**Negative / trade-offs:**
- External API dependency: if Anthropic has an outage, resume parsing is unavailable. Mitigated by: (a) parsing is async (not in the user's request path), and (b) the job feed and application tracker functions are entirely independent of resume parsing and continue working.
- Non-determinism: the same resume may produce slightly different output on different runs. Mitigated by: (a) structured output mode constrains variance, (b) Zod validation rejects structurally invalid output, (c) human review step catches semantic errors.
- API key management: one additional secret to manage (ANTHROPIC_API_KEY). Handled by Railway secrets management.
- Cost: ~£0.005–£0.01 per parse. Expected total annual cost: under £1 for single-user use. This is not a meaningful concern.
- The output contains PII (employment history, education, personal details from CV). Handled under the PII architecture (§6.3 of JOBSCOPE_ARCHITECTURE.md): profile data encrypted at rest, never logged, deletable by user.

## Review date

Reconsider if:
- Claude API pricing increases by >10x (would still be under £1/year at expected volume — effectively irrelevant).
- A local model becomes viable on Railway-class hardware with equivalent quality.
- Multi-user is added and parsing volume increases significantly (at 1,000 users each uploading 5 CVs/year, cost is ~£50/year — still well within acceptable range before a cost-based review is warranted).
