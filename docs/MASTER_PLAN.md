# GolfGPT — Master Plan
_The single source of truth. If you're starting a new session, read this first._

---

## What We're Building

A native mobile app (iOS + Android) that centralizes public golf tee time availability across Utah into one place. Users can search availability across 60–80 public courses via filters or a conversational AI chat interface ("Caddy Bot"), then tap through to book on the course's website.

**The core value prop is comprehensiveness.** Every other tool (GolfNow, TeeOff) only covers some courses. We cover all of them.

**Owner:** Austin Somer  
**Agents:** GUPPI (data/backend) + Ed (mobile app)  
**Repo:** https://github.com/austinsomer/golfgpt-app  
**Discord:** #golf-development (technical), #golf-booking-design⛳ (product/UX), #golf-dev-log (progress feed), #golf-data (scrapers/data)

---

## Key Decisions (locked)

| Decision | Choice | Why |
|----------|--------|-----|
| Mobile framework | React Native + Expo | One codebase for iOS/Android; JS-based; Expo handles builds |
| Database/backend | Supabase (Postgres) | All-in-one: DB + auth + edge functions; minimal ops |
| Scraping | Playwright on Railway | Headless Chrome; handles JS-rendered booking sites |
| AI | OpenAI GPT-4o-mini | Function-calling for structured search; cheap at scale |
| Booking in v1 | Redirect to course website | No payment complexity; builds trust with courses |
| User accounts in v1 | None | Zero friction to open and use (ADR-001) |
| Tee time cache TTL | 15–30 minutes | Balance freshness vs. scraper load |
| MVP geography | Salt Lake, Utah, Summit, Washington counties | ~60–80 public courses |
| App bundle ID (placeholder) | com.golfgpt.app | Final app name TBD (see OQ-001) |

---

## Tech Stack

```
apps/
  mobile/           ← React Native + Expo (Ed's domain)
    src/
      screens/      ← Search, TeeTimes, Chat, CourseList, CourseDetail
      components/   ← TeeTimeCard, MessageBubble
      navigation/   ← Bottom tabs + stacks
      store/        ← Zustand (searchStore, chatStore)
      constants/    ← theme.ts (colors, spacing, typography)

services/
  scraper/          ← Playwright workers (GUPPI's domain)
  supabase/
    migrations/     ← SQL schema files
    seed/           ← Course seed data

docs/
  MASTER_PLAN.md    ← This file — start here
  SPEC.md           ← Full product spec + feature details
  CONTEXT.md        ← Current phase, what each agent is working on
  OPEN_QUESTIONS.md ← Decisions pending Austin's input
  AGENT_ROLES.md    ← Ownership map
  DESIGN_SYSTEM.md  ← Colors, typography, component specs
  decisions/        ← Immutable ADRs (Architecture Decision Records)
```

### Supabase Schema (3 tables)
- **`courses`** — static course data (name, county, address, booking URL, platform)
- **`tee_times`** — scraped availability cache (course_id, datetime, players, price, expires_at)
- **`scraper_runs`** — scraper health log (course_id, status, times_found, error_msg)

Migration file: `services/supabase/migrations/001_initial_schema.sql`  
⚠️ **Status: Written but not yet applied** — Austin needs to run it in Supabase SQL Editor at https://supabase.com/dashboard/project/opzqsxrfqasqadnjdgop

### Credentials (all in 1Password vault: `openclaw`)
| What | 1Password item |
|------|---------------|
| Supabase URL + keys | "Supabase GolfGPT - Legacy anon, service_role API keys" |
| OpenAI API key | "API Secret - OpenAI" |
| GitHub token | "GitHub - API Credentials - Agent Collaboration" |

---

## Build Roadmap

### ✅ Phase 0 — Foundation (DONE)
- [x] GitHub repo created and scaffolded
- [x] Full doc structure (SPEC, CONTEXT, OPEN_QUESTIONS, AGENT_ROLES, ADR-001)
- [x] Supabase project created, migration SQL written
- [x] Expo app scaffolded (navigation, screens, stores, components)
- [x] Design system captured from Austin's mockup
- [ ] **BLOCKED: Supabase migration needs manual run** (Austin)

### 🔄 Phase 1 — Core Data Layer (next)
- [ ] Apply Supabase schema (Austin runs SQL in dashboard)
- [ ] Research + catalog all ~60–80 courses: name, booking URL, platform
- [ ] Build ForeUp scraper (covers majority of Utah municipal courses)
- [ ] Build Lightspeed/Chronogolf scraper
- [ ] Build custom scrapers for outlier courses
- [ ] Deploy scrapers to Railway with 20-min cron
- [ ] Validate data: spot-check 10+ courses for accuracy

### Phase 2 — App Shell + Real Data
- [ ] Apply design system to mobile app (colors, typography from DESIGN_SYSTEM.md)
- [ ] Wire Supabase client into app
- [ ] Search screen: real filter → real tee time results
- [ ] Course list: real course data
- [ ] Tee time card: tap → open course website in browser
- [ ] Loading states, error states, empty states

### Phase 3 — AI / Caddy Bot
- [ ] Backend API endpoint for chat (Supabase Edge Function or Railway)
- [ ] OpenAI function-calling: parse natural language → search params
- [ ] Chat screen wired to real data
- [ ] Suggestion chips (contextual, pre-seeded)
- [ ] Follow-up conversation context (last 10 turns)

### Phase 4 — Polish + Launch Prep
- [ ] Light/dark mode implementation
- [ ] Finalize app name + bundle ID
- [ ] App store assets (icon, screenshots, descriptions)
- [ ] Apple Developer account ($99/yr) — submit for approval
- [ ] Google Play account ($25 one-time)
- [ ] Beta testing via TestFlight + Google Play internal track
- [ ] App Store + Play Store submission

### Phase 5+ (Post-launch)
- [ ] Monetization: ads (free tier), one-time premium IAP (no ads)
- [ ] Tee time alerts (push notifications when slots open)
- [ ] User accounts (required for alerts/personalization)
- [ ] Expand to more Utah counties / other states

---

## Current Status

**Phase:** 0 complete / Phase 1 starting  
**Blocker:** Supabase migration (Austin runs SQL in dashboard)  
**GUPPI next:** Scraping infrastructure + course catalog research (unblocked once migration runs)  
**Ed next:** Apply design system to app shell, prep for real data wiring

See `docs/CONTEXT.md` for live agent status.  
See `docs/OPEN_QUESTIONS.md` for decisions that need Austin's input.

---

## Re-onboarding a Fresh Session

If either agent loses context, give them this:

> "You are [GUPPI/Ed], working on GolfGPT — a Utah golf tee time aggregator app. Read docs/MASTER_PLAN.md in the repo https://github.com/austinsomer/golfgpt-app for full context, then read docs/CONTEXT.md for current status and docs/OPEN_QUESTIONS.md for pending decisions."

That's all you need. Everything else is in those three files.
