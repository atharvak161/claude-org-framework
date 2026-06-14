# Delivery Summary — JobScope v1
**Written by:** Guide and Explainer
**Date:** 2026-06-09

---

## What it is

JobScope is your personal UK tech job hunter. It pulls jobs from several job
boards into one feed, then does the two things normal job sites never do for
someone on a visa: it checks every employer against the official government list
of companies licensed to sponsor visas, and it flags roles that need UK security
clearance (the SC/DV/CTC kind you can't get). So you stop wasting time on jobs
you were never eligible for. Upload your CV and it also scores how well each role
fits you.

## What you can do right now

Clone it, run a couple of commands, and you have a working job feed:

```
git clone https://github.com/atharvak161/jobscope.git
cd jobscope
cp .env.example .env
# set one secret in .env (the README gives you the exact command to generate it)
docker-compose up
```

Open http://localhost:3000 and jobs appear. It starts the database, sets itself
up, and launches on its own — no manual fiddling.

## The keys you need

Out of the box it pulls "RemoteOK" jobs with no key at all — free and unlimited.
To widen the net, add a few free keys: Adzuna (250 searches/day), Reed
(1,000/day), and Jooble (generous free tier) all cost nothing. The only one that
costs money is Anthropic (the Claude service) — pay-per-use, and only needed if
you want CV upload and fit-scoring. Skip it and everything else still works.

## What the four reviews said (plain English)

- **Engineering:** Pass, with conditions. The single most important check —
  never letting a secretly clearance-required job slip through — hit 100%. Solid
  build.
- **Security:** Safe for you to use right now. The login is currently a
  placeholder, which is fine for a private tool, but must be made real before
  anyone else uses it.
- **Quality (testing):** 87 of 92 tests pass. The five failures are minor and
  already logged for the next round; every critical safety check passed.
- **Deployment:** Full pass. The setup to put it online is ready whenever you
  choose.

## What waits for v1.1

A real login system (only needed before other people use it), tidying up the
five minor test failures, more automated tests for CV-parsing and the job feeds,
and some privacy/GDPR paperwork. None of it blocks you using JobScope today.

## Is it ready?

Yes — it's ready for you to run on your own machine and start finding jobs today;
the only thing that must wait is opening it up to other people.
