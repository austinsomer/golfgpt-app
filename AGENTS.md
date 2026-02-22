# AGENTS.md — GolfGPT

## Starting a session
1. Read this file
2. Read docs/CONTEXT.md for current project state
3. Read docs/OPEN_QUESTIONS.md for anything needing decisions
4. Pull your assigned GitHub issue and get to work

## Conventions
- GUPPI owns: data layer, Supabase schema, scraping infra, API integrations
- Ed owns: mobile app (apps/mobile/), frontend, DevOps
- Ambiguous work → GitHub Issue, Austin assigns

## Commit style
feat: / fix: / chore: / docs: prefixes. Keep messages short and descriptive.

## Never
- Don't commit secrets (use .env files, never tracked)
- Don't touch the other agent's ownership area without a GitHub issue
