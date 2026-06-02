# Consultation Record — Financial Dashboard: Open Banking vs CSV Import First — 2026-06-02

## Problem statement
The financial dashboard must connect to users' bank accounts to display live
transaction data. Two integration approaches are available: Open Banking API
(FCA-regulated, requires OAuth and institutional registration) and CSV import
(user uploads a bank statement export manually). The team must decide which to
implement first. The decision determines the next 4–6 weeks of backend and
integration engineering work, affects the security review scope, and has
compliance implications under PSD2. Starting with the wrong approach could
mean rebuilding core data ingestion logic mid-project.

## Agents consulted

### Integration Engineer — Engineering
Open Banking should come first. It produces real-time, structured data with
a standard schema (OFX/ISO 20022) that the backend can be designed around from
the start. Building CSV import first would likely produce an ad-hoc parsing
layer that conflicts with the eventual Open Banking schema, requiring a full
data ingestion rewrite. The technical debt cost of doing it in the wrong order
outweighs the complexity of the Open Banking setup.

### Security Architect — Security
CSV import should come first, from a risk management perspective. Open Banking
requires FCA registration, OAuth 2.0 flows, token storage, and consent
management — all of which expand the attack surface significantly before the
application has been hardened. CSV import is stateless and requires no
persistent credentials. Starting with CSV gives the team time to pass a security
baseline review before introducing live bank access. Open Banking can follow
once the security foundation is verified.

### Business Analyst — Product
CSV import should come first, as a validated MVP. The core value proposition —
seeing your finances in one place — can be demonstrated and tested with CSV
before any API integration is built. This allows Atharva to get real user
feedback on the dashboard layout and categorisation logic before committing to
the Open Banking integration path. If users find the categorisation unhelpful,
the entire data pipeline may need rethinking, and it is better to discover that
with low-cost CSV than after 6 weeks of Open Banking work.

## Points of agreement
All three agents agree that Open Banking is the correct long-term approach and
must eventually be implemented. All three agree the data schema chosen now will
have lasting consequences and should not be changed mid-project. All three agree
that Open Banking requires non-trivial security and compliance work that must
not be rushed.

## Points of disagreement
The Integration Engineer argues that sequencing matters technically — building
CSV first risks schema debt. The Security Architect and Business Analyst both
argue that sequencing matters from a risk and learning perspective — building
Open Banking first before the security baseline or product-market fit is
confirmed is the higher-risk path. The disagreement is fundamentally about
which type of risk (technical debt vs security/product risk) is more dangerous
at this stage.

## Decision made by: Product Manager

## Decision: Build CSV import first, with the data schema designed to be
compatible with the Open Banking schema from day one, so that migration to
Open Banking does not require a rewrite of the ingestion layer.

## Rationale: The Business Analyst and Security Architect's concerns are valid
and represent real risks that are higher-probability at this early stage than the
Integration Engineer's schema debt concern. However, the Integration Engineer's
point about schema compatibility is correct and is addressed by the constraint:
the CSV parser must be built to the Open Banking data model, not invented
independently. This gives the team user feedback and a security baseline before
live bank credentials enter the system, while avoiding the technical debt risk
the Integration Engineer correctly identified.

## Dissenting view logged: Yes
Integration Engineer noted that "designed to be compatible" is an aspiration,
not a guarantee, and recommends the schema be formally approved by the Solution
Architect before any CSV parsing code is written. This recommendation is
accepted and will be added to the task brief for the Backend Developer.
