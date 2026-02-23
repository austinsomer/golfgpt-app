# CONTEXT.md — Project State

## Project
**Phase:** 4 — Launch Prep
**Last stable:** Phase 3 complete — Caddy Bot AI live, full end-to-end app working

---

## GUPPI
**Working on:** Standby / course catalog expansion (Lightspeed/Chronogolf)
**Status:** Standby
**Next:** Lightspeed/Chronogolf scraper to expand beyond 17 ForeUp courses; support Phase 4 launch prep
**Last updated:** 2026-02-22

## Ed
**Working on:** Phase 4 — Launch Prep
**Status:** Active
**Next:** Apple Developer account + TestFlight (Austin reminder set for 1pm tomorrow), app name/bundle ID, app store assets
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

### Phase 2 ✅ DONE — App Shell + Polish
- [x] Skeleton loading screens (vs. ActivityIndicator spinners)
- [x] Search: date picker + collapsible filters, COMING UP quick-view
- [x] In-app browser (expo-web-browser) (WebView) for booking redirect vs. system browser
- [x] Course detail: multi-day navigator (14-day window), not just today
- [x] Empty states (text)
- [ ] Light/dark mode
- [x] Error boundary

### Phase 3 ✅ DONE — Caddy Bot AI
- [x] Supabase Edge Function `chat-query` deployed
- [x] OpenAI GPT-4o-mini function-calling: natural language → searchTeeTimes() params
- [x] ChatScreen wired to real Edge Function + result cards
- [x] Suggestion chips trigger real searches
- [x] Follow-up conversation context (last 10 turns)
- [x] OpenAI key set as Supabase secret

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
