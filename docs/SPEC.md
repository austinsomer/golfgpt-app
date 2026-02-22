# Golf Tee Time App — Product Spec & Technical Architecture
_Last updated: 2026-02-19_

---

## 1. Vision

A native mobile app (iOS + Android) that centralizes public golf tee time availability across Utah into one searchable, AI-conversational interface. The core value proposition is **comprehensiveness** — users should never need to visit individual course websites to check availability again.

Booking remains on the course's website (v1). The app is the discovery layer.

---

## 2. App Name (TBD)

**Candidates:**
- **GolfGPT** — clean, memorable, clearly AI-first
- **TeeTimeGPT** — more descriptive, slightly long
- **FairwayAI** — more brandable, less literal
- **PinHigh** — catchy, golf-native, no AI implication
- **TeeUp** — simple, action-oriented

**Recommendation:** GolfGPT is strong if the domain/trademark is clear. Worth checking golfgpt.com availability before committing.

---

## 3. Target Market

- **Geography (MVP):** 4 Utah counties — Salt Lake, Utah, Summit, Washington
- **Estimated public courses in scope:** ~60-80
- **User profile:** Utah golfers (casual weekend players + planners), both demographics served equally
- **No separation between casual/planning users** — unified experience

---

## 4. Core Features (v1)

### 4.1 Tee Time Search (Primary)
- Filter by: date, time range, # of players, county/area, course name
- Results show: course name, available times, # of holes, price (when available), green link to book
- **Booking flow:** tap a result → opens course website (in-app browser or system browser) to complete booking
- 15-30 minute cache on availability data

### 4.2 Conversational Agent (Primary — differentiator)
- Natural language input: _"any tee times Saturday morning for 4 people under $60 near Salt Lake?"_
- Agent interprets intent → queries same data layer as standard search → returns formatted results
- Follow-up capable: _"what about Sunday instead?"_ or _"show me cheaper options"_
- Powered by OpenAI API (GPT-4o-mini — cost-effective, fast)

### 4.3 Standard Sort/Filter UI
- Fallback for users who prefer traditional UI
- Sort by: time, price, distance, course rating
- Filter by: # of players, holes (9/18), county, price range, time of day

### 4.4 Course Directory
- Static course profiles: name, address, phone, website, holes, par, description
- User reviews/ratings (future)

---

## 5. Monetization (Phased)

| Tier | Model | Details |
|------|-------|---------|
| Free | Ad-supported | Banner/interstitial after booking redirect |
| Premium (one-time) | IAP ~$4.99 | No ads |
| Premium+ (subscription) | ~$2.99/mo | Tee time alerts: notify when specific course/time opens up |

**v1 ships free only.** Monetization added post-validation.

---

## 6. Out of Scope (v1)
- In-app booking (no payment processing)
- Private course support
- Course partnership integrations
- User accounts / profiles
- Social/group coordination features
- Reviews/ratings

---

## 7. Tech Stack (Recommended)

### Mobile App
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | **React Native + Expo** | One codebase for iOS + Android; JS-based (closer to Austin's skillset); massive ecosystem; Expo simplifies builds and OTA updates |
| Language | TypeScript | Type safety, better tooling |
| Navigation | React Navigation | Standard, well-supported |
| State | Zustand | Simple, lightweight |
| UI Components | React Native Paper or Tamagui | Polished, theming support for light/dark mode |
| AI Chat UI | Custom component | Simple chat bubble interface |

### Backend
| Layer | Choice | Rationale |
|-------|--------|-----------|
| Platform | **Supabase** | Postgres DB + Auth + Edge Functions + Storage in one; generous free tier; minimal ops overhead |
| Database | PostgreSQL (via Supabase) | Course data, cached tee times, user prefs |
| API | Supabase Edge Functions (Deno) or lightweight Express on Railway | Handles scraper orchestration + AI proxy |
| AI | OpenAI API (GPT-4o-mini) | Cheap, fast, function-calling support for structured search |
| Scraper Host | **Railway.app** | Simple Node.js/Playwright deployment, $5/mo hobby tier |

### Scraping Layer
| Concern | Approach |
|---------|---------|
| Framework | Playwright (headless Chrome) |
| Targets | ForeUp, Lightspeed Golf, Chronogolf booking pages + custom per-course scrapers |
| Schedule | Cron every 20 min per course during daylight hours (6am-8pm) |
| Storage | Results cached in Supabase `tee_times` table with TTL |
| Rate limiting | Polite delays, rotate user agents, respect robots.txt where feasible |

### Infrastructure
| Item | Choice | Est. Cost |
|------|--------|-----------|
| Supabase | Free tier → Pro ($25/mo when needed) | $0-25/mo |
| Railway (scrapers) | Hobby plan | ~$5/mo |
| OpenAI API | Pay per use (GPT-4o-mini ~$0.15/1M tokens) | <$10/mo at early scale |
| App stores | Apple Dev ($99/yr) + Google Play ($25 one-time) | ~$100 first year |
| Domain | golfgpt.com (check availability) | ~$15/yr |
| **Total MVP** | | **~$130 first year + ~$15/mo ongoing** |

---

## 8. Data Architecture

### Tables (Supabase)

```sql
courses
  id, name, county, address, lat, lng, holes, par,
  website_url, booking_url, booking_platform,
  phone, description, active, created_at

tee_times
  id, course_id, datetime, players_available,
  price, holes, scraped_at, expires_at

scraper_runs
  id, course_id, started_at, finished_at,
  status, tee_times_found, error_msg
```

### Booking Platforms to Target (Priority Order)
1. **ForeUp** — most common in Utah municipal courses
2. **Lightspeed Golf (formerly Chronogolf)** — mid-tier courses
3. **TeeItUp** — some SLC courses
4. **EZLinks** — older platform, some county courses
5. **Custom/proprietary** — per-course scrapers as needed

---

## 9. AI Conversational Layer

### How It Works
1. User types natural language query in chat UI
2. App sends message to backend AI endpoint
3. Backend calls OpenAI with:
   - System prompt defining the agent's role + available search parameters
   - Function definition: `search_tee_times(date, time_range, players, county, max_price)`
   - User's message
4. OpenAI calls the function with extracted params
5. Backend queries Supabase for matching tee times
6. Results formatted and returned to user as natural language + structured cards
7. Follow-up messages maintain conversation context (last 10 turns)

### Example Interactions
- _"Looking for a weekend tee time after 8am for 4 people"_ → extracts: weekend dates, after 8am, 4 players, all counties
- _"Any last minute tee times in Salt Lake for 2 people this afternoon?"_ → extracts: today, PM times, 2 players, Salt Lake County
- _"Anything cheaper?"_ → follow-up, adjusts price filter on previous search

---

## 10. MVP Scope & Course Coverage

### Phase 1 Counties (launch)
| County | Est. Public Courses | Notes |
|--------|-------------------|-------|
| Salt Lake | ~25 | Highest demand, SLC city + county courses on ForeUp |
| Washington | ~15 | St. George — tourist-heavy, year-round play |
| Utah County | ~15 | Provo/Orem corridor |
| Summit | ~10 | Park City, seasonal, premium |

### Course Onboarding Process
1. Manual research: identify all public courses + their booking URLs + platform
2. Categorize by booking platform
3. Build platform-level scrapers (ForeUp scraper covers many courses at once)
4. Build custom scrapers for outliers
5. QA each course: verify data accuracy before launch

---

## 11. Build Phases

### Phase 0 — Foundation (Weeks 1-2)
- [ ] Set up Supabase project + schema
- [ ] Research + catalog all ~60-80 courses (name, booking URL, platform)
- [ ] Set up Railway + first scraper (ForeUp)
- [ ] Verify scraper output for 5-10 courses

### Phase 1 — Core Data Layer (Weeks 3-4)
- [ ] Build scrapers for all major platforms (ForeUp, Lightspeed, EZLinks)
- [ ] Custom scrapers for outliers
- [ ] Cron scheduling for all scrapers
- [ ] Supabase data validated and populating

### Phase 2 — App Shell (Weeks 5-6)
- [ ] Expo project setup (iOS + Android)
- [ ] Navigation structure
- [ ] Search UI (filters + results list)
- [ ] Course detail screen
- [ ] In-app browser for booking redirect

### Phase 3 — AI Layer (Weeks 7-8)
- [ ] OpenAI integration on backend
- [ ] Chat UI in app
- [ ] Function calling → tee time search
- [ ] Context/follow-up handling

### Phase 4 — Polish + Launch Prep (Weeks 9-10)
- [ ] Light/dark mode
- [ ] Error states, loading states, empty states
- [ ] App store assets (screenshots, descriptions)
- [ ] Apple Dev + Google Play account setup
- [ ] Beta testing (TestFlight + Google Play internal track)
- [ ] Submission

---

## 12. Open Questions / Decisions Pending
- App name final decision + domain grab
- Design language / visual direction (separate thread)
- Whether to require user accounts for v1 (recommendation: no — keep friction zero)
- Notification infrastructure for tee time alerts (v2 feature, but architecture decision affects v1 DB design)

---

## 13. Key Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Course websites block scrapers | Medium | Polite crawling, fallback to manual updates, cache aggressively |
| Booking platform changes break scrapers | High (over time) | Modular scraper design, alerting on failures |
| App store rejection | Low | Standard content, no payments in v1 |
| GPT costs spike | Low | Rate limit + cache AI responses where possible |
| Course data goes stale (closed courses etc.) | Medium | Admin UI or manual review process |

---

_Next step: design discussion (separate thread), then Phase 0 kickoff._
