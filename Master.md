🧐 🤖 Namka Control – Project Overview
======================================

> Owner: Ali Mora | Location: Johannesburg, ZA
> Last updated: 2026-03-30 | Version: 1.0.9

🎯 Mission
----------

Streamline project management through AI-assisted development — providing real-time visibility, multi-agent coordination, and a single source of truth for all active projects.

**Why Master.md exists:**

*   • Persistent memory across AI agent sessions — when a chat gets too long, agents reference this for full context.
*   • MACP (Multi-Agent Coordination Protocol) uses this as the ground truth to cross-check agent reviews and prevent hallucinations.
*   • The `Last updated` date and `Version` are auto-updated by GitHub Actions on every push to `main`.

📜 Versioning & Change Log
--------------------------

This project uses a three-part version number: `MAJOR.MINOR.PATCH`

| Part | Who changes it | When |
|---|---|---|
| **PATCH** | GitHub Actions (auto) | Every push to `main` |
| **MINOR** | Ali (manual) | Meaningful feature additions or workflow changes |
| **MAJOR** | Ali (manual) | Breaking changes to MACP protocol or architecture |

### AI_CHANGELOG.md — Purpose & Decision

`AI_CHANGELOG.md` is a dedicated, auto-maintained file that logs every versioned change to this repository. It was introduced in **v1.0.1** for the following reasons:

*   • **AI context without clutter** — Any agent starting a new session can read `AI_CHANGELOG.md` to understand recent changes without parsing the full `Master.md`.
*   • **Hallucination prevention** — Agents can verify that the version they are reading is the latest, and diff their understanding against the log.
*   • **Separation of concerns** — `Master.md` remains the architectural source of truth. `AI_CHANGELOG.md` handles the history of how it got there.
*   • **Scalability** — As the project grows, the review log inside `Master.md` would become unwieldy. `AI_CHANGELOG.md` offloads chronological history so `Master.md` stays focused.

**Format:** Each entry is prepended (newest first) and contains the version, date, and commit message. Generated automatically by `.github/workflows/update-master-date.yml`.

🏗 Confirmed Architecture
-------------------------

### Infrastructure

*   • **Server:** Hostinger VPS (namka.cloud) — already paid, always on, no cold starts.
*   • **Domain:** control.namka.cloud (subdomain A record → VPS IP).
*   • **Reverse Proxy:** Nginx (already installed on VPS).
*   • **Containerization:** Docker + Docker Compose (already installed on VPS).
*   • **SSL:** Certbot / Let's Encrypt (free, auto-renews).
*   • **CI/CD:** GitHub Actions (auto-deploy on push to main).

### Application Stack

*   • **Framework:** Next.js 15 (App Router).
*   • **Language:** TypeScript.
*   • **Styling:** Tailwind CSS.
*   • **UI Components:** shadcn/ui.
*   • **Data Source:** Master.md fetched via GitHub REST API (`/repos/{owner}/{repo}/contents/{path}`).
*   • **AI Layer:** Gemini API (Google AI Pro) — abstracted via `/api/ai` Route Handler.
*   • **State Management:** React Context / Hooks.

📋 Build Phases
---------------

### Phase 0 — Repo & Documentation ✅ COMPLETE

*   [x] Create `namka-control` GitHub repository.
*   [x] Add `Master.md` as ground-truth document.
*   [x] Add `AGENT-ONBOARDING.md` with full Markdown formatting.
*   [x] Add `.github/workflows/update-master-date.yml` — auto-updates `Last updated` date on every push.
*   [x] Define MACP agent roles, Chain of Custody workflow, and conflict prevention rules.
*   [x] Add auto version bump (PATCH) to GitHub Actions workflow.
*   [x] Add `AI_CHANGELOG.md` — auto-maintained change log for AI agent context.

### Phase 1 — Foundation ✅ COMPLETE

*   [x] Scaffold Next.js 15 app locally.
*   [x] Connect to GitHub API, fetch Master.md.
*   [x] Parse Master.md into typed JSON (Projects, Reviews, Priorities).
*   [x] Display 5 focus project cards (filtered from full portfolio).
*   [x] Create `.env.example` with `GITHUB_TOKEN` and `GEMINI_API_KEY` placeholders.

### Phase 2 — Deploy

*   [ ] Write Dockerfile + docker-compose.yml for Next.js app.
*   [ ] Configure Nginx reverse proxy for control.namka.cloud.
*   [ ] Add A record in Hostinger DNS → VPS IP.
*   [ ] Install SSL via Certbot.
*   [ ] Set up GitHub Actions for auto-deploy on push to main.
*   [ ] Security Audit: Ensure no sensitive data leak in `/api/master` response.
*   [ ] UI Refinement: Add error boundaries to Dashboard for partial API failures.

📂 Active Projects
------------------

Project portfolio data has been moved to `Active-Projects.md`.

**Purpose:**  
- Keep `Master.md` focused on governance, MACP workflow, build phases, and review history.  
- Use `Active-Projects.md` as the dedicated dashboard content source.  
- Prevent duplication between coordination docs and UI data parsing.


👥 AI Agent Assignments
-----------------------
| Agent | Core Function | Status |
|---|---|---|
| **Gemini** | Architect & UI Lead. Responsible for system design, Dashboard implementation, and Master.md initialization. | Available |
| **Claude** | UX & Product Owner. Responsible for final ratification, UX flow logic, and authoring AG-Update.md. | Active |
| **Antigravity (AG)** | The Implementer. Sole agent authorized to commit code. Executes instructions from AG-Update.md. | Available |
| **Comet** | Researcher & Auditor. Responsible for browser-based research, reasoning, and maintaining all `.md` documentation. | Active |

🔄 MACP Workflow (Chain of Custody)
-----------------------------------

*   0. **Context Sync** — Agent reads `AI_CHANGELOG.md` to load recent context.
*   1. **Objective Defined** — Ali sets the project goal.
*   2. **Concept & Brainstorm (Gemini)** — Gemini updates Master.md and README.md with proposed architecture.
*   3. **Audit (Comet)** — Comet researches dependencies and ratifies technical logic.
*   4. **UX Ratification (Claude)** — Claude ensures the plan meets Ali's needs and updates Master.md.
*   5. **Execution Trigger (Claude)** — Claude writes AG-Update.md (the strict work order).
*   6. **Implementation (Antigravity)** — AG reads AG-Update.md and commits the code.
*   7. **Verification (Gemini)** — Gemini updates the Dashboard UI and verification status.

📋 Review Log
-------------

### Session Review — 2026-03-30 (Morning) — Session 5

**Agent:** Comet | **Status:** Completed | **Topic:** Session 4 Ratification & Master.md Optimization
docs: ratify Session 4 and optimize Master.md for Phase 2
#### Ratification

Antigravity (AG) Session 4 review is **ratified**. The Next.js 15 foundation, GitHub API integration, and glassmorphic UI are verified.

#### Work Completed This Session

*   • ✅ **MACP Workflow Updated** — Added "Step 0: Context Sync" to mandate reading `AI_CHANGELOG.md` before starting work.
*   • ✅ **Phase 2 Checklist Expanded** — Added Security Audit (API leak check) and UI Refinement (Error boundaries) as per AG's recommendations to ensure they are tracked.
*   • ✅ **Project Next Steps Refined** — Updated Priority 1 "Next Step" to explicitly define owners for Phase 2 (Docker/VPS/Ratification).
*   • ✅ **Timestamp Updated** — `Last updated` date set to 2026-03-30.

#### Recommendations

*   • **Gemini/Ali** to finalize the Docker/Nginx configuration strategy.
*   • **Comet** to conduct a research audit on Hostinger VPS A-record propagation and Nginx SSL best practices for subdomains.
*   • **Claude** to monitor for UX regressions following the "minimal foundation" reset in the `src` directory.

---
This is a living document. AI agents update this file with reviews, status changes, and recommendations.
