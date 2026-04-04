# 📋 Master-Update.md
> **Status:** 🟡 PENDING REVIEW — Gemini and Comet must ratify before merging into Master.md
> **Authored by:** Claude (UX & Product Owner)
> **Session:** 11 | **Date:** 2026-04-04
> **Based on:** Master.md v1.0.32 + Sessions 8, 9, 10 & 11 decisions

---

## Governance & Document Roles

Namka Control uses a four-layer governance model to keep planning, approval, execution, and logging clearly separated:

1. `Master-Update.md` — Planning & Review
   - Draft architecture, proposed phases/sprints, and open questions.
   - Owned by Ali and Claude, with Gemini and Comet as reviewers.
   - May contain alternatives, comments, and incomplete ideas.

2. `Master.md` — Approved Operating Truth
   - Contains only approved decisions and approved phase/sprint scope.
   - No unresolved alternatives or draft content.
   - Updated only when a phase/sprint is explicitly marked Approved by Gemini and Comet.

3. `AG-Update-*.md` — Execution Orders
   - Concrete work orders for AG, derived only from content already approved and present in `Master.md`.
   - Authored by Claude after approvals are recorded.

4. `AI-Logs.md` — Execution Evidence
   - Written by AG after execution.
   - Records what changed, what passed/failed acceptance, and any blockers to feed back into `Master-Update.md`.

### Promotion Rules

- All new work starts in `Master-Update.md` as a proposed phase or sprint.
- Gemini and Comet review and update `Master-Update.md` directly. Each phase/sprint must be explicitly marked as:
  - `APPROVED`, `REJECTED`, or `NEEDS-REVISION`.
- Only `APPROVED` phases/sprints are promoted into `Master.md`.
- AG must never execute work that is not:
  - Present in `Master.md`, and
  - Covered by a corresponding `AG-Update-*.md` work order.

MACP is treated as a governance and coordination layer. Supabase and `PROJECT-SYNC.json` are the runtime data sources for the Dashboard; `Master.md` and `Master-Update.md` govern how that runtime behavior is defined and evolved.

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
| 8 | Review Log | ➕ New entries | Sessions 8, 9, 10 and 11 added |

**Gemini — confirm the Supabase realtime subscription approach is compatible with the existing `/api/ai` Route Handler and Phase 4 Q&A panel architecture.**
**Comet — verify `next: 16.2.1` and `react: 19.2.4` against live `package.json`. Confirm `generate-project-sync.yml` can be extended with a Supabase upsert step. Check whether `SUPABASE_SERVICE_KEY` can be added as a secret across all 7 active project repos.**

---

# 🧐 🤖 Namka Control – Project Overview

> Owner: Ali Mora | Location: Johannesburg, ZA
> Last updated: 2026-04-04 | Version: 1.0.32

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
*Work order: `AG-Update.md` (Session 11) — ISSUED 2026-04-04*

> **Claude note (Session 11):** `PROJECT-SYNC.json` confirms Phase 3 has not yet started (`"progress_label": "Phase 2 complete — Phase 3 not started"`). Sprint 1 work order re-issued as a clean, current execution order. Previous Session 8 draft superseded by this version.

- [ ] Create `src/app/api/projects/route.ts` — aggregates `PROJECT-SYNC.json` from all 7 repos via `Promise.allSettled`.
- [ ] Create `src/types/project-sync.ts` — typed `ProjectSync` interface from live schema.
- [ ] Wire `/api/projects` to Dashboard card rendering.
- [ ] Add `revalidate = 300` — interim caching until Supabase realtime replaces polling in Sprint 2.
- [ ] Add scope comment to `/api/master` — governance-only.
- [ ] **Acceptance gate:** All 7 cards populate. Blocker badge visible on SmartPress. TypeScript build clean. ErrorCard renders on partial fetch failure.

#### Sprint 2 — Supabase Realtime + UX Fixes 📋 Planned
*Requires Sprint 1 acceptance gate + this Master-Update.md ratification.*

**⏳ AWAITING GEMINI + COMET VOTE before AG-Update.md can be issued.**

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
*Closes Phase 3. Requires Sprint 2 complete.*

**⏳ AWAITING GEMINI + COMET VOTE before AG-Update.md can be issued.**

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

### Session Review — 2026-04-04 — Session 11

**Agent:** Claude (UX & Product Owner) | **Status:** Completed | **Topic:** Phase 3 Sprint 1 Re-Issue · Docker.md Review · AG-Update.md Session 11 Authored

#### State Audit

`PROJECT-SYNC.json` was read this session. Key finding: `"progress_label": "Phase 2 complete — Phase 3 not started"` — confirming that despite the Session 8 AG-Update.md being authored, Phase 3 Sprint 1 was never executed on the VPS. Sprint 1 work order has been re-issued as `AG-Update.md` (Session 11) with a clean, up-to-date execution spec.

#### Docker.md Review (Comet's Ratification Request)

`Docker.md` (Phase 2 deployment specification, authored by Comet) was reviewed. **Phase 2 is already marked COMPLETE in `Master.md`**, so a formal GREEN LIGHT / HOLD verdict is moot for deployment. The spec is sound and consistent with what is live. Key observations recorded for the repo:

- Multi-stage Dockerfile (`deps → builder → runner`) is correct for Next.js standalone mode.
- `unless-stopped` restart policy is appropriate for the VPS production environment.
- `docker system prune -f` in the deploy script is correct practice to prevent disk buildup.
- Nginx proxying by container name (`namka-control:3000`) via `web_network` is the right pattern.
- `if: success()` guard on the GitHub Actions deploy step correctly prevents SSH deployment on a failed build.
- No `mem_limit` needed — VPS has 8 GB RAM, container uses ~200–300 MB.
- **Cached mode for `/api/master`** (stale-while-revalidate) is a Phase 3 concern, not a blocker for the live deployment. Confirmed Phase 3 is the correct home for this.
- **Downtime during `docker compose down`:** This is a real UX risk. Zero-downtime deploy (health check + rolling restart) is correctly scoped to Phase 3 Sprint 3. No action needed before Sprint 1, but AG must not attempt a deploy pattern change without an explicit Sprint 3 work order.

#### Work Completed This Session

- ✅ All project files read and cross-referenced.
- ✅ Master.md Phase 3 approved scope confirmed as the legal basis for Sprint 1.
- ✅ Sprint 1 AG-Update.md (Session 11) authored and issued.
- ✅ Docker.md reviewed — no blockers, Phase 2 confirmed complete.
- ✅ Master-Update.md v3 authored (this file) — Session 11 review added, Sprint 1 status updated, Sprint 2/3 gating clearly marked.

#### Recommendations

- **Gemini** — (1) Vote on Supabase realtime approach: confirm `/api/ai` Route Handler can query Supabase `projects` table directly for Phase 4. (2) Review Sprint 2 UX fix list — flag if any items conflict with the current Dashboard component architecture. (3) Confirm `@supabase/supabase-js` has no breaking incompatibilities with Next.js 16.x / React 19.
- **Comet** — (1) Verify `next: 16.2.1` and `react: 19.2.4` against live `package.json` in the repo. (2) Confirm `generate-project-sync.yml` structure is extensible with a Supabase upsert step. (3) Confirm `SUPABASE_SERVICE_KEY` can be added as a GitHub Actions secret across all 7 active repos without breaking existing workflows. (4) Vote on Sprint 2 and Sprint 3 scope.
- **AG** — Sprint 1 work order is live (`AG-Update.md` Session 11). Execute now. Do not start Sprint 2 until acceptance gate passes and Claude issues the Sprint 2 work order.
- **Ali** — While AG executes Sprint 1: (1) Create your Supabase project and `projects` table using the schema above. (2) Add `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_KEY` as secrets in all active repos and on the VPS. This unblocks Sprint 2 the moment Sprint 1 acceptance gate clears.

---

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
- ✅ Master-Update.md v2 authored.
- ✅ AG-Update.md Sprint 2 authored and ready.

---

### Session Review — 2026-04-02 — Session 9

**Agent:** Claude | **Status:** Completed | **Topic:** Live Dashboard Audit · Phase 3 Sprint 2/3 Definition · Phase 4/5/6 Roadmap

**Summary:** Dashboard audited at `control.namka.cloud`. Stack versions corrected (Next.js 16.2.1 / React 19.2.4). UX gaps logged: no progress bars, no per-card blocker badge, unconfirmed links, non-functional button. Phase 3 sprints and Phase 4/5/6 roadmap defined. Master-Update.md v1 authored (superseded by v2, now v3).

---

### Session Review — 2026-04-01 — Session 8

**Agent:** Claude | **Status:** Completed | **Topic:** Infrastructure Standardization Ratification & Phase 3 Sprint 1 Planning

**Summary:** AG's 4-File Schema standardization ratified. `AG-Update.md` Sprint 1 authored — `/api/projects` aggregation route consuming `PROJECT-SYNC.json` from all 7 repos. (Superseded by Session 11 re-issue — Phase 3 confirmed not started.)

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

## 🔁 Ratification Block — Master-Update.md v3

> **Gemini and Comet: your votes below unlock Sprint 2 and Sprint 3 AG-Update.md issuance.**
> Sprint 1 is already executing. Sprint 2 and Sprint 3 are frozen until both votes are recorded.

| Agent | Role | Vote | Notes |
|---|---|---|---|
| **Gemini** | Architect & UI Lead | ⏳ Open | (1) Confirm Supabase realtime + `/api/ai` Phase 4 compatibility. (2) Flag any Sprint 2 UX fix conflicts with current Dashboard component architecture. (3) Confirm `@supabase/supabase-js` compatibility with Next.js 16.x / React 19. |
| **Comet** | Researcher & Auditor | ⏳ Open | (1) Verify `next: 16.2.1` + `react: 19.2.4` against live `package.json`. (2) Confirm `generate-project-sync.yml` is extensible with Supabase upsert. (3) Confirm `SUPABASE_SERVICE_KEY` can be added across all 7 repos. (4) Vote on Sprint 2 + Sprint 3 scope. |

**Claude issues Verdict once both votes are in.**
- ✅ APPROVED → Comet merges into `Master.md` and commits.
- 🟡 CONDITIONAL → Amendments listed; Claude updates and re-issues.
- 🔴 BLOCKED → Blocker raised; merge frozen.
