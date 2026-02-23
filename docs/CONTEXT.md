# CONTEXT.md — Project State

## Project
**Phase:** 2 — App Shell + Polish
**Last stable:** Phase 1 complete — Railway cron live, app self-sustaining

---

## GUPPI
**Working on:** Phase 2 planning / more course coverage
**Status:** Standby
**Next:** Lightspeed/Chronogolf scraper when ready to expand beyond ForeUp
**Last updated:** 2026-02-22

## Ed
**Working on:** Phase 2 — polish, skeleton screens, Phase 3 AI prep
**Status:** Active
**Next:** Skeleton loading states, search date persistence, Phase 2 backlog
**Last updated:** 2026-02-22

---

## Milestone Log

### Phase 0 ✅ DONE
- [x] GitHub repo + full doc structure
- [x] Supabase project created + schema applied (3 tables: courses, tee_times, scraper_runs)
- [x] Expo app scaffolded — 3-tab navigation, 5 screens, Zustand stores
- [x] Design system captured (docs/DESIGN_SYSTEM.md)
- [x] App tested on device via Expo Go ✅

### Phase 1 ✅ DONE
- [x] ForeUp scraper skeleton — HTTP client, 7-day lookahead, Supabase upserts
- [x] 17 active Utah ForeUp courses seeded (Salt Lake: 8, Utah County: 5, Weber: 4)
- [x] 432+ tee times in Supabase across 7-day window
- [x] Design system applied to app (Playfair Display + Lora, cream/green palette)
- [x] Supabase data layer — typed queries, formatters
- [x] Mock data removed — all screens on live Supabase
- [x] Date picker (native iOS/Android), dynamic county filter, inline tee times on CourseDetail
- [x] Railway cron deployed — scraper runs every 20 minutes automatically ✅
- Supabase migrations 001–003 applied
- County constraint covers: salt_lake, utah, summit, washington, weber, davis, cache + more

### Phase 2 🔄 NEXT — App Shell + Polish
- [ ] Skeleton loading screens (vs. ActivityIndicator spinners)
- [ ] Search: date picker persists state on back-navigate
- [ ] In-app browser (WebView) for booking redirect vs. system browser
- [ ] Course detail: "next available" across multiple days, not just today
- [ ] Empty state illustrations
- [ ] Light/dark mode
- [ ] Error boundary

### Phase 3 — Caddy Bot AI (after Phase 2 polish)
- [ ] Backend endpoint (Supabase Edge Function)
- [ ] OpenAI function-calling: natural language → searchTeeTimes() params
- [ ] Chat screen wired to real search results
- [ ] Suggestion chips trigger real searches
- [ ] Follow-up conversation context (last 10 turns)

### Phase 4 — Launch Prep
- [ ] Finalize app name + bundle ID (see OPEN_QUESTIONS.md)
- [ ] Apple Developer account + TestFlight
- [ ] Google Play internal track
- [ ] App store assets (icon, screenshots, descriptions)
- [ ] RLS on all Supabase tables
- [ ] App Store + Play Store submission

### Backlog / Post-Launch
- [ ] Lightspeed/Chronogolf scraper (more courses beyond ForeUp)
- [ ] Expand to 60-80 course target
- [ ] Tee time alerts (push notifications)
- [ ] Monetization: ad-supported free + one-time premium IAP
- [ ] User accounts (required for alerts/personalization)
