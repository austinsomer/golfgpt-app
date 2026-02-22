# Design System — GolfGPT / Utah Tee-Up
_Reference: Austin's mockup, captured 2026-02-22_

---

## Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `color-brand-green` | `#3D5A2A` | Primary brand, banner, active states, borders |
| `color-bg-cream` | `#F5F0E8` | Page background, sidebar background |
| `color-text-primary` | `#3B2F1E` | Headings, body text, logo |
| `color-text-secondary` | `#6B5D4F` | Subtitles, metadata (e.g. city names) |
| `color-text-muted` | `#8A8178` | Timestamps, placeholder text |
| `color-border-default` | `#C4B9A8` | Unselected cell borders, dividers |
| `color-status-green` | `#4A7A2E` | Status/online indicator dot |
| `color-white` | `#FFFFFF` | Text on green backgrounds, unselected cells |

---

## Typography

**Font family:** Serif throughout — recommended: **Playfair Display** (headings) + **Lora** (body/UI). Entire UI is serif — this is intentional and defines the premium, editorial aesthetic.

| Token | Size | Weight | Transform | Tracking |
|-------|------|--------|-----------|---------|
| `type-logo` | 28–32px | Black | Uppercase | Tight |
| `type-tagline` | 11–12px | Medium | Uppercase | Wide |
| `type-section-label` | 13–14px | Bold | Uppercase | Wide |
| `type-body` | 16–17px | Regular | Sentence | Normal |
| `type-caption` | 11–12px | Regular | Uppercase | Wide |
| `type-button` | 11–13px | Bold | Uppercase | Wide |

---

## Components

### Date/Crew Selector Cells
- Dimensions: ~65×52px
- Border: `1px` `#C4B9A8`
- Border-radius: `0px` (sharp — structured/data feel)
- Selected: fill `#3D5A2A`, white text
- Grid: 4-column, shared borders (table-style)

### Time of Day Options
- Full-width rows, height ~48px
- Border-radius: `6–8px`
- Selected: fill `#3D5A2A`, white text, checkmark right
- Default: cream fill, `1px` taupe border

### Chat Message Bubble
- Border: `1.5–2px` `#5A7A3A`
- Border-radius: `12–16px`
- Background: transparent (blends into page bg)
- Padding: 20–24px

### Chat Input
- Border: `3–4px` `#3D5A2A` (thick — deliberate focal point)
- Border-radius: `12–16px`
- Height: ~56–60px
- Left mic icon, right send button area
- Placeholder: italic serif, `#A09888`

### Suggestion Chips
- Border: `1.5px` `#3D5A2A`
- Border-radius: `24px` (full pill)
- Background: transparent
- Text: uppercase, bold, 11–12px, dark green

### Favorites List
- No cards, no borders — pure typographic list
- Course name: bold uppercase, `#3B2F1E`
- Location: small uppercase, `#6B5D4F`
- 20–24px vertical spacing between items

---

## Layout (Desktop Reference)

Two-panel: **left sidebar** (~300px filters) + **right main** (chat/results area).

Mobile adaptation:
- Sidebar collapses to a bottom sheet or top filter bar
- Chat area becomes full-screen
- Suggestion chips become horizontally scrollable

---

## AI Chat Branding

- **Name:** "CADDY BOT" (not "AI", not "Assistant")
- **Personality:** Friendly, golf-literate, uses golf slang ("ace!", "hit the links", "Beehive State")
- **Status indicator:** Green dot before "CADDY BOT" label
- **Suggested prompts (examples):**
  - "MORNING SLOTS IN SLC"
  - "9 HOLES NEAR ME"
  - "SAND HOLLOW THIS WEEKEND"
  - "BEST DEALS TODAY"

---

## Design Principles (observed)

1. **All-serif** — premium, editorial, country-club feel. Resist the urge to swap in sans-serif for "readability"
2. **Sharp vs. rounded contrast** — grids/data = sharp corners; conversational elements = rounded
3. **Earthy, desaturated palette** — no bright blues or neons. Green-brown-cream = fairway, sand, clubhouse
4. **Thick borders signal interaction** — input has 3–4px border vs. 1px everywhere else
5. **Sparse, not minimal** — generous whitespace but not sterile; warm and inviting

---

## Open Design Questions (to resolve before mobile build)

- **App name:** Mockup shows "UTAH TEE-UP" — is this the final name? (vs. GolfGPT/TeeTimeGPT)
- **Dark mode:** Inverted cream→dark + keep greens, or full redesign?
- **Mobile nav pattern:** Bottom tab bar? Slide-out drawer? Bottom sheet filters?
- **App icon:** Golf flag + chat bubble combo mark (seen in mockup top-left)
