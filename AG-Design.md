# AG-Design.md — Design System Implementation

> **Issued by:** Claude (UX/Product Owner)
> **Date:** 2026-03-30
> **Project:** Namka Mission Control Dashboard
> **Repo:** https://github.com/AliMora83/namka-control
> **Source Spec:** `Design.md v1.0` — ratified by Ali Mora + Comet
> **Status:** ✅ GREEN LIGHT — Execute in sequence.

---

## ⚠️ Rules for AG

- `Design.md` is the **contract**. Do not deviate from it.
- Read every existing file before overwriting it.
- Only two fonts load in this app: **Geist** and **JetBrains Mono**. No others. No exceptions.
- Do not use `font-weight: 900`. Maximum is `800`.
- Do not use gradients except on the Hero Card progress bar.
- Do not use `#FFFFFF` as page background — use `#F2F0EB`.
- `--brand-red: #E8380D` is the only accent colour. Not orange. Not coral.
- Test at `http://localhost:3000` after each major step before continuing.
- Commit message must exactly match the one specified at the end.

---

## ⚠️ Design Shift Notice

The dark-theme mockup explored in session was a direction proposal only. The ratified spec in `Design.md` is a **warm cream light theme** (`#F2F0EB` page background) with selective dark surfaces (header, sync bar, hero card, Chief of Staff panel). The previous `NamkaControlDesign.jsx` exploration is superseded and should not be referenced.

---

## Step 1 — Verify Geist Font Availability

Geist is a Vercel font available via `next/font/google`. Before touching any files, verify it is accessible:

```bash
# Check if geist package is installed (alternative method)
cat package.json | grep geist
```

**If `geist` package exists** (e.g. `"geist": "^1.x.x"`): Use the package import method:
```tsx
import { GeistSans } from 'geist/font/sans'
```

**If not installed** (most likely): Use `next/font/google` as specified in `Design.md`. Proceed to Step 2.

---

## Step 2 — Update `app/layout.tsx`

Read the current file first. Replace the font imports and body className with the following pattern:

```tsx
import type { Metadata } from 'next'
import { Geist, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500'],
})

export const metadata: Metadata = {
  title: 'Namka Mission Control',
  description: 'Live operational dashboard — Namka',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${jetbrainsMono.variable}`}>
        {children}
      </body>
    </html>
  )
}
```

> Preserve any existing `metadata` values Ali has set. Merge, do not replace blindly.

---

## Step 3 — Replace `globals.css` (full rewrite)

This is a full replacement. Read the existing file first to note any custom rules that need to be preserved. Then replace with:

```css
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:root {
  /* ── Fonts ──────────────────────────────────────────────── */
  --font-sans:    var(--font-geist, 'Geist', ui-sans-serif, system-ui, sans-serif);
  --font-mono:    var(--font-jetbrains-mono, 'JetBrains Mono', monospace);
  --font-display: var(--font-sans);

  /* ── Type Scale ─────────────────────────────────────────── */
  --text-xs:   11px;
  --text-sm:   12px;
  --text-base: 13.5px;
  --text-md:   15px;
  --text-lg:   17px;
  --text-xl:   22px;
  --text-2xl:  26px;

  /* ── Backgrounds ───────────────────────────────────────── */
  --bg:       #F2F0EB;
  --surface:  #FFFFFF;
  --surface2: #F8F7F4;
  --surface3: #F0EEE9;

  /* ── Borders ────────────────────────────────────────────── */
  --border:  #E8E6E0;
  --border2: #D4D2CB;
  --border3: #C0BDB5;

  /* ── Text ───────────────────────────────────────────────── */
  --ink:             #0D0D0D;
  --ink-mid:         #4A4A47;
  --ink-dim:         #8E8C85;
  --ink-placeholder: #B5B3AC;

  /* ── Brand ──────────────────────────────────────────────── */
  --brand-red:  #E8380D;
  --brand-dark: #0D0D0D;

  /* ── Semantic ───────────────────────────────────────────── */
  --success:        #16A34A;
  --success-bg:     #F0FDF4;
  --success-border: #BBF7D0;

  --warning:        #D97706;
  --warning-bg:     #FFFBEB;
  --warning-border: #FDE68A;

  --danger:        #DC2626;
  --danger-bg:     #FEF2F2;
  --danger-border: #FECACA;

  --info:        #2563EB;
  --info-bg:     #EFF6FF;
  --info-border: #BFDBFE;

  /* ── Shadows ─────────────────────────────────────────────── */
  --shadow-xs: 0 1px 2px rgba(0,0,0,0.04);
  --shadow-sm: 0 1px 4px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04);
  --shadow-lg: 0 10px 30px rgba(0,0,0,0.10), 0 4px 8px rgba(0,0,0,0.06);

  /* ── Spacing ──────────────────────────────────────────────── */
  --page-pad:    24px;
  --card-gap:    10px;
  --section-gap: 28px;
  --sidebar-pad: 18px;

  /* ── Radii ───────────────────────────────────────────────── */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 12px;
}

html, body {
  height: 100%;
}

body {
  font-family: var(--font-sans);
  font-size: var(--text-base);
  color: var(--ink);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ── Font role assignments ───────────────────────────────── */
.font-display,
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

.font-mono,
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
.header-meta-chip,
.priority-meta,
.blockers-tag,
.online-badge,
.panel-badge {
  font-family: var(--font-mono);
}

/* ── Layout ──────────────────────────────────────────────── */
.layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  min-height: calc(100vh - 80px);
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

/* ── Project grids ───────────────────────────────────────── */
.project-grid {
  display: grid;
  gap: var(--card-gap);
}

.grid-2 { grid-template-columns: 1fr 1fr; }
.grid-3 { grid-template-columns: 1fr 1fr 1fr; }

/* ── Project card ────────────────────────────────────────── */
.project-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 15px 16px;
  box-shadow: var(--shadow-xs);
  cursor: pointer;
  height: 100%;
  transition: box-shadow 0.18s ease, transform 0.18s ease, border-color 0.18s ease;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.project-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--border2);
}

.project-card.has-blocker {
  border-color: var(--danger-border);
  background: #FFFCFC;
}

.project-card.stale {
  opacity: 0.68;
  filter: saturate(0.7);
}

.project-card.done {
  border-color: var(--success-border);
  background: #FAFFFE;
}

/* ── Priority section headers ────────────────────────────── */
.priority-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 10px;
  margin-bottom: 12px;
  border-bottom: 1.5px solid;
}

.tier-1 { border-color: var(--danger); }
.tier-2 { border-color: var(--warning); }
.tier-3 { border-color: var(--info); }
.tier-4 { border-color: var(--border2); }

.priority-title {
  font-family: var(--font-display);
  font-size: var(--text-lg);
  font-weight: 800;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.priority-meta {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--ink-dim);
}

/* ── Blocker strip ───────────────────────────────────────── */
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

/* ── Badge system ────────────────────────────────────────── */
.badge {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 500;
  border-radius: var(--radius-sm);
  padding: 2px 7px;
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  border: 1px solid transparent;
}

.badge-effort-s { background: var(--success-bg); color: var(--success); border-color: var(--success-border); }
.badge-effort-m { background: var(--info-bg);    color: var(--info);    border-color: var(--info-border);    }
.badge-effort-l { background: var(--warning-bg); color: var(--warning); border-color: var(--warning-border); }
.badge-effort-xl{ background: var(--danger-bg);  color: var(--danger);  border-color: var(--danger-border);  }

.badge-status-active { background: var(--success-bg); color: var(--success); border-color: var(--success-border); }
.badge-status-stale  { background: #F9FAFB; color: #6B7280; border-color: #E5E7EB; }
.badge-status-review { background: var(--info-bg);    color: var(--info);    border-color: var(--info-border);    }
.badge-status-done   { background: var(--success-bg); color: var(--success); border-color: var(--success-border); }

.badge-claude  { background: #F5F3FF; color: #7C3AED; border-color: #DDD6FE; }
.badge-gemini  { background: var(--info-bg);  color: var(--info);  border-color: var(--info-border); }
.badge-qwen    { background: #ECFDF5; color: #059669; border-color: #A7F3D0; }

/* ── Status label ────────────────────────────────────────── */
.status-label {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-family: var(--font-mono);
  font-size: 10px;
  font-weight: 500;
}

.status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
}

.status-label.active .status-dot {
  animation: pulse 2s ease-in-out infinite;
}

/* ── Sidebar panels ──────────────────────────────────────── */
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

/* ── Stat grid ───────────────────────────────────────────── */
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

/* ── Decision desk ───────────────────────────────────────── */
.dd-card {
  background: var(--danger-bg);
  border: 1px solid var(--danger-border);
  border-left: 3px solid var(--danger);
  border-radius: var(--radius-md);
  padding: 11px 13px;
  margin-bottom: 8px;
}

.dd-card-project {
  font-family: var(--font-mono);
  font-size: 9px;
  font-weight: 600;
  letter-spacing: 0.10em;
  text-transform: uppercase;
  color: var(--danger);
  margin-bottom: 4px;
}

.dd-card-text {
  font-family: var(--font-sans);
  font-size: 12px;
  color: var(--ink-mid);
  line-height: 1.45;
  margin-bottom: 8px;
}

.dd-card-resolve {
  font-family: var(--font-sans);
  font-size: 11px;
  font-weight: 600;
  color: var(--danger);
  background: var(--surface);
  border: 1px solid var(--danger-border);
  border-radius: var(--radius-sm);
  padding: 4px 10px;
  cursor: pointer;
  transition: background 0.15s, transform 0.1s;
}

.dd-card-resolve:hover {
  background: var(--danger);
  color: white;
  transform: translateY(-1px);
}

/* ── Active agent cards ──────────────────────────────────── */
.agent-item {
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.agent-avatar {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

/* ── Animations ──────────────────────────────────────────── */
@keyframes pulse {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(22,163,74,0.4); }
  50%       { opacity: 0.8; box-shadow: 0 0 0 5px rgba(22,163,74,0); }
}

@keyframes pulse-green {
  0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(61,255,154,0.5); }
  50%       { opacity: 0.8; box-shadow: 0 0 0 6px rgba(61,255,154,0); }
}

@keyframes pulse-border {
  0%, 100% { box-shadow: 0 0 0 0 rgba(232,56,13,0.3); }
  50%       { box-shadow: 0 0 0 6px rgba(232,56,13,0); }
}

@keyframes pulse-amber {
  0%, 100% { box-shadow: 0 0 0 0 rgba(217,119,6,0.4); }
  50%       { box-shadow: 0 0 0 5px rgba(217,119,6,0); }
}

.progress-fill {
  transition: width 1.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-new {
  transition: background 0.15s, transform 0.1s, box-shadow 0.15s;
}

/* ── Responsive ──────────────────────────────────────────── */
@media (max-width: 1100px) {
  .grid-3 { grid-template-columns: 1fr 1fr; }
}

@media (max-width: 780px) {
  .layout { grid-template-columns: 1fr; }
  .sidebar { width: 100%; border-left: none; border-top: 1px solid var(--border); }
  .grid-2, .grid-3 { grid-template-columns: 1fr; }
}
```

---

## Step 4 — Create `components/Header.tsx`

Create `src/components/Header.tsx`:

```tsx
'use client'

export function Header() {
  return (
    <>
      {/* Main header */}
      <header style={{
        background: '#0D0D0D',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span className="logo" style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            fontSize: 15,
            color: 'white',
            letterSpacing: '0.01em',
          }}>
            NAMKA
          </span>
          <span style={{ color: '#E8380D', fontWeight: 800, fontSize: 15, margin: '0 2px' }}>
            {' //'}
          </span>
          <span className="logo" style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            fontSize: 15,
            color: 'white',
            letterSpacing: '0.01em',
          }}>
            {' MISSION CONTROL'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#3DFF9A',
              display: 'inline-block',
              animation: 'pulse-green 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: '#3DFF9A',
              letterSpacing: '0.05em',
            }}>
              SYSTEM ONLINE
            </span>
          </div>
          <button className="btn-new" style={{
            background: '#E8380D',
            color: 'white',
            border: 'none',
            borderRadius: 7,
            padding: '6px 14px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 12,
            cursor: 'pointer',
          }}>
            + New Project
          </button>
        </div>
      </header>

      {/* Sync bar */}
      <div style={{
        background: '#181818',
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.06em',
        }}>
          V2.0 · NAMKA · JHB_ZA
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'rgba(255,255,255,0.35)',
        }}>
          Last GitHub sync: {new Date().toISOString().slice(0, 16).replace('T', ' ')}
        </span>
      </div>
    </>
  )
}
```

---

## Step 5 — Create `components/HeroCard.tsx`

Create `src/components/HeroCard.tsx`:

```tsx
import { Project } from '@/types/project'

interface HeroCardProps {
  project: Project
}

export function HeroCard({ project }: HeroCardProps) {
  return (
    <div style={{
      background: '#0D0D0D',
      borderRadius: 'var(--radius-lg)',
      padding: '22px 24px',
      boxShadow: '0 4px 24px rgba(13,13,13,0.18)',
      marginBottom: 'var(--card-gap)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Red warmth glow top-right */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: 200, height: 200,
        background: 'radial-gradient(circle at top right, rgba(232,56,13,0.15), transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Live badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#3DFF9A',
          display: 'inline-block',
          animation: 'pulse-green 2s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: '#3DFF9A',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          ACTIVE NOW · COMMITTED TODAY
        </span>
      </div>

      {/* Project name */}
      <h2 style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: 800,
        fontSize: 'var(--text-2xl)',
        color: 'white',
        letterSpacing: '-0.01em',
        marginBottom: 6,
      }}>
        {project.name}
      </h2>

      {/* Stack */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'rgba(255,255,255,0.38)',
        marginBottom: 16,
        lineHeight: 1.6,
      }}>
        {project.stack}
      </p>

      {/* Progress bar */}
      <div style={{
        height: 3,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 2,
        marginBottom: 16,
        overflow: 'hidden',
      }}>
        <div className="progress-fill" style={{
          height: '100%',
          width: `${project.progress ?? 0}%`,
          background: 'linear-gradient(90deg, #3DFF9A, #00D4FF)',
          borderRadius: 2,
        }} />
      </div>

      {/* Next step */}
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        color: 'rgba(255,255,255,0.55)',
        lineHeight: 1.55,
      }}>
        <span style={{ color: '#E8380D', fontWeight: 600, marginRight: 6 }}>Next:</span>
        {project.nextStep}
      </p>
    </div>
  )
}
```

---

## Step 6 — Create `components/ProjectCard.tsx`

Create `src/components/ProjectCard.tsx`:

```tsx
import { Project } from '@/types/project'
import { Badge } from './Badge'
import { StatusLabel } from './StatusLabel'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const cardClass = [
    'project-card',
    project.blocker ? 'has-blocker' : '',
    project.status === 'Stale' ? 'stale' : '',
    project.status === 'Done' ? 'done' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass}>
      {/* Card header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
          <span className="card-number" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--ink-dim)',
            flexShrink: 0,
          }}>
            {index}.
          </span>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: 'var(--text-md)',
            color: 'var(--ink)',
            lineHeight: 1.3,
          }}>
            {project.name}
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 11,
          color: 'var(--ink-placeholder)',
          flexShrink: 0,
          paddingLeft: 4,
        }}>
          Open →
        </span>
      </div>

      {/* Stack */}
      <p className="card-stack" style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--ink-dim)',
        lineHeight: 1.6,
        marginBottom: 10,
      }}>
        {project.stack}
      </p>

      {/* Blocker strip */}
      {project.blocker && (
        <div className="card-blocker">
          <span>⚠</span>
          <span>{project.blocker}</span>
        </div>
      )}

      {/* Next step */}
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--ink-mid)',
        lineHeight: 1.55,
        flexGrow: 1,
        marginBottom: 14,
      }}>
        {project.nextStep}
      </p>

      {/* Footer: badges + status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 'auto',
      }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {project.effort && <Badge type="effort" value={project.effort} />}
          {project.agents?.map(agent => (
            <Badge key={agent} type="agent" value={agent} />
          ))}
        </div>
        <StatusLabel status={project.status} />
      </div>
    </div>
  )
}
```

---

## Step 7 — Create `components/Badge.tsx`

Create `src/components/Badge.tsx`:

```tsx
interface BadgeProps {
  type: 'effort' | 'status' | 'agent'
  value: string
}

export function Badge({ type, value }: BadgeProps) {
  const classMap: Record<string, string> = {
    // Effort
    S: 'badge badge-effort-s',
    M: 'badge badge-effort-m',
    L: 'badge badge-effort-l',
    XL: 'badge badge-effort-xl',
    // Status
    Active: 'badge badge-status-active',
    Stale: 'badge badge-status-stale',
    Review: 'badge badge-status-review',
    Done: 'badge badge-status-done',
    // Agents
    Claude: 'badge badge-claude',
    Gemini: 'badge badge-gemini',
    Qwen: 'badge badge-qwen',
  }

  const className = classMap[value] ?? 'badge badge-status-stale'

  return <span className={className}>{value}</span>
}
```

---

## Step 8 — Create `components/StatusLabel.tsx`

Create `src/components/StatusLabel.tsx`:

```tsx
interface StatusLabelProps {
  status: string
}

const STATUS_COLORS: Record<string, string> = {
  Active:     '#16A34A',
  Processing: '#2563EB',
  Standby:    '#9CA3AF',
  Idle:       '#D1D5DB',
  Stale:      '#D97706',
  Done:       '#16A34A',
  Review:     '#2563EB',
}

export function StatusLabel({ status }: StatusLabelProps) {
  const color = STATUS_COLORS[status] ?? '#9CA3AF'
  const isActive = status === 'Active'

  return (
    <span className={`status-label ${isActive ? 'active' : ''}`} style={{ color }}>
      <span className="status-dot" />
      {status}
    </span>
  )
}
```

---

## Step 9 — Create `components/StatGrid.tsx`

Create `src/components/StatGrid.tsx`:

```tsx
import { Project } from '@/types/project'

interface StatGridProps {
  projects: Project[]
}

export function StatGrid({ projects }: StatGridProps) {
  const p1Open = projects.filter(p => p.priority === 1 && p.status === 'Active').length
  const decisions = projects.filter(p => p.blocker).length
  const avgProgress = projects.filter(p => p.priority === 1).length > 0
    ? Math.round(projects.filter(p => p.priority === 1).reduce((acc, p) => acc + (p.progress ?? 0), 0) / projects.filter(p => p.priority === 1).length)
    : 0

  const stats = [
    { value: 0,           label: 'AGENTS IDLE',  color: '#16A34A'  },
    { value: decisions,   label: 'DECISIONS',    color: decisions > 0 ? '#DC2626' : 'var(--ink)' },
    { value: p1Open,      label: 'P1 OPEN',      color: '#D97706'  },
    { value: `${avgProgress}%`, label: 'SPRINT',  color: '#2563EB'  },
  ]

  return (
    <div className="stat-grid" style={{ paddingBottom: 16 }}>
      {stats.map(s => (
        <div key={s.label} className="stat-mini">
          <div className="stat-mini-value" style={{ color: s.color }}>{s.value}</div>
          <div className="stat-mini-label">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
```

---

## Step 10 — Create `components/MACPStatus.tsx`

Create `src/components/MACPStatus.tsx`:

```tsx
const STEPS = [
  { label: 'Unreviewed',      state: 'done'    },
  { label: 'Agent Reviewed',  state: 'done'    },
  { label: 'Cross-Checked',   state: 'done'    },
  { label: 'Ratified',        state: 'current' },
]

export function MACPStatus() {
  return (
    <div className="sidebar-panel">
      <div className="panel-title">MACP Status</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {STEPS.map((step) => (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 10, height: 10,
              borderRadius: '50%',
              flexShrink: 0,
              display: 'inline-block',
              background: step.state === 'done' ? '#16A34A' : step.state === 'current' ? '#D97706' : 'var(--border2)',
              animation: step.state === 'current' ? 'pulse-amber 2s ease-in-out infinite' : 'none',
            }} />
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              color: step.state === 'pending' ? 'var(--ink-dim)' : 'var(--ink-mid)',
              fontWeight: step.state === 'current' ? 600 : 400,
            }}>
              {step.label}
            </span>
            {step.state === 'done' && (
              <span style={{ marginLeft: 'auto', fontSize: 10, color: '#16A34A' }}>✓</span>
            )}
            {step.state === 'current' && (
              <span style={{ marginLeft: 'auto', fontSize: 9, fontFamily: 'var(--font-mono)', color: '#D97706', letterSpacing: '0.06em' }}>NOW</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Step 11 — Update `app/page.tsx`

Read the current `page.tsx` in full before modifying. Replace the layout wrapper and integrate the new components. The goal is to wire the existing data-fetching logic into the new layout shell.

**Layout structure to implement:**

```tsx
import { Header } from '@/components/Header'
import { HeroCard } from '@/components/HeroCard'
import { ProjectCard } from '@/components/ProjectCard'
import { StatGrid } from '@/components/StatGrid'
import { MACPStatus } from '@/components/MACPStatus'

// ... keep existing data fetching logic ...

return (
  <>
    <Header />

    <div className="layout">
      {/* ── Main panel ── */}
      <main className="main-panel">

        {/* P1 — SHIP NOW */}
        <div style={{ marginBottom: 'var(--section-gap)' }}>
          <div className="priority-header tier-1">
            <span className="priority-title">P1 — Ship Now</span>
            <span className="priority-meta">{p1Projects.length} PROJECTS</span>
          </div>
          {p1Projects[0] && <HeroCard project={p1Projects[0]} />}
          <div className="project-grid grid-2">
            {p1Projects.slice(1).map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i + 2} />
            ))}
          </div>
        </div>

        {/* P2 — ACTIVE DEVELOPMENT */}
        <div style={{ marginBottom: 'var(--section-gap)' }}>
          <div className="priority-header tier-2">
            <span className="priority-title">P2 — Active Development</span>
            <span className="priority-meta">{p2Projects.length} PROJECTS</span>
          </div>
          <div className="project-grid grid-3">
            {p2Projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={p1Projects.length + i + 1} />
            ))}
          </div>
        </div>

        {/* P3 — MAINTENANCE / CLIENT */}
        {p3Projects.length > 0 && (
          <div style={{ marginBottom: 'var(--section-gap)' }}>
            <div className="priority-header tier-3">
              <span className="priority-title">P3 — Maintenance / Client</span>
              <span className="priority-meta">{p3Projects.length} PROJECTS</span>
            </div>
            <div className="project-grid grid-3">
              {p3Projects.map((p, i) => (
                <ProjectCard key={p.id} project={p} index={p1Projects.length + p2Projects.length + i + 1} />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* ── Sidebar ── */}
      <aside className="sidebar">
        <StatGrid projects={allProjects} />
        {/* Chief of Staff panel — Phase 3 */}
        {/* Decision Desk — renders only if blockers exist */}
        <MACPStatus />
        {/* Activity Feed — Phase 3 */}
      </aside>
    </div>
  </>
)
```

> Adapt variable names to match the existing data shape in the current `page.tsx`. Do not break the existing `Active-Projects.md` fetch logic.

---

## Step 12 — Verify `@/types/project.ts` Shape

Check if a `Project` type exists. If not, create `src/types/project.ts`:

```typescript
export interface Project {
  id: string | number
  name: string
  stack: string
  status: string
  priority: number
  nextStep: string
  agents?: string[]
  repo?: string
  liveUrl?: string
  blocker?: string
  effort?: string
  progress?: number
  lastUpdated?: string
}
```

> If a type already exists, merge these fields into it — do not create a duplicate.

---

## Step 13 — Local Test Checklist

Run `npm run dev` and verify:

- [ ] Fonts load correctly: Geist for body, JetBrains Mono for mono elements
- [ ] Page background is warm cream `#F2F0EB` — not white, not dark
- [ ] Header is dark `#0D0D0D`, 52px, sticky
- [ ] Sync bar is `#181818`, 28px, below header
- [ ] P1 hero card renders in dark `#0D0D0D` with red glow
- [ ] Project cards have white surface, correct hover lift
- [ ] Priority section borders: red (P1), amber (P2), blue (P3)
- [ ] Badges render with correct colours per type
- [ ] Status labels pulse on Active projects
- [ ] Sidebar stat grid shows 4 metric tiles
- [ ] Layout is 2-column: main + 300px sidebar
- [ ] No TypeScript errors (`npm run build` passes)
- [ ] No Inter, Syne, or system fonts in the browser Network tab

---

## Step 14 — Commit and Push

```bash
git add src/
git commit -m "feat: implement Design.md v1.0 — Geist + JetBrains Mono, warm cream theme, full component system"
git push origin main
```

---

## Commit Message (use exactly)

```
feat: implement Design.md v1.0 — Geist + JetBrains Mono, warm cream theme, full component system
```

---

*Work order authored by Claude (UX/Product Owner) | 2026-03-30*
*Source: Design.md v1.0 — ratified by Ali Mora + Comet*
*AG: read every existing file before overwriting. The data-fetching logic must be preserved exactly.*
