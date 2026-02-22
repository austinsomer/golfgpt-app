# CONTEXT.md — Project State

## Project
**Phase:** 1 — Core Data Layer  
**Last stable:** Phase 0 complete — repo scaffold + Expo app shell ✅

---

## GUPPI
**Working on:** Phase 1 scraping infrastructure + course catalog  
**Status:** Active  
**Next:** ForeUp scraper research + build, Railway deployment, course seed data  
**Last updated:** 2026-02-22

## Ed
**Working on:** Phase 1 prep — design system application + real data wiring  
**Status:** Active  
**Next:** Apply DESIGN_SYSTEM.md to app shell (theme, typography, components), then wire Supabase client  
**Last updated:** 2026-02-22

---

## Milestone Log

### Phase 0 ✅ DONE
- [x] GitHub repo + full doc structure
- [x] Supabase project created (project: opzqsxrfqasqadnjdgop)
- [x] Schema migration written + **APPLIED** (Austin ran 2026-02-22)
  - Tables live: `courses`, `tee_times`, `scraper_runs`
  - RLS not yet enabled (fine for now, flag for pre-launch)
- [x] Expo app scaffolded: 3-tab navigation, 5 screens, Zustand stores, mock data
- [x] Design system captured (docs/DESIGN_SYSTEM.md)
- [x] App tested on device via Expo Go ✅

### Phase 1 🔄 IN PROGRESS
- [x] Supabase migration applied
- [ ] Course catalog research (~60-80 courses: name, booking URL, platform)
- [ ] ForeUp scraper (GUPPI)
- [ ] Lightspeed/Chronogolf scraper (GUPPI)
- [ ] Custom scrapers for outliers (GUPPI)
- [ ] Railway deployment + 20-min cron (GUPPI)
- [ ] Data validation: 10+ courses spot-checked
- [x] Apply design system to mobile app shell (Ed) — `570d72e`
- [ ] Wire Supabase client into app (Ed) — blocked on course data from GUPPI
