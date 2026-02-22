# AGENTS.md — GolfGPT

## Starting a session
1. Read `docs/MASTER_PLAN.md` (full context, decisions, roadmap)
2. Read `docs/CONTEXT.md` (current phase, what each agent is working on)
3. Read `docs/OPEN_QUESTIONS.md` (pending decisions needing Austin)
4. Check GitHub Issues for your assigned work

## Conventions
- GUPPI owns: data layer, Supabase schema, scraping infra, API integrations
- Ed owns: mobile app (apps/mobile/), frontend, DevOps
- Ambiguous work → GitHub Issue, Austin assigns

## Commit style
feat: / fix: / chore: / docs: prefixes. Keep messages short and descriptive.

## Never
- Don't commit secrets (use .env files, never tracked)
- Don't touch the other agent's ownership area without a GitHub issue

