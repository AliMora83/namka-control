# AG-Update.md — Phase 3 Sprint 2
**Issued by:** Claude (UX & Product Owner)
**Date:** 2026-04-03
**Session:** 10
**Status:** 📋 READY — Do not execute until Sprint 1 acceptance gate passes

---
> Governance note: This Sprint 2 work order is derived from the Phase 3 scope currently approved in `Master.md`. If `Master-Update.md` and `Master.md` ever disagree, AG must follow `Master.md` and flag the mismatch to Ali and Claude.

---

## ⚠️ Pre-conditions — All must be confirmed before starting

- [ ] **Sprint 1 acceptance gate passed** — All 8 cards populate from `/api/projects`. Ali/Gemini portfolio audit complete.
- [ ] **Ali has created the Supabase project** and the `projects` table using the schema in `Master.md`.
- [ ] **Secrets are available** in GitHub Actions for `namka-control` repo:
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_KEY`
- [ ] **Secrets are available** in the VPS environment (`/etc/environment` or shell exports):
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
- [ ] **`SUPABASE_SERVICE_KEY` is available** as a GitHub Actions secret in all 7 active project repos (for the `generate-project-sync.yml` upsert step — see Task 2 below).

If any pre-condition is unmet, **stop and flag to Ali**. Do not begin.

---

## 🎯 Objective

Two parallel tracks delivered in this sprint:

1. **Supabase realtime integration** — Replace `revalidate=300` polling with a Supabase realtime subscription. Dashboard updates the instant any project repo pushes to `main`. `/api/projects` retained as SSR/fallback.

2. **UX fixes** — Surface data that already exists but isn't being shown: progress bars, blocker badges, last-updated timestamps. Fix or hide non-functional UI elements identified in the Session 9 audit.

---

## 📁 Tasks — Execute in exact order

---

### Task 1 — Install Supabase client

In the `namka-control` repo:

```bash
npm install @supabase/supabase-js
```

---

### Task 2 — Extend `generate-project-sync.yml` across all 7 repos

This task must be applied to the `.github/workflows/generate-project-sync.yml` file in each of the following repos:

- `AliMora83/namka-control`
- `AliMora83/Odoo-POS-Terminal`
- `AliMora83/SmartPress`
- `AliMora83/Atlas-Website`
- `AliMora83/Kora-Tutor`
- `AliMora83/EventSaas`
- `AliMora83/Odoo-BA-API`

**Add a new step at the end of the workflow** (after the `PROJECT-SYNC.json` write step):

```yaml
- name: Upsert to Supabase projects table
  env:
    SUPABASE_URL: ${{ secrets.SUPABASE_URL }}
    SUPABASE_SERVICE_KEY: ${{ secrets.SUPABASE_SERVICE_KEY }}
  run: |
    # Read the PROJECT-SYNC.json that was just written
    PROJECT_JSON=$(cat PROJECT-SYNC.json)

    # POST to Supabase REST API with upsert (on conflict on slug, update all fields)
    curl -s -o /dev/null -w "%{http_code}" \
      -X POST "${SUPABASE_URL}/rest/v1/projects" \
      -H "apikey: ${SUPABASE_SERVICE_KEY}" \
      -H "Authorization: Bearer ${SUPABASE_SERVICE_KEY}" \
      -H "Content-Type: application/json" \
      -H "Prefer: resolution=merge-duplicates" \
      --data "$PROJECT_JSON"
```

> **Note for AG:** The `Prefer: resolution=merge-duplicates` header is what makes this an upsert — it matches on the `slug` unique column and updates the row if it exists. The `PROJECT-SYNC.json` field names must exactly match the Supabase column names. Verify the schema against the table in the Supabase dashboard before running. If there is a field name mismatch, flag to Ali before committing — do not silently transform field names.

**Commit message per repo:** `chore: add Supabase upsert step to generate-project-sync workflow`

---

### Task 3 — Create Supabase client utility

Create `src/lib/supabase.ts` in `namka-control`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

> **Note for AG:** Use `NEXT_PUBLIC_` prefix — these values are needed in the browser for the realtime subscription. Anon key is safe to expose client-side as it is read-only (enforced by Supabase RLS). The service role key must **never** appear in this file or any client-side code.

---

### Task 4 — Add env vars to `.env.example`

Add to `.env.example`:

```
# Supabase (read-only — safe for client-side)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

### Task 5 — Update `docker-compose.yml`

Add the two new env vars to the `namka-control` service environment block:

```yaml
environment:
  - GITHUB_TOKEN=${GITHUB_TOKEN}
  - GEMINI_API_KEY=${GEMINI_API_KEY}
  - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
  - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
  - NEXT_TELEMETRY_DISABLED=1
  - NODE_ENV=production
```

---

### Task 6 — Create `src/types/supabase.ts`

Type the Supabase `projects` row to match the confirmed table schema exactly:

```typescript
export interface SupabaseProject {
  id: string
  slug: string
  name: string
  status: string
  priority: 1 | 2 | 3
  phase: string
  progress: number
  next_step: string
  blocker: string | null
  live_url: string | null
  stack: string[]
  agents: string[]
  last_updated: string
  macp_version: string
}
```

> **Note for AG:** Verify every field name and type against the live Supabase table columns before writing this file. If the table has columns that don't match, flag to Ali — do not silently adjust.

---

### Task 7 — Add Supabase realtime subscription to Dashboard

Modify the Dashboard component (or create a `src/hooks/useProjects.ts` hook — whichever is cleaner given the current component structure) to:

1. Fetch the initial project list from `/api/projects` (existing SSR route — unchanged)
2. Open a Supabase realtime channel on mount:
   ```typescript
   const channel = supabase
     .channel('projects-realtime')
     .on(
       'postgres_changes',
       { event: '*', schema: 'public', table: 'projects' },
       (payload) => {
         // On INSERT or UPDATE: update the matching card in local state
         // On DELETE: remove the card from local state
         // Use payload.eventType to distinguish
       }
     )
     .subscribe()
   ```
3. Clean up the channel on unmount: `supabase.removeChannel(channel)`
4. If Supabase subscription fails (channel status `CHANNEL_ERROR`), log the error and continue serving data from the `/api/projects` SSR response — do not throw or blank the Dashboard.

**Data precedence:** Supabase realtime updates take priority over the initial SSR response. If a project card arrives via realtime that wasn't in the SSR response, add it. If a card present in SSR is deleted via realtime, remove it.

---

### Task 8 — UX fixes

Apply all of the following to the project card component:

**8a — Progress bar**

Each card must render a progress bar. Source: `progress` field from Supabase (integer 0–100). Fallback: parse `progress_label` string from `ProjectSync` type (e.g. `"30%"` → `30`).

Visual spec:
- Full-width bar within the card footer area
- Background: muted gray track
- Fill: green for ≥ 70, amber for 40–69, red for < 40
- Percentage label to the right of the bar (e.g. `30%`)
- Height: 4px. Rounded ends.

**8b — Blocker badge**

When `blocker` is not null:
- Render a red badge on the card — e.g. `⚠ BLOCKED` — positioned in the card header, right-aligned next to the project name.
- The global stats bar "0 BLOCKERS" count must reflect the actual count of non-null `blocker` values across all loaded cards.

**8c — Last updated timestamp**

Render `last_updated` as a human-readable relative string below the stack tags. e.g. `Updated 2 days ago`. Use a simple utility function — do not install a new date library. A manual implementation is sufficient:

```typescript
function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Updated today'
  if (days === 1) return 'Updated yesterday'
  return `Updated ${days} days ago`
}
```

**8d — "Open →" links**

Audit each card's "Open →" link. It must navigate to the project's `live_url` if set and not null. If `live_url` is null, navigate to the GitHub repo URL (construct from `slug`: `https://github.com/AliMora83/{slug}`). Links must open in a new tab (`target="_blank"`, `rel="noopener noreferrer"`).

**8e — "+ New Project" button**

Remove the "+ New Project" button from the header. It is non-functional and has no planned implementation until Phase 5. Do not replace it with a placeholder — simply remove it. If it was part of a header layout, ensure removing it does not break the header alignment.

**8f — "48% SPRINT" stat**

Update the label from `"48% SPRINT"` to `"AVG PROGRESS"`. Update the calculation to: average of all `progress` values across loaded projects, rounded to the nearest integer. This must update reactively when Supabase realtime delivers updates.

---

### Task 9 — Verify `next.config.ts`

Confirm `output: 'standalone'` is still present. If removed at any point, restore it:

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
};

export default nextConfig;
```

---

## ✅ Acceptance Criteria

AG confirms all of the following before Sprint 2 is considered complete:

- [ ] `@supabase/supabase-js` installed and in `package.json`
- [ ] `generate-project-sync.yml` upsert step deployed in all 7 repos — verified by pushing to a test repo and confirming the Supabase row updates
- [ ] Supabase realtime subscription active on Dashboard — verified by manually updating a row in Supabase and confirming the Dashboard card updates without a page reload
- [ ] `/api/projects` fallback still works — verified by temporarily setting an invalid `NEXT_PUBLIC_SUPABASE_URL` and confirming Dashboard renders from SSR data
- [ ] Progress bar visible on all 8 project cards with correct colour coding
- [ ] Blocker badge visible on any card where `blocker` is not null (create a test row if needed)
- [ ] Last updated timestamp visible on all cards in human-readable format
- [ ] "Open →" links verified — navigate to correct destination in new tab
- [ ] "+ New Project" button removed from header
- [ ] "AVG PROGRESS" stat calculates correctly and updates reactively
- [ ] `docker-compose.yml` includes new Supabase env vars
- [ ] `.env.example` includes `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] VPS env vars updated and container restarted — `https://control.namka.cloud` loads correctly
- [ ] No `SUPABASE_SERVICE_KEY` appears anywhere in the client-side bundle (check Network tab — it must never reach the browser)

---

## 🚫 Out of Scope for This Sprint

- Do not implement card detail drawer (Phase 5)
- Do not implement filter/sort controls (Phase 5)
- Do not implement inline quick-update (Phase 5)
- Do not implement Gemini Q&A panel (Phase 4)
- Do not modify Nginx config or Dockerfile
- Do not change card visual design beyond the specific UX fixes above

---

## 📋 Execution Order

1. Confirm all pre-conditions with Ali
2. `npm install @supabase/supabase-js`
3. Create `src/lib/supabase.ts`
4. Create `src/types/supabase.ts` (verify against live Supabase table first)
5. Update `.env.example`
6. Update `docker-compose.yml`
7. Add Supabase realtime subscription to Dashboard (Task 7)
8. Apply all UX fixes (Task 8a–8f)
9. Confirm `next.config.ts` (Task 9)
10. Extend `generate-project-sync.yml` in all 7 repos (Task 2)
11. Commit `namka-control` with message: `feat: Supabase realtime + UX fixes (Phase 3 Sprint 2)`
12. Confirm GitHub Actions auto-deploy triggers and completes
13. Update VPS env vars, restart container
14. Run full acceptance criteria checklist
15. Report results to Ali

---

*Work order authored by Claude (UX & Product Owner) — Session 10.*
*Next action: Sprint 1 acceptance gate → Ali creates Supabase project + adds secrets → AG executes this order.*
