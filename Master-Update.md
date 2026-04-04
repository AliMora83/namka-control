# 📋 Master-Update.md
> **Status:** 🟡 PENDING REVIEW — Gemini and Comet must ratify before merging into Master.md
> **Authored by:** Claude (UX & Product Owner)
> **Session:** 10 | **Date:** 2026-04-03
> **Based on:** Master.md v1.0.27 + Sessions 8, 9 & 10 decisions

---

## ⚠️ Change Summary for Reviewers

| # | Section | Change Type | Reason |
|---|---|---|---|
| 1 | Application Stack | ✏️ Update | Next.js corrected to 16.2.1 · React 19.2.4 · Supabase added as realtime aggregation layer |
| 2 | Infrastructure | ✏️ Update | Supabase added — realtime layer + project data aggregation database |
| 3 | Confirmed Architecture | ➕ New | Supabase table schema + full data flow diagram added |
| 4 | Phase 3 checklist | ✏️ Expand | Sprint 1/2/3 structure · Sprint 2 now includes Supabase realtime integration + UX fixes |
| 5 | Phase 4 | ✏️ Update | Gemini Q&A panel now queries Supabase directly (not 7 separate GitHub API calls) |
| 6 | Phase 5 | ✏️ Update | Inline quick-update uses Supabase write → GitHub Action back-sync |
| 7 | Phase 6 | ✏️ Update | Velocity tracking uses Supabase historical snapshots |
| 8 | Review Log | ➕ New entries | Sessions 8, 9, and 10 added |

**Gemini — confirm the Supabase realtime subscription approach is compatible with the existing `/api/ai` Route Handler and Phase 4 Q&A panel architecture.**
**Comet — verify `next: 16.2.1` and `react: 19.2.4` against live `package.json`. Confirm `generate-project-sync.yml` can be extended with a Supabase upsert step. Check whether `SUPABASE_SERVICE_KEY` can be added as a secret across all 7 active project repos.**

---

# 🧐 🤖 Namka Control – Project Overview

> Owner: Ali Mora | Location: Johannesburg, ZA
> Last updated: 2026-04-03 | Version: 1.0.28

## 🎯 Mission

Streamline project management through AI-assisted development — providing real-time visibility, multi-agent coordination, and a single source of truth for all active projects.

**Why Master.md exists:**

- Persistent memory across AI agent sessions — when a chat gets too long, agents reference this for full context.
- MACP (Multi-Agent Coordination Protocol) uses this as the ground truth to cross-check agent reviews and prevent hallucinations.
- The `Last updated` date and `Version` are auto-updated by GitHub Actions on every push to `main`.

---

## 📜 Versioning & Change Log

This project uses a three-part version number: `MAJOR.MINOR.PATCH`

| Part | Who changes it | When |
|---|---|---|
| **PATCH** | GitHub Actions (auto) | Every push to `main` |
| **MINOR** | Ali (manual) | Meaningful feature additions or workflow changes |
| **MAJOR** | Ali (manual) | Breaking changes to MACP protocol or architecture |

### AI_CHANGELOG.md — Purpose & Decision

`AI_CHANGELOG.md` is a dedicated, auto-maintained file that logs every versioned change to this repository. It was introduced in **v1.0.1** for the following reasons:

- **AI context without clutter** — Any agent starting a new session can read `AI_CHANGELOG.md` to understand recent changes without parsing the full `Master.md`.
- **Hallucination prevention** — Agents can verify that the version they are reading is the latest, and diff their understanding against the log.
- **Separation of concerns** — `Master.md` remains the architectural source of truth. `AI_CHANGELOG.md` handles the history of how it got there.
- **Scalability** — As the project grows, the review log inside `Master.md` would become unwieldy. `AI_CHANGELOG.md` offloads chronological history so `Master.md` stays focused.

**Format:** Each entry is prepended (newest first) and contains the version, date, and commit message. Generated automatically by `.github/workflows/update-master-date.yml`.

---

## 🏗 Confirmed Architecture

### Infrastructure

- **Server:** Hostinger VPS (namka.cloud) — already paid, always on, no cold starts.
- **Domain:** control.namka.cloud (subdomain A record → VPS IP).
- **Reverse Proxy:** Nginx (already installed on VPS).
- **Containerization:** Docker + Docker Compose (already installed on VPS).
- **SSL:** Certbot / Let's Encrypt (free, auto-renews).
- **CI/CD:** GitHub Actions (auto-deploy on push to main).
- **Realtime Database:** Supabase — project data aggregation + realtime push to Dashboard. *(added Session 10)*

### Application Stack

> ⚠️ **UPDATED — Sessions 9/10:** Framework versions corrected from live `package.json`. Supabase added as a permanent architecture component.

- **Framework:** Next.js 16.2.1 (App Router). *(was: Next.js 15)*
- **Runtime:** React 19.2.4.
- **Language:** TypeScript.
- **Styling:** Tailwind CSS v4.
- **UI Components:** shadcn/ui · `@base-ui/react`.
- **Governance Data:** `Master.md` via GitHub REST API → `/api/master`. Governance only (version, phase, review log). Never used for project card data.
- **Project Card Data (Sprint 1):** `PROJECT-SYNC.json` aggregated from all repos via `/api/projects`. Used for SSR + initial load. `revalidate = 300` interim caching.
- **Project Card Data (Sprint 2+):** Supabase `projects` table + realtime subscription. Live push updates replace polling. `/api/projects` retained as SSR/fallback only.
- **AI Layer:** Gemini API (Google AI Pro) — abstracted via `/api/ai` Route Handler.
- **State Management:** React Context / Hooks.

> **Agent Note (AGENTS.md):** This codebase runs Next.js 16.x — breaking changes from 15.x exist. Read `node_modules/next/dist/docs/` before writing any Next.js-specific code.

### Data Flow

```
[Any project repo — git push to main]
        │
        ▼
[generate-project-sync.yml]
        │
        ├──► Writes PROJECT-SYNC.json to repo      (per-repo, human + agent readable)
        │
        └──► Upserts row to Supabase projects table (Phase 3 Sprint 2+)
                          │
                          ▼
               [Supabase Realtime channel]
                          │
                          ▼
               [Dashboard — instant card update, zero polling]
```

**Fallback chain (Sprint 2+):** Supabase unavailable → `/api/projects` (GitHub Contents API, `revalidate=300`) → `ErrorCard`. No silent failures at any level.

### Supabase — `projects` Table Schema

> Defined Session 10. Maps directly to `PROJECT-SYNC.json` fields — no new manual data entry required. GitHub Action is the sole writer.

| Column | Type | Notes |
|---|---|---|
| `id` | `uuid` PK | Auto-generated |
| `slug` | `text` UNIQUE | Repo name e.g. `SmartPress`. Upsert key used by GitHub Action. |
| `name` | `text` | Human-readable project name |
| `status` | `text` | `Active` \| `In Progress` \| `Maintenance` \| `Complete` |
| `priority` | `int` | `1` \| `2` \| `3` |
| `phase` | `text` | e.g. `Phase 1 ✅ · Phase 2 🔄` |
| `progress` | `int` | `0`–`100` numeric percentage |
| `next_step` | `text` | Current next action |
| `blocker` | `text \| null` | `null` = no blocker. Non-null triggers red badge on Dashboard card. |
| `live_url` | `text \| null` | Deployed URL |
| `stack` | `text[]` | Tech tag array e.g. `["TypeScript", "Next.js", "Supabase"]` |
| `agents` | `text[]` | Assigned agent names e.g. `["Claude", "Antigravity"]` |
| `last_updated` | `timestamptz` | Set by GitHub Action on every upsert |
| `macp_version` | `text` | e.g. `2.0` |

**Security model:**
- Supabase anon key → Dashboard client (read-only via RLS policy)
- Supabase service role key → GitHub Actions secret `SUPABASE_SERVICE_KEY` (write access, server-side only, never in client bundle)

---

## 📋 Build Phases

### Phase 0 — Repo & Documentation ✅ COMPLETE

- [x] Create `namka-control` GitHub repository.
- [x] Add `Master.md` as ground-truth document.
- [x] Add `AGENT-ONBOARDING.md` with full Markdown formatting.
- [x] Add `.github/workflows/update-master-date.yml` — auto-updates `Last updated` date and version on every push.
- [x] Define MACP agent roles, Chain of Custody workflow, and conflict prevention rules.
- [x] Add `AI_CHANGELOG.md` — auto-maintained change log for AI agent context.

### Phase 1 — Foundation ✅ COMPLETE

- [x] Scaffold Next.js app locally.
- [x] Connect to GitHub API, fetch Master.md.
- [x] Parse Master.md into typed JSON.
- [x] Display project cards filtered from full portfolio.
- [x] Create `.env.example` with `GITHUB_TOKEN` and `GEMINI_API_KEY` placeholders.

### Phase 2 — Deploy ✅ COMPLETE

- [x] Write Dockerfile + docker-compose.yml.
- [x] Configure Nginx reverse proxy for control.namka.cloud.
- [x] Add A record in Hostinger DNS → VPS IP.
- [x] Install SSL via Certbot.
- [x] Set up GitHub Actions for auto-deploy on push to main.
- [x] Security Audit: No sensitive data leaked in `/api/master` response.
- [x] UI Refinement: Error boundaries added to Dashboard.

### Phase 3 — Resilience & Performance 🔄 IN PROGRESS

#### Sprint 1 — Data Layer 🔄 In Progress
*Work order: `AG-Update.md` (Session 8)*

- [ ] Create `src/app/api/projects/route.ts` — aggregates `PROJECT-SYNC.json` from all 7 repos via `Promise.allSettled`.
- [ ] Create `src/types/project-sync.ts` — typed `ProjectSync` interface from live schema.
- [ ] Wire `/api/projects` to Dashboard card rendering.
- [ ] Add `revalidate = 300` — interim caching until Supabase realtime replaces polling in Sprint 2.
- [ ] Add scope comment to `/api/master` — governance-only.
- [ ] **Acceptance gate:** All 8 cards populate. Ali/Gemini portfolio audit confirms MACP v2.0 status labels visible on all cards.

#### Sprint 2 — Supabase Realtime + UX Fixes 📋 Planned
*Work order: `AG-Update.md` (Session 10) — requires Sprint 1 acceptance gate first.*

**Supabase integration:**
- [ ] Ali to create Supabase project and `projects` table (schema above). Add secrets to VPS env + GitHub Actions.
- [ ] Extend `generate-project-sync.yml` in all 7 active repos — add upsert step after `PROJECT-SYNC.json` write.
- [ ] Add `@supabase/supabase-js` to `namka-control` dependencies.
- [ ] Replace `revalidate=300` polling with Supabase realtime subscription on Dashboard.
- [ ] Retain `/api/projects` as SSR initial load + Supabase-unavailable fallback.
- [ ] Add `SUPABASE_URL` and `SUPABASE_ANON_KEY` to `.env.example`.

**UX fixes (from Session 9 live audit):**
- [ ] Progress bar per card — `progress` column (Supabase) or `progress_label` (fallback).
- [ ] Blocker alert badge — red badge when `blocker` is not null.
- [ ] Last updated timestamp per card — human-readable relative time.
- [ ] Resolve "Open →" link behaviour — confirm correct destination per card.
- [ ] Document and relabel "48% SPRINT" stat calculation.
- [ ] Hide "+ New Project" button until Phase 5.

#### Sprint 3 — Resilience 📋 Planned
*Closes Phase 3.*

- [ ] Zero-downtime deploy — health check endpoint + rolling restart on VPS.
- [ ] Comprehensive error boundary coverage across all route segments.
- [ ] Performance audit and Lighthouse score baseline.
- [ ] Bundle size review — `@base-ui/react` + `shadcn-ui` coexistence impact.
- [ ] Supabase fallback validation — Dashboard renders correctly when Supabase unreachable.

---

### Phase 4 — Intelligence Layer 📋 Planned

*Prerequisite: Phase 3 complete.*

- [ ] **Gemini Q&A panel** — Natural language queries against Supabase `projects` table via `/api/ai`. One SQL query answers "What's blocking Kora Tutor?" — replaces fetching 7 separate `PROJECT-SYNC.json` files.
- [ ] **Daily digest** — Auto-summary of changes since yesterday. Requires a `project_snapshots` table (daily insert via scheduled GitHub Action or Supabase Edge Function).
- [ ] **Sprint velocity tracking** — Week-over-week `progress` delta per project from `project_snapshots`. Rendered as trend indicator on each card (▲ / ▼ / —).

---

### Phase 5 — Interactivity 📋 Backlog

*Prerequisite: Phase 4 Sprint 1 complete.*

- [ ] **Card detail drawer** — Click project card → slide-in panel with all Supabase `projects` columns in full.
- [ ] **Filter & sort controls** — Filter by `agents`, `stack`, `status`. Sort by `priority` or `last_updated`. Queries run against Supabase. URL-persistent state.
- [ ] **Inline quick-update** — Edit `status`, `next_step`, `blocker` from Dashboard. Writes to Supabase via server-side API route (service role only — anon key never writes). GitHub Action back-syncs to `PROJECT-SYNC.json` on next push. **Requires Ali security sign-off before AG implements.**

---

### Phase 6 — Cross-project Intelligence 📋 Future

*No AG-Update.md until Phase 5 is shipped.*

- [ ] **Dependency graph** — Inter-project dependency map. Requires `dependencies` column in Supabase schema and `PROJECT-SYNC.json`.
- [ ] **Timeline / Gantt view** — All projects on a horizontal timeline from Supabase data.
- [ ] **Blocker notifications** — Supabase webhook on `blocker` column change. Delivery channel TBD.
- [ ] **Velocity history chart** — Sparkline per card from `project_snapshots` history.

---

## 📂 Active Projects

Project portfolio data is maintained in `Active-Projects.md` by Comet.

- `Master.md` → governance, MACP workflow, build phases, review log.
- `Active-Projects.md` → human-readable project register. Not used at runtime.
- `PROJECT-SYNC.json` (per repo) → machine-readable, consumed by GitHub Action → Supabase upsert.
- Supabase `projects` table → runtime data source for Dashboard cards (Sprint 2+).

---

## 👥 AI Agent Assignments

| Agent | Core Function | Status |
|---|---|---|
| **Gemini** | Architect & UI Lead. System design, Dashboard implementation, Master.md initialization. | Available |
| **Claude** | UX & Product Owner. Final ratification, UX flow logic, AG-Update.md authorship. | Active |
| **Antigravity (AG)** | Implementer only. Executes AG-Update.md exactly. No Ratify vote. | Available |
| **Comet** | Researcher & Auditor. Browser research, reasoning, all `.md` documentation. | Active |

---

## 🔄 MACP Workflow (Chain of Custody)

- 0. **Context Sync** — Agent reads `AI_CHANGELOG.md` to load recent context.
- i. **Objective Defined** — Ali sets the project goal.
- ii. **Concept & Brainstorm (Gemini)** — Gemini updates Master.md and README.md with proposed architecture.
- iii. **Audit (Comet)** — Comet researches dependencies and ratifies technical logic.
- iv. **UX Ratification (Claude)** — Claude ensures the plan meets Ali's needs and issues Verdict.
- v. **Execution Trigger (Claude)** — Claude writes AG-Update.md (the strict work order).
- vi. **Implementation (Antigravity)** — AG reads AG-Update.md and commits the code.
- vii. **Verification (Gemini)** — Gemini updates Dashboard UI and verification status.

---

## 📋 Review Log

### Session Review — 2026-04-03 — Session 10

**Agent:** Claude (UX & Product Owner) | **Status:** Completed | **Topic:** Architecture Pivot Review · Supabase Decision · Master-Update.md v2 · AG-Update Sprint 2

#### Architecture Decision — Supabase Retained, Horizons Rejected

A third-party recommendation to migrate to Hostinger Horizons + Supabase was reviewed. **Horizons was rejected** — inappropriate for a realtime data dashboard with MACP coordination requirements; would have reverted the infrastructure independence gained in Phase 2. **VPS + Docker confirmed as the permanent deployment model.**

**Supabase was accepted** with a defined role: realtime aggregation layer in front of `PROJECT-SYNC.json`, not a replacement for it. GitHub Action writes `PROJECT-SYNC.json` per repo **and** upserts to Supabase. Dashboard subscribes to Supabase realtime. `/api/projects` retained as SSR/fallback.

#### Work Completed This Session

- ✅ Horizons rejected. Supabase accepted with defined scope.
- ✅ Supabase `projects` table schema defined (14 columns, maps 1:1 to `PROJECT-SYNC.json`).
- ✅ Data flow architecture confirmed: GitHub Action → `PROJECT-SYNC.json` + Supabase upsert → Supabase realtime → Dashboard.
- ✅ Security model defined: anon key for reads, service role for writes (server-side only).
- ✅ Phase 3 Sprint 2 redefined: Supabase realtime + UX fixes from Session 9 audit.
- ✅ Phase 4/5/6 updated with Supabase-native capabilities.
- ✅ Master-Update.md v2 authored (this file).
- ✅ AG-Update.md Sprint 2 authored and ready.

#### Recommendations

- **Gemini** — Review Supabase realtime approach. Confirm `/api/ai` Route Handler can query Supabase `projects` table directly for Phase 4 Q&A panel. Flag if architectural changes are needed before Sprint 2.
- **Comet** — (1) Verify stack versions against live `package.json`. (2) Confirm `SUPABASE_SERVICE_KEY` can be added as a GitHub Actions secret across all 7 project repos. (3) Update `Active-Projects.md`: Namka Control next step → "Phase 3 Sprint 1 executing · Sprint 2 (Supabase realtime + UX) planned".
- **AG** — Sprint 1 work order (`AG-Update.md` Session 8) still active. Do not start Sprint 2 until Sprint 1 acceptance gate passes and Sprint 2 `AG-Update.md` is issued.
- **Ali** — After ratification: (1) Create Supabase project + `projects` table. (2) Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY` as secrets across all active repos and VPS env. (3) Issue Sprint 2 `AG-Update.md` to AG after Sprint 1 acceptance gate.

---

### Session Review — 2026-04-02 — Session 9

**Agent:** Claude | **Status:** Completed | **Topic:** Live Dashboard Audit · Phase 3 Sprint 2/3 Definition · Phase 4/5/6 Roadmap

**Summary:** Dashboard audited at `control.namka.cloud`. Stack versions corrected (Next.js 16.2.1 / React 19.2.4). UX gaps logged: no progress bars, no per-card blocker badge, unconfirmed links, non-functional button. Phase 3 sprints and Phase 4/5/6 roadmap defined. Master-Update.md v1 authored (superseded by v2 above).

---

### Session Review — 2026-04-01 — Session 8

**Agent:** Claude | **Status:** Completed | **Topic:** Infrastructure Standardization Ratification & Phase 3 Sprint 1 Planning

**Summary:** AG's 4-File Schema standardization ratified. `AG-Update.md` Sprint 1 authored — `/api/projects` aggregation route consuming `PROJECT-SYNC.json` from all 7 repos.

---

### Session Review — 2026-04-01 — Session 7

**Agent:** Comet | **Status:** Completed | **Topic:** SmartPress Audit

**Summary:** Claude's SmartPress Sprint 1 sign-off ratified. Phase 1 NOT closed — Blocking Runtime Issue open pending AG's 4 checks and smoke test. Comet to close Phase 1 once smoke test passes.

---

### Session Review — 2026-03-30 (Evening) — Session 6

**Agent:** Comet | **Status:** Completed | **Topic:** Phase 2 Closure

**Summary:** Phase 2 fully ratified. Commit `1d088a5` live, `200 OK`. All 7 checklist items complete. Phase 3 scaffolded.

---

### Session Review — 2026-03-30 (Morning) — Session 5

**Agent:** Comet | **Status:** Completed | **Topic:** Session 4 Ratification & Master.md Optimization

**Summary:** Session 4 (AG) ratified. Next.js foundation, GitHub API integration, and glassmorphic UI verified.

---

*This is a living document. AI agents update this file with reviews, status changes, and recommendations.*

---

## 🔁 Ratification Block — Master-Update.md v2

| Agent | Role | Vote | Notes |
|---|---|---|---|
| **Gemini** | Architect & UI Lead | ⏳ Open | Confirm Supabase realtime approach + `/api/ai` Phase 4 compatibility |
| **Comet** | Researcher & Auditor | ⏳ Open | Verify stack versions · Confirm `SUPABASE_SERVICE_KEY` across all 7 repos · Update Active-Projects.md |

**Claude issues Verdict once both votes are in.**
- ✅ APPROVED → Comet merges into `Master.md` and commits.
- 🟡 CONDITIONAL → Amendments listed; Claude updates and re-issues.
- 🔴 BLOCKED → Blocker raised; merge frozen.
