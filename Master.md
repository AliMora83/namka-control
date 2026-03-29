# 🧐 🤖 Namka Control – Project Overview

>  Owner: Ali Mora | Location: Johannesburg, ZA

>  Last updated: 2026-03-29  |  Version: 1.0.4

---

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
- **Separation of concerns** — `Master.md` remains the architectural source of truth. `AI_CHANGELOG.md` handles the *history* of how it got there.
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

### Application Stack

- **Framework:** Next.js 15 (App Router).
- **Language:** TypeScript.
- **Styling:** Tailwind CSS.
- **UI Components:** shadcn/ui.
- **Data Source:** Master.md fetched via GitHub REST API (`/repos/{owner}/{repo}/contents/{path}`).
- **AI Layer:** Gemini API (Google AI Pro) — abstracted via `/api/ai` Route Handler.
- **State Management:** React Context / Hooks.

---

## 📋 Build Phases

### Phase 0 — Repo & Documentation ✅ COMPLETE

- [x] Create `namka-control` GitHub repository.
- [x] Add `Master.md` as ground-truth document.
- [x] Add `AGENT-ONBOARDING.md` with full Markdown formatting.
- [x] Add `.github/workflows/update-master-date.yml` — auto-updates `Last updated` date on every push.
- [x] Define MACP agent roles, Chain of Custody workflow, and conflict prevention rules.
- [x] Add auto version bump (PATCH) to GitHub Actions workflow.
- [x] Add `AI_CHANGELOG.md` — auto-maintained change log for AI agent context.

### Phase 1 — Foundation ✅ COMPLETE

- [x] Scaffold Next.js 15 app locally.
- [x] Connect to GitHub API, fetch Master.md.
- [x] Parse Master.md into typed JSON (Projects, Reviews, Priorities).
- [x] Display 5 focus project cards (filtered from full portfolio).
- [x] Create `.env.example` with `GITHUB_TOKEN` and `GEMINI_API_KEY` placeholders.

### Phase 2 — Deploy

- [ ] Write Dockerfile + docker-compose.yml for Next.js app.
- [ ] Configure Nginx reverse proxy for control.namka.cloud.
- [ ] Add A record in Hostinger DNS → VPS IP.
- [ ] Install SSL via Certbot.
- [ ] Set up GitHub Actions for auto-deploy on push to main.

---

## 📂 Active Projects

### 🔴 Priority 1 – Setup & Configuration

#### 1. Namka Control Dashboard

- **Repo:** [https://github.com/AliMora83/namka-control](https://github.com/AliMora83/namka-control)
- **Stack:** TypeScript / React / Next.js 15 / Tailwind / shadcn/ui
- **Status:** Active | Last commit: 2026-03-29
- **Next Step:** Hand off to Claude for UX ratification and AG-Update.md authoring. AG to scaffold Phase 1.
- **AI Model:** Claude (UX/Ratification) + Gemini (Architecture/UI) + Comet (Audit/Docs)

---

## 👥 AI Agent Assignments

| Agent | Core Function | Status |
|---|---|---|
| **Gemini** | Architect & UI Lead. Responsible for system design, Dashboard implementation, and Master.md initialization. | Available |
| **Claude** | UX & Product Owner. Responsible for final ratification, UX flow logic, and authoring AG-Update.md. | Active |
| **Antigravity (AG)** | The Implementer. Sole agent authorized to commit code. Executes instructions from AG-Update.md. | Available |
| **Comet** | Researcher & Auditor. Responsible for browser-based research, reasoning, and maintaining all `.md` documentation. | Active |

---

## 🔄 MACP Workflow (Chain of Custody)

1. **Objective Defined** — Ali sets the project goal.
2. **Concept & Brainstorm (Gemini)** — Gemini updates Master.md and README.md with proposed architecture.
3. **Audit (Comet)** — Comet researches dependencies and ratifies technical logic.
4. **UX Ratification (Claude)** — Claude ensures the plan meets Ali's needs and updates Master.md.
5. **Execution Trigger (Claude)** — Claude writes AG-Update.md (the strict work order).
6. **Implementation (Antigravity)** — AG reads AG-Update.md and commits the code.
7. **Verification (Gemini)** — Gemini updates the Dashboard UI and verification status.

---

## 📋 Review Log

### Session Review — 2026-03-29 (Evening) — Session 1
**Agent:** Gemini | **Status:** Completed | **Topic:** MACP Protocol Refinement

#### Analysis
Refined the agent coordination model to prevent conflicts and ensure high-velocity execution.
- Restricted code commit authority exclusively to Antigravity (AG).
- Designated Comet as the primary maintainer of Markdown documentation and browser-based research.
- Formulated the Chain of Custody workflow to ensure triple-checked logic before implementation.
- Initialized AGENT-ONBOARDING.md to codify these rules for all agents.

#### Recommendations
- Proceed with Claude or Comet to perform their specific Lens reviews of the Phase 1 architecture.
- Ensure all agents adhere strictly to the No-Commit rule except for AG.

---

### Session Review — 2026-03-29 (Evening) — Session 2
**Agent:** Comet | **Status:** Completed | **Topic:** Phase 1 Architecture Audit, Repo Housekeeping & CI Automation

#### Ratification
Gemini Session 1 review is **ratified**. Role delineation, Chain of Custody, and No-Commit rule are logically sound.

#### Work Completed This Session
- ✅ **`AGENT-ONBOARDING.md` created** — Full Markdown format with `##` headings, proper table, bulleted rules, task checklist, and session start routine. Replaces the old `AGENT-ONBOARDING` file (no extension) which contained HTML-escaped plain text.
- ✅ **Old `AGENT-ONBOARDING` file deleted** — Removed the no-extension duplicate to clean up repo root.
- ✅ **GitHub Action live** — `.github/workflows/update-master-date.yml` created and verified. Auto-updates `Last updated` date in `Master.md` on every push to `main`. Infinite-loop protection via `github.actor != 'github-actions[bot]'`. First run passed (11s, commit `61d364c`).
- ✅ **Phase 0 Build Phase added** to Master.md — Documents all completed repo/documentation work before Phase 1 code begins.

#### Resolved Flags (from Session 1 Audit)
- ✅ ~~`AGENT-ONBOARDING.md` missing~~ — Created and properly formatted.
- ✅ ~~`Last updated` date is static~~ — Now auto-updated by GitHub Actions.
- ⚠️ **`.env.example` still needed** — Added to Phase 1 checklist for AG to create when scaffolding.

#### Recommendations
- **Hand off to Claude** for UX ratification and AG-Update.md authoring. Phase 1 scaffold is unblocked.
- AG to create `.env.example` with `GITHUB_TOKEN` and `GEMINI_API_KEY` placeholders during Phase 1 scaffold.
- No further documentation blockers. MACP Chain of Custody is operational.

---

### Session Review — 2026-03-29 (Evening) — Session 3
**Agent:** Claude | **Status:** Completed | **Topic:** CI Versioning, AI_CHANGELOG.md Introduction & Master.md Ratification

#### Ratification
Comet Session 2 review is **ratified**. GitHub Actions workflow, Phase 0 documentation, and MACP Chain of Custody are all verified and operational.

#### Work Completed This Session
- ✅ **GitHub Actions workflow upgraded** — `.github/workflows/update-master-date.yml` now auto-bumps the PATCH version on every push to `main` in addition to updating the date. Hard failure guards added for missing `Version:` and `Last updated:` lines — no more silent failures.
- ✅ **`AI_CHANGELOG.md` introduced** — New auto-maintained file prepended with each push. Contains version, date, and commit message. Newest entries always appear first for fast AI context loading. Created by the workflow on first run if absent.
- ✅ **Versioning strategy defined** — PATCH auto via CI, MINOR/MAJOR manual by Ali. Documented in the new `📜 Versioning & Change Log` section of Master.md.
- ✅ **Master.md updated** — `AI_CHANGELOG.md` rationale documented, Phase 0 checklist updated, Related Resources updated, version bumped to `1.0.1`.

#### Recommendations
- **Hand off to AG** to commit the updated workflow file and `Master.md`. This will trigger the first versioned run of the new CI pipeline and auto-create `AI_CHANGELOG.md`.
- No blockers. Phase 1 scaffold is ready to begin.

---

### Session Review — 2026-03-29 — Session 4
**Agent:** Antigravity (AG) | **Status:** Completed | **Topic:** Phase 1 Foundation Scaffold & Premium UI

#### Work Completed This Session
- ✅ **Next.js 15 app scaffolded** — App Router, TypeScript, Tailwind, and shadcn/ui.
- ✅ **GitHub API route created** — Fetches Master.md with 60s ISR revalidation.
- ✅ **Master.md parser implemented** — Maps Markdown to typed Project JSON.
- ✅ **Premium Dashboard UI** — Implemented high-fidelity glassmorphic mission control theme.
- ✅ **ProjectCard & Navigation** — Built responsive, typography-first components.
- ✅ **Environment sanitized** — .env.example created, .env.local verified (locally).
- ✅ **Code Quality** — All TypeScript (tsc) and ESLint (lint) checks pass with exit code 0.

#### Recommendations
- **Hand off to Ali/Gemini** — Perform Phase 2 architecture planning (Docker/VPS).
- **Security Check** — Ensure no sensitive data leak in the /api/master response.
- **UI Refinement** — Add error boundaries to Dashboard for partial API failures.

---

## 🔗 Related Resources

- [Namka Mission Control](https://github.com/AliMora83/Namka-Mission-Control) - Parent repository.
- [namka-control repo](https://github.com/AliMora83/namka-control) - Dashboard repo.
- [README.md](./README.md) - Repository documentation.
- [AGENT-ONBOARDING.md](./AGENT-ONBOARDING.md) - Agent roles and protocols.
- [AI_CHANGELOG.md](./AI_CHANGELOG.md) - Auto-maintained version history for AI context.
- [update-master-date.yml](./.github/workflows/update-master-date.yml) - CI: auto-date and version workflow.

---

*This is a living document. AI agents update this file with reviews, status changes, and recommendations.*
