# 🎨 Design System — Namka Mission Control
> **Version:** 1.0 · Ratified 2026-03-29
> **Owner:** Ali Mora · Johannesburg, ZA
> **Repo:** https://github.com/AliMora83/Namka-Mission-Control
> **Stack:** TypeScript / Next.js

---

## 1. Design Philosophy

Namka Mission Control is a **live operational cockpit** — not a project manager,
not a CRM. It stays open all day. Every design decision serves one goal:

> *Let Ali see what needs his decision, what's running autonomously, and what to
> focus on — in under 10 seconds, without scrolling.*

**Three principles:**
1. **Density with clarity** — Show all 16 projects at a glance. No hiding behind tabs or modals for primary data.
2. **Hierarchy through contrast** — Dark header and Chief of Staff panel anchor the UI. Light content area breathes. Red means blocked. Everything else is calm.
3. **Data feels live** — Pulsing dots, auto-refresh timestamps, and the Chief of Staff briefing make the dashboard feel like a room with people in it, not a static report.

---

## 2. Typography

### Font Families

| Role | Font | Weights | Used For |
|------|------|---------|----------|
| **Sans** (default) | Geist | 300 400 500 600 700 800 900 | All body text, card names, UI elements |
| **Mono** | JetBrains Mono | 400 500 | Badges, timestamps, stack labels, status labels, live clock, code |

> **Rule:** Only 2 fonts load in the browser. No exceptions. No third font.

### Loading (Next.js)

```tsx
// app/layout.tsx
import { Geist, JetBrains_Mono } from 'next/font/google'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
})
```

### CSS Variables

```css
:root {
  --font-sans:    var(--font-geist, 'Geist', ui-sans-serif, system-ui, sans-serif);
  --font-mono:    var(--font-jetbrains-mono, 'JetBrains Mono', monospace);
  --font-display: var(--font-sans);  /* Geist 800 = display — no third font needed */
}
```

### Type Scale

```css
:root {
  --text-xs:   11px;   /* badges, timestamps, meta labels */
  --text-sm:   12px;   /* card stack, secondary text, CoS list items */
  --text-base: 13.5px; /* body — card next-step, descriptions, CoS body */
  --text-md:   15px;   /* card names */
  --text-lg:   17px;   /* section labels */
  --text-xl:   22px;   /* sidebar stat numbers */
  --text-2xl:  26px;   /* hero card project name */
}
```

### Font Assignment Rules

```css
/* DISPLAY — Geist 800, tight letter-spacing */
.logo,
.hero-name,
.priority-title,
.panel-title,
.cos-title,
.stat-mini-value {
  font-family: var(--font-display);
  font-weight: 800;
  letter-spacing: -0.02em;
}

/* MONO — all data, labels, badges, live values */
.badge,
.card-stack,
.card-number,
.status-label,
.agent-task,
.feed-time,
.stat-mini-label,
.dd-card-project,
.cos-date,
.cos-section,
.sync-chip,
#live-clock,
.header-meta-chip,
.priority-meta,
.blockers-tag,
.online-badge,
.panel-badge {
  font-family: var(--font-mono);
}

/* SANS — body default, no override needed */
body { font-family: var(--font-sans); }
```

---

## 3. Colour System

### Palette

```css
:root {

  /* ── Backgrounds ───────────────────────────────────────── */
  --bg:          #F2F0EB;   /* warm cream — page background */
  --surface:     #FFFFFF;   /* card and panel surfaces */
  --surface2:    #F8F7F4;   /* sidebar, secondary fills */
  --surface3:    #F0EEE9;   /* hover states */

  /* ── Borders ────────────────────────────────────────────── */
  --border:      #E8E6E0;   /* default border */
  --border2:     #D4D2CB;   /* stronger dividers */
  --border3:     #C0BDB5;   /* active / focus borders */

  /* ── Text ───────────────────────────────────────────────── */
  --ink:         #0D0D0D;   /* primary — near black */
  --ink-mid:     #4A4A47;   /* secondary text */
  --ink-dim:     #8E8C85;   /* muted / captions */
  --ink-placeholder: #B5B3AC;

  /* ── Brand ──────────────────────────────────────────────── */
  --brand-red:   #E8380D;   /* primary CTA, logo slash, New Project button */
  --brand-dark:  #0D0D0D;   /* header bg, hero card bg, CoS panel bg */

  /* ── Semantic: Success (Active / Done / Online) ─────────── */
  --success:        #16A34A;
  --success-bg:     #F0FDF4;
  --success-border: #BBF7D0;

  /* ── Semantic: Warning (Amber / Stale / Standby) ────────── */
  --warning:        #D97706;
  --warning-bg:     #FFFBEB;
  --warning-border: #FDE68A;

  /* ── Semantic: Danger (Blockers / Red alerts) ───────────── */
  --danger:        #DC2626;
  --danger-bg:     #FEF2F2;
  --danger-border: #FECACA;

  /* ── Semantic: Info (Blue / Review / Gemini) ────────────── */
  --info:        #2563EB;
  --info-bg:     #EFF6FF;
  --info-border: #BFDBFE;

  /* ── Shadows ─────────────────────────────────────────────── */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-sm: 0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06);

  /* ── Spacing ──────────────────────────────────────────────── */
  --page-pad:     24px;   /* main content horizontal padding */
  --card-gap:     10px;   /* gap between project cards */
  --section-gap:  28px;   /* gap between priority sections */
  --sidebar-pad:  18px;   /* sidebar panel padding */

  /* ── Radii ───────────────────────────────────────────────── */
  --radius-sm:  6px;
  --radius-md: 10px;
  --radius-lg: 12px;
}
```

### Colour Semantics Quick Reference

| Colour | Hex | Used For |
|--------|-----|----------|
| `--brand-dark` | `#0D0D0D` | Header, Hero card, Chief of Staff panel |
| `--brand-red` | `#E8380D` | Logo `//`, CTA button, P1 section border |
| `--danger` | `#DC2626` | Blockers, Decision Desk, danger states |
| `--warning` | `#D97706` | P2 section border, stale indicators, amber accents |
| `--success` | `#16A34A` | Active status, online dots, done states |
| `--info` | `#2563EB` | P3 section border, review states, Gemini badge |
| `--bg` | `#F2F0EB` | Page background — warm cream, never stark white |

### AI Model Badge Colours

| Model | Background | Text | Border |
|-------|-----------|------|--------|
| Claude | `#F5F3FF` | `#7C3AED` | `#DDD6FE` |
| Gemini | `--info-bg` | `--info` | `--info-border` |
| Qwen | `#ECFDF5` | `#059669` | `#A7F3D0` |

---

## 4. Layout

### Page Structure

```
┌─────────────────────────────────────────────────────────────┐
│  HEADER (dark · sticky · 52px)                              │
├─────────────────────────────────────────────────────────────┤
│  SYNC BAR (dark · 28px · version + last sync timestamp)     │
├──────────────────────────────────┬──────────────────────────┤
│                                  │                          │
│  MAIN PANEL                      │  SIDEBAR                 │
│  (fluid · min 0 · padding 24px)  │  (fixed 300px)           │
│                                  │                          │
│  P1 – SHIP NOW                   │  1. Stat Grid            │
│  ├── Hero Card (full width)      │  2. Chief of Staff       │
│  └── 2-col grid                  │  3. Decision Desk        │
│                                  │  4. Active Agents        │
│  P2 – ACTIVE DEVELOPMENT         │  5. MACP Status          │
│  └── 3-col grid                  │  6. Activity Feed        │
│                                  │                          │
│  P3 – NEEDS REVIEW               │                          │
│  └── 3-col grid                  │                          │
│                                  │                          │
│  P4–5 – LOW / DONE               │                          │
│  └── 3-col grid                  │                          │
│                                  │                          │
└──────────────────────────────────┴──────────────────────────┘
```

### CSS Grid

```css
/* Top-level layout */
.layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  min-height: calc(100vh - 80px); /* 52px header + 28px sync bar */
}

.main-panel {
  padding: var(--page-pad);
  overflow-y: auto;
  background: var(--bg);
}

.sidebar {
  width: 300px;
  flex-shrink: 0;
  background: var(--surface);
  border-left: 1px solid var(--border);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--border2) transparent;
}
```

### Card Grids

```css
/* P1 — 2 column (after hero) */
.grid-2 { grid-template-columns: 1fr 1fr; }

/* P2, P3, P4 — 3 column */
.grid-3 { grid-template-columns: 1fr 1fr 1fr; }

/* Shared grid settings */
.project-grid {
  display: grid;
  gap: var(--card-gap);
}

/* Responsive breakpoints */
@media (max-width: 1100px) {
  .grid-3 { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 780px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { width: 100%; border-left: none; border-top: 1px solid var(--border); }
  .grid-2,
  .grid-3 { grid-template-columns: 1fr; }
}
```

---

## 5. Components

### 5.1 Header

```
┌─────────────────────────────────────────────────────────────┐
│ bg: #0D0D0D · height: 52px · sticky · z-index: 100         │
│                                                             │
│  NAMKA // MISSION CONTROL   ···   ● SYSTEM ONLINE  [+ New] │
│  Geist 800 · white                JBMono · green   red btn  │
└─────────────────────────────────────────────────────────────┘
```

- Logo: Geist 800, white, `letter-spacing: 0.01em`
- `//` slash: `var(--brand-red)` `#E8380D`
- SYSTEM ONLINE: JetBrains Mono, `#3DFF9A`, pulsing dot
- `+ New Project`: `var(--brand-red)` fill, white text, `border-radius: 7px`, hover lifts `1px` with red glow shadow

**Sync bar below header:**
- Background: `#181818`
- Text: JetBrains Mono 10px, `rgba(255,255,255,0.35)`
- Shows: `V2.0 · NAMKA · JHB_ZA` left | `Last GitHub sync: YYYY-MM-DD HH:MM` right

---

### 5.2 Priority Section Headers

```css
.priority-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 12px;
  border-bottom: 1.5px solid;     /* colour varies by tier */
}

/* Tier border colours */
.tier-1 { border-color: var(--danger);  }   /* red */
.tier-2 { border-color: var(--warning); }   /* amber */
.tier-3 { border-color: var(--info);    }   /* blue */
.tier-4 { border-color: var(--border2); }   /* gray */
```

- Title: Geist 800, `--text-lg`, all-caps, `letter-spacing: 0.08em`
- Right meta: JetBrains Mono, `--text-xs`, `--ink-dim` (project count or BLOCKERS_ACTIVE)

---

### 5.3 Hero Card (Priority 1 — top project)

```
bg: #0D0D0D · border-radius: 12px · full width
padding: 22px 24px · box-shadow: 0 4px 24px rgba(13,13,13,0.18)
```

- `● ACTIVE NOW · COMMITTED TODAY` — JetBrains Mono 9px, `#3DFF9A`, pulsing dot
- Project name: Geist 800, `--text-2xl`, white, `letter-spacing: -0.01em`
- Stack: JetBrains Mono 11px, `rgba(255,255,255,0.38)`
- Progress bar: `3px` height, `rgba(255,255,255,0.08)` track, gradient fill `#3DFF9A → #00D4FF`
- Next step: Geist 400, 13px, `rgba(255,255,255,0.55)`
- Top-right glow: `radial-gradient(rgba(232,56,13,0.15), transparent)` — brand red warmth

---

### 5.4 Project Card

```
bg: --surface · border: 1px solid --border · border-radius: --radius-md
padding: 15px 16px · box-shadow: --shadow-xs
cursor: pointer · height: 100% (fills grid row)
```

**Anatomy (top to bottom):**

```
┌─────────────────────────────────┐
│ 4.  Kora Tutor          Open → │  ← card-number (mono) + name (Geist 700) + hover hint
│ TypeScript / Next.js            │  ← stack (mono, --ink-dim)
│                                 │
│ Define AI tutor session flow +  │  ← next-step (Geist 400, --text-base, --ink-mid)
│ integrate LLM API + build UI    │
│                                 │
│ ⚠ Needs product spec from Ali  │  ← blocker strip (danger colours) — only if blocker
│                                 │
│ [EFFORT L] [CLAUDE]   ● Active │  ← badges + status label
└─────────────────────────────────┘
```

**Hover state:**
```css
.project-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--border2);
}
```

**Variants:**
| Variant | Border | Background |
|---------|--------|-----------|
| Default | `--border` | `--surface` |
| Has blocker | `--danger-border` | `#FFFCFC` |
| Stale | `--border` | `--surface` · `opacity: 0.68` · `filter: saturate(0.7)` |
| Done | `--success-border` | `#FAFFFE` |

---

### 5.5 Badge System

All badges: JetBrains Mono, `--text-xs`, `font-weight: 500`, `border-radius: --radius-sm`

#### Effort

| Badge | Background | Text | Border |
|-------|-----------|------|--------|
| S | `--success-bg` | `--success` | `--success-border` |
| M | `--info-bg` | `--info` | `--info-border` |
| L | `--warning-bg` | `--warning` | `--warning-border` |
| XL | `--danger-bg` | `--danger` | `--danger-border` |

#### Status

| Badge | Background | Text | Border |
|-------|-----------|------|--------|
| Active | `--success-bg` | `--success` | `--success-border` |
| Stale | `#F9FAFB` | `#6B7280` | `#E5E7EB` |
| Review | `--info-bg` | `--info` | `--info-border` |
| Done | `--success-bg` | `--success` | `--success-border` |

#### Status Label (bottom-right of card)

```css
.status-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
}

.status-dot {
  width: 6px; height: 6px;
  border-radius: 50%;
  background: currentColor;
}

/* Active dot pulses */
.status-label.active .status-dot {
  animation: pulse 2s ease-in-out infinite;
}
```

---

### 5.6 Blocker Strip (inside card)

```css
.card-blocker {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 7px 10px;
  background: var(--danger-bg);
  border: 1px solid var(--danger-border);
  border-radius: var(--radius-sm);
  font-family: var(--font-sans);
  font-size: 11.5px;
  color: var(--danger);
  line-height: 1.4;
  margin-bottom: 12px;
}
```

---

### 5.7 Sidebar Panels

All panels share:
```css
.sidebar-panel {
  padding: var(--sidebar-pad);
  border-bottom: 1px solid var(--border);
}

.panel-title {
  font-family: var(--font-display);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--ink-dim);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
```

#### Panel order (top → bottom)

| # | Panel | Notes |
|---|-------|-------|
| 1 | **Stat Grid** | 2-col mini cards, no title, flush to top |
| 2 | **Chief of Staff** | Dark bg (`#0D0D0D`), AI-generated daily brief |
| 3 | **Decision Desk** | Only renders if `blockedProjects.length > 0` |
| 4 | **Active Agents** | Claude / Qwen / Gemini / OpenRouter |
| 5 | **MACP Status** | Consensus progress track |
| 6 | **Activity Feed** | Timestamped log, always at bottom |

---

### 5.8 Stat Grid (Sidebar)

```css
.stat-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 16px 16px 0;
}

.stat-mini {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 12px;
}

.stat-mini-value {
  font-family: var(--font-display);
  font-size: var(--text-xl);
  font-weight: 800;
  line-height: 1;
  margin-bottom: 3px;
  letter-spacing: -0.02em;
}

.stat-mini-label {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 500;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--ink-dim);
}
```

**5 metrics displayed:**

| Metric | Colour | Logic |
|--------|--------|-------|
| Agents Idle | Green if 0, Red if >0 | agents where status = idle |
| Decisions | Red | projects where blocker is non-empty |
| P1 Open | Amber | projects where priority = 1 + active |
| Sprint % | Blue | avg progress across P1 projects |
| Stale | Gray if 0, Amber if >0 | last commit >60 days + status = Active |

---

### 5.9 Chief of Staff Panel

```
bg: #0D0D0D · full sidebar width · no border-radius
padding: var(--sidebar-pad)
```

- Title: Geist 800, `rgba(255,255,255,0.35)`, all-caps, `letter-spacing: 0.14em`
- Date tag: JetBrains Mono 9px, `#F5A623` (amber)
- Body text: Geist 400, 13px, `rgba(255,255,255,0.75)`, `line-height: 1.6`
- Section labels (URGENT ACTIONS / ACTIVE BLOCKERS): JetBrains Mono 9px, uppercase
  - Urgent: `#FF6B6B`
  - Blockers: `#FFA94D`
- List items: Geist 400, 12px, `rgba(255,255,255,0.6)`
- Blocker items: `#FFA94D`
- Send to Gmail button: ghost style — `rgba(255,255,255,0.06)` bg, `rgba(255,255,255,0.55)` text

---

### 5.10 Decision Desk (Sidebar)

Only renders when blockers exist. Stacked vertical cards.

```css
.dd-card {
  background: var(--danger-bg);
  border: 1px solid var(--danger-border);
  border-left: 3px solid var(--danger);
  border-radius: var(--radius-md);
  padding: 11px 13px;
}

.dd-card-project {
  /* JetBrains Mono · 9px · 600 · 0.10em spacing · uppercase · --danger */
}

.dd-card-text {
  /* Geist · 12px · 400 · --ink-mid */
}

.dd-card-resolve {
  /* Geist · 11px · 600 · --danger text · white bg */
  /* Hover: --danger bg · white text · translateY(-1px) */
}
```

---

### 5.11 Active Agent Cards

```css
.agent-item {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-avatar {
  width: 34px; height: 34px;
  border-radius: 8px;
  font-size: 16px;
}
```

**Agent state colours:**
| State | Colour |
|-------|--------|
| Processing | `--info` blue |
| Active | `--success` green |
| Standby | `#9CA3AF` gray |
| Idle | `#D1D5DB` light gray |

---

### 5.12 MACP Status Panel

Consensus progress track — 4 steps:

```
○ Unreviewed
● Agent Reviewed      ← filled green circle
● Cross-Checked       ← filled green circle
◉ Ratified           ← current step — amber pulse
```

Ratified state: green fill + lock icon. Current step pulses amber.

---

### 5.13 Project Drawer (Slide-out)

Opens from the right on card click. Overlays the sidebar.

```
width: 380px · bg: --surface · border-left: 1px solid --border
box-shadow: --shadow-lg · z-index: 200
```

**Sections top to bottom:**
1. `← Back` + `Open GitHub ↗` row
2. Project name (Geist 800, `--text-2xl`) + stack
3. Status / Effort / AI Model / Last Commit metadata row
4. **Next Step** — Geist 400, `--text-base`
5. **Blocker** (if exists) — danger strip + `Mark Resolved` button
6. **Direct Prompt** — textarea + `Send` button → Anthropic API
7. **Agent Log** — last 5 activity entries

---

## 6. Animations

```css
/* Pulsing online/active dot */
@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(22,163,74,0.4); }
  50%       { opacity: 0.8; box-shadow: 0 0 0 5px rgba(22,163,74,0); }
}

/* Hero card active dot — brighter green */
@keyframes pulse-green {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(61,255,154,0.5); }
  50%       { opacity: 0.8; box-shadow: 0 0 0 6px rgba(61,255,154,0); }
}

/* Logo border pulse */
@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 0 0 rgba(232,56,13,0.3); }
  50%       { box-shadow: 0 0 0 6px rgba(232,56,13,0); }
}

/* MACP current step */
@keyframes pulse-amber {
  0%, 100% { box-shadow: 0 0 0 0 rgba(217,119,6,0.4); }
  50%       { box-shadow: 0 0 0 5px rgba(217,119,6,0); }
}

/* Card hover lift */
.project-card {
  transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
}

/* Progress bar fill on mount */
.progress-fill {
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Button hover lift */
.btn-new,
.dd-card-resolve {
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
}
```

---

## 7. Dark Surfaces

Three UI zones use dark backgrounds intentionally:

| Zone | Background | Purpose |
|------|-----------|---------|
| Header | `#0D0D0D` | Anchors the top — always visible |
| Sync bar | `#181818` | Extension of header — slightly lighter |
| Hero card | `#0D0D0D` | Priority 1 hero project — stands apart from white cards |
| Chief of Staff panel | `#0D0D0D` | AI voice — distinct from data panels |

> **Rule:** No other surfaces use dark backgrounds. Dark is reserved for brand anchors
> and AI-generated content. Everything else is white or warm cream.

---

## 8. Do Not

- ❌ Use Inter, IBM Plex Mono, Syne, or any font other than Geist + JetBrains Mono
- ❌ Use stark white (`#FFFFFF`) as the page background — use `#F2F0EB`
- ❌ Add rounded corners larger than `--radius-lg` (12px)
- ❌ Use gradients anywhere except the hero card progress bar
- ❌ Use purple as a brand colour — purple is reserved for Claude AI model badge only
- ❌ Add a third column to the main content area
- ❌ Place the Decision Desk, stat grid, or any metrics in the main panel
- ❌ Use `font-weight: 900` — max is 800
- ❌ Set card heights explicitly — use CSS grid to align rows naturally
- ❌ Add Google Sheets, Apps Script, or Firestore dependencies

---

## 9. File Reference

| File | Purpose |
|------|---------|
| `app/layout.tsx` | Font loading (Geist + JetBrains Mono) |
| `globals.css` | All CSS variables, type scale, colour tokens, animations |
| `components/Sidebar.tsx` | Sidebar panel order and layout |
| `components/ProjectCard.tsx` | Card component + all variants |
| `components/HeroCard.tsx` | Full-width dark hero card |
| `components/DecisionDesk.tsx` | Blocker cards in sidebar |
| `components/ChiefOfStaff.tsx` | Dark AI brief panel |
| `components/StatGrid.tsx` | 2-col mini metric cards |
| `components/Badge.tsx` | All badge variants |
| `components/StatusLabel.tsx` | Pulsing dot + text status |
| `lib/parseMaster.ts` | GitHub Master.md → ProjectCard[] |
| `lib/chiefOfStaff.ts` | Anthropic API daily digest |
| `hooks/useMasterData.ts` | Fetch + 5min refresh + cache |

---

> *This document is the design contract for Namka Mission Control.*
> *All agents and contributors must read it before making UI changes.*
> *Updates require Ali's explicit approval and a version bump.*
