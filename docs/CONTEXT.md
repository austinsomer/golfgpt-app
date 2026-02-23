# CONTEXT.md — Project State

## Project
**Phase:** 1 — Core Data Layer (in progress)
**Last stable:** App on live Supabase data — `b084ed0`

---

## GUPPI
**Working on:** Expanding course catalog + Railway deployment
**Status:** Active
**Next:** More schedule_ids, Lightspeed scraper, Railway cron setup
**Last updated:** 2026-02-22

## Ed
**Working on:** Phase 1 complete on mobile — waiting on more course data
**Status:** Holding (clean)
**Next:** More screens to wire as GUPPI expands catalog; Phase 2 polish when ready
**Last updated:** 2026-02-22

---

## Milestone Log

### Phase 0 ✅ DONE
- [x] GitHub repo + full doc structure
- [x] Supabase project created (project: opzqsxrfqasqadnjdgop)
- [x] Schema migration 001 applied (Austin, 2026-02-22)
  - Tables live: `courses`, `tee_times`, `scraper_runs`
- [x] Expo app scaffolded: 3-tab navigation, 5 screens, Zustand stores
- [x] Design system captured (docs/DESIGN_SYSTEM.md)
- [x] App tested on device via Expo Go ✅

### Phase 1 🔄 IN PROGRESS
- [x] Supabase migration 001 applied
- [x] ForeUp scraper skeleton (GUPPI) — `services/scraper/`
- [x] 3 Utah courses in catalog (Stonebridge ✅, Remuda ✅, El Monte ⚠️ unverified)
- [x] 282 tee times written to Supabase (Stonebridge, 7-day lookahead)
- [x] Apply design system to app shell (Ed) — `570d72e`
- [x] Supabase data layer in app — typed queries, formatters (Ed) — `b26ca43`
- [x] App wired to live data — mock removed (Ed) — `b084ed0`
- [ ] **⚠️ BLOCKED (Austin):** Apply migrations 002 + 003 in Supabase Studio
  - `services/supabase/migrations/002_courses_unique_booking_url.sql`
  - `services/supabase/migrations/003_expand_county_constraint.sql`
  - Then GUPPI re-runs seed to add Weber county courses
- [x] Expand course catalog — 17 active Utah ForeUp courses seeded (GUPPI)
  - Salt Lake: 8, Utah County: 5, Weber: 4
  - 432+ tee times across 7-day lookahead
- [x] Date picker, dynamic county filter, inline tee times on CourseDetail (Ed) — `ddc3572`
- [ ] Railway deployment + 20-min cron (GUPPI) — **next milestone**
- [ ] Lightspeed/Chronogolf scraper (GUPPI)
- [ ] Custom scrapers for outliers (GUPPI)
- [ ] Data validation ongoing as catalog expands
- [ ] RLS on Supabase tables (before public launch)

### Phase 2 — App Shell + Polish (next after Phase 1 data is solid)
- [ ] Loading states refinement, skeleton screens
- [ ] Search filter date picker (real date, not hardcoded today)
- [ ] County filter populated dynamically from DB
- [ ] Course detail: show today's available tee times inline
- [ ] In-app browser (vs system browser) for booking redirect
- [ ] Light/dark mode

### Phase 3 — Caddy Bot AI
- [ ] Backend endpoint (Supabase Edge Function or Railway)
- [ ] OpenAI function-calling: natural language → search params
- [ ] Chat screen wired to real search results
- [ ] Follow-up conversation context
