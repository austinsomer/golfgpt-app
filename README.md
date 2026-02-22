# GolfGPT ⛳

Centralized golf tee time search for Utah — find availability across 60+ public courses in one place, powered by AI.

## What it does
- Search tee times across Salt Lake, Utah, Summit, and Washington counties
- Natural language queries: "any tee times Saturday morning for 4 players near Salt Lake?"
- Tap a result to book on the course's website

## For agents starting a session
1. Read `AGENTS.md`
2. Read `docs/CONTEXT.md`
3. Read `docs/OPEN_QUESTIONS.md`
4. Check GitHub Issues for assigned work

## Stack
- **Mobile:** React Native + Expo (iOS + Android)
- **Backend:** Supabase (Postgres + Edge Functions)
- **Scrapers:** Playwright on Railway
- **AI:** OpenAI GPT-4o-mini
