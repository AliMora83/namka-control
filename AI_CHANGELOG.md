# AI Changelog

This file is auto-maintained for AI context. Each entry reflects a versioned change to this repository.

## v1.0.22 — 2026-03-31
- Design update

\
## v1.0.22 — 2026-03-31\n- Design update\n
## v1.0.21 — 2026-03-30
- docs: clean AI_CHANGELOG — remove malformed duplicate entries, close Phase 2 sprint

\
## v1.0.21 — 2026-03-30\n- docs: clean AI_CHANGELOG — remove malformed duplicate entries, close Phase 2 sprint\n
## v1.0.20 — 2026-03-30
- docs: close Phase 2 — ratify error boundaries, add Session 6 review, scaffold Phase 3

## v1.0.19 — 2026-03-30
- docs: update Namka Control Dashboard — Phase 2 complete, Phase 3 next

## v1.0.18 — 2026-03-30
- feat: add error boundaries and API error handling to dashboard

## v1.0.17 — 2026-03-30
- Update AI_CHANGELOG.md

---

## v1.0.16 — 2026-03-30 — Sprint Close: Phase 2 Complete

**Session Agent:** Claude (UX/Product Owner)
**Session Type:** Ratification → Execution → Bug Fix → Sprint Close
**Covers:** Sessions 6–8 of the Namka Control build log

---

### What Happened This Sprint

#### 1. Phase 2 Docker Deployment — Ratified & Executed ✅

Claude reviewed `Docker.md v1.0.0` (authored by Comet) and issued a **GREEN LIGHT** ratification across all three focus areas:

- **CI/CD Safety:** `if: success()` guard confirmed correct. Dual-build pattern (runner + Docker) accepted as safe for Phase 2.
- **Caching (`/api/master`):** Deferred to Phase 3. No justification for SWR complexity before first production request.
- **Deployment downtime:** ~1–2 min outage per push accepted and documented. Zero-downtime rolling deploy flagged as Phase 3 item.

AG executed `AG-Update.md` (Phase 2 work order, 14 steps). All 13 checklist items returned ✅. `https://control.namka.cloud` went live with SSL, Docker, Nginx, and GitHub Actions CI/CD active.

---

#### 2. Post-Deploy Bug Fix — Projects Not Displaying 🔴 → ✅

**Bug 1 (Critical):** Dashboard showed `FOCUS PROJECTS (0) — No projects found in Master.md.`

Root cause: Comet's Session 5 optimisation moved all project data from `Master.md` into `Active-Projects.md`. The `/api/master` route was never updated to reflect this — it continued fetching `Master.md` only, where the project section now reads *"Project portfolio data has been moved to Active-Projects.md."* Parser returned empty array.

Fix: Add second GitHub API fetch for `Active-Projects.md`. Route project parsing to `projectsContent`, keep metadata parsing on `masterContent`.

**Bug 2 (Secondary):** Phase subtitle displayed "Phase 0 — Documentation."

Root cause: Parser grabbed the first phase heading in `Master.md` regardless of completion status.

Fix: Walk all phase headings, return first heading without `✅ COMPLETE`.

AG executed fix. Dashboard now shows 5 active projects, phase subtitle reads "Phase 2 — Deploy", version reads v1.0.16.

---

#### 3. Sprint Close Assessment

| Item | Status |
|---|---|
| Phase 2 deployment live | ✅ Complete |
| Projects displaying from `Active-Projects.md` | ✅ Complete |
| Phase subtitle correct | ✅ Complete |
| Security audit (`/api/master` response) | ✅ Closed (AG confirmed, no secrets exposed) |
| Error boundaries | ✅ Complete (AG commit `1d088a5`) |
| `Active-Projects.md` — Namka Control card updated | ✅ Complete (Comet) |

---

### Phase 3 Preview (next sprint)

- Caching: `stale-while-revalidate` for `/api/master` and `/api/projects`
- Zero-downtime deploy: rolling restart or `--wait` with Docker health check
- Gemini AI layer: activate `/api/ai` Route Handler for project summaries
- UI refinement: dashboard polish, loading skeletons, mobile layout review

---

## v1.0.16 — 2026-03-30
- fix: fetch Active-Projects.md for project data + fix phase display

## v1.0.15 — 2026-03-30
- fix: change host port to 3001 to avoid conflict with existing process

## v1.0.14 — 2026-03-30
- fix: expose port 3000 to localhost and update nginx proxy to 127.0.0.1

## v1.0.13 — 2026-03-30
- fix: force dynamic rendering to prevent build-time prerender failure

## v1.0.12 — 2026-03-30
- feat: add Phase 2 Docker deployment configuration

## v1.0.11 — 2026-03-30
- Update AI_CHANGELOG.md

## Session — 2026-03-30 (Claude Ratification)
Agent: Claude | Role: UX/Product Owner
Topic: Phase 2 Docker Deployment Ratification

- Reviewed Docker.md v1.0.0 (authored by Comet)
- Issued GREEN LIGHT on all three focus areas:
  - CI/CD safety: ✅ Approved (if: success() guard confirmed)
  - Caching: ✅ Deferred to Phase 3
  - Downtime: ✅ Accepted, documented in AG-Update.md
- Authored AG-Update.md (Phase 2 work order for AG, 14 steps)
- No amendments required to Docker.md spec

Next: AG executes AG-Update.md · Gemini verifies post-deploy

## v1.0.10 — 2026-03-30
- docs: add Docker.md — Phase 2 deployment spec for Claude ratification

## v1.0.9 — 2026-03-30
- Update Master.md

## v1.0.8 — 2026-03-30
- Update Master.md

## v1.0.7 — 2026-03-30
- Create Active-Projects.md

## v1.0.6 — 2026-03-30
- docs: ratify Session 4 and optimize Master.md for Phase 2

## v1.0.5 — 2026-03-29
- Update AI_CHANGELOG.md

---

## v1.0.4 — 2026-03-29
- style: reset dashboard UI to minimal Phase 1 foundation

## v1.0.3 — 2026-03-29
- fix(ci): grant write permissions to github actions workflow

## v1.0.2 — 2026-03-29
- chore: upgrade CI workflow with version bump and AI_CHANGELOG support

## v1.0.1 — 2026-03-29
- chore: bump to v1.0.1 — Master.md updated with versioning strategy and AI_CHANGELOG.md rationale

## v1.0.0 — 2026-03-29
- chore: initial Master.md, AGENT-ONBOARDING.md, and CI workflow committed
