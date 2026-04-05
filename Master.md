# 🧐 🤖 Namka Control — Master.md

> Owner: Ali Mora  
> Location: Johannesburg, ZA  
> Last updated: 2026-04-05  
> Version: 1.0.34

## Mission

Streamline project management through AI-assisted development by providing real-time visibility, structured multi-agent governance, and an approved operating source of truth for active work.

## Purpose

`Master.md` is the approved operating truth for Namka Control.

It exists to:
- define approved architecture and workflow decisions,
- record approved phase and sprint scope,
- anchor execution and ratification,
- reduce ambiguity and hallucination across agents.

## Governance Reference

This file contains only approved architecture and approved phase/sprint scope.

- All draft ideas, proposed changes, and unapproved work live in `Master-Update.md`.
- Only items explicitly approved in `Master-Update.md` are promoted into `Master.md`.
- `AG-Update.md` must be created only from approved scope already present in `Master.md`.
- `AI-Logs.md` records actual execution outcomes, not proposed work.
- If `Master-Update.md` and `Master.md` disagree, `Master.md` is the active source of truth until a new approval cycle is completed.

## Agent File Authority

To minimize Ali-in-the-loop document handling, each AI agent is expected to directly open, read, review, update, and save the files relevant to its role **when its runtime supports direct repository access**.

If an agent runtime cannot directly persist changes to GitHub or the repository, the agent must still perform its role by producing exact edit-ready changes for application through a repo-capable path.

### Authority Model

This workflow separates four types of authority:

- **Review authority** — inspect files, propose edits, and record approval or correction notes.
- **Write authority** — author or modify content within assigned scope.
- **Persistence authority** — save approved changes back to the repository.
- **Execution authority** — implement approved code or documentation changes and record outcomes.

Review or write authority does not automatically guarantee persistence authority in every runtime.

### File Authority by Agent

#### Claude
- Review authority: `Master-Update.md`, `Master.md`, `AG-Update.md`
- Write authority: may create and update `Master-Update.md`; may create and update `AG-Update.md`; may append UX and product review notes
- Persistence authority: direct when runtime allows; otherwise provides exact edit-ready changes
- Execution authority: none for code implementation

#### Gemini
- Review authority: `Master-Update.md`, `Master.md`
- Write authority: may review and update `Master-Update.md`; may append technical approval notes and architecture corrections
- Persistence authority: direct when runtime allows; otherwise provides exact edit-ready changes
- Execution authority: none for code implementation

#### Comet
- Review authority: `Master-Update.md`, `Master.md`, assigned documentation files
- Write authority: may review and update `Master-Update.md`; may update documentation alignment notes and research-backed corrections; may maintain `.md` documentation as assigned
- Persistence authority: direct when runtime allows; otherwise provides exact edit-ready changes
- Execution authority: documentation maintenance only, within approved scope

#### AG
- Review authority: `AG-Update.md`, implementation-relevant docs
- Write authority: may update implementation files; may append execution evidence and outcomes to `AI-Logs.md`
- Persistence authority: direct for approved implementation and execution logging
- Execution authority: may execute only from approved `AG-Update.md`
> Every `AG-Update-*.md` must begin with a `📌 AG-Update Meta` block that records the Phase, Sprint, Issued by, Date, Time, and Status for traceability.

### Promotion Rules

- `Master-Update.md` is the collaborative review workspace.
- `Master.md` is updated only with content that has passed the approval gate.
- `AG-Update.md` must only be written from approved scope already promoted into `Master.md`.
- `AI-Logs.md` must reflect actual execution outcomes only.
- If an agent has review or write authority but lacks persistence authority in its current runtime, approved changes must still be captured as exact edit-ready text and applied through a repo-capable path.

### Ali Role

- Ali defines goals, constraints, and priorities.
- Ali is not required to manually relay AI-proposed edits between files when an assigned agent or repo-capable path can apply them.
- Ali remains the human owner of final project direction.

## Versioning

This project uses semantic versioning in the format `MAJOR.MINOR.PATCH`.

| Part | Changed by | When |
|---|---|---|
| `PATCH` | GitHub Actions | Every push to `main` |
| `MINOR` | Ali | Meaningful feature additions or workflow changes |
| `MAJOR` | Ali | Breaking changes to governance model or architecture |

## AI_CHANGELOG.md

`AI_CHANGELOG.md` is the auto-maintained history file for this repository.

It exists to:
- give agents quick session context without rereading all of `Master.md`,
- reduce hallucination by clarifying recent changes,
- separate architecture from chronological history,
- keep `Master.md` focused and readable as the project grows.

**Format:** newest entries first, including version, date, and commit message.  
Generated automatically by `.github/workflows/update-master-date.yml`.

## Confirmed Architecture

### Infrastructure

- **Server:** Hostinger VPS (`namka.cloud`) — always on, no cold starts
- **Domain:** `control.namka.cloud`
- **Reverse Proxy:** Nginx
- **Containerization:** Docker + Docker Compose
- **SSL:** Certbot / Let's Encrypt
- **CI/CD:** GitHub Actions auto-deploy on push to `main`

### Application Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Primary dashboard source:** `Active-Projects.md` parsed via GitHub API
- **Governance source:** `Master.md`
- **AI layer:** Gemini API via `/api/ai`
- **State management:** React Context / Hooks

### Data Model Direction

- `Active-Projects.md` is the current human-readable dashboard content source.
- `PROJECT-SYNC.json` is the machine-readable per-repo project payload format.
- Supabase may be used as an approved runtime aggregation and realtime layer when explicitly ratified in `Master.md`.
- Governance and execution authority remain document-driven even when runtime data sources evolve.

## Build Phases

### Phase 0 — Repo & Documentation ✅ COMPLETE

- [x] Create `namka-control` GitHub repository
- [x] Add `Master.md` as ground-truth governance document
- [x] Add `AGENT-ONBOARDING.md`
- [x] Add `.github/workflows/update-master-date.yml`
- [x] Define agent roles, chain of custody, and conflict prevention rules
- [x] Add automatic patch version bump workflow
- [x] Add `AI_CHANGELOG.md`

### Phase 1 — Foundation ✅ COMPLETE

- [x] Scaffold Next.js app
- [x] Connect to GitHub API and fetch source docs
- [x] Parse source markdown into typed JSON
- [x] Display focus project cards
- [x] Add `.env.example` with required placeholders

### Phase 2 — Deploy ✅ COMPLETE

- [x] Write Dockerfile and `docker-compose.yml`
- [x] Configure Nginx reverse proxy
- [x] Point DNS to VPS
- [x] Install SSL via Certbot
- [x] Set up GitHub Actions auto-deploy
- [x] Audit `/api/master` for sensitive data exposure
- [x] Add dashboard error boundaries for partial API failure

### Phase 3 — Resilience & Performance 🔄 IN PROGRESS

- [ ] Implement caching for GitHub API calls
- [ ] Add zero-downtime deployment strategy
- [ ] Expand error boundary coverage
- [ ] Run performance audit and establish Lighthouse baseline

## Active Projects

Project portfolio data lives in `Active-Projects.md`.

This separation keeps:
- `Master.md` focused on governance, architecture, approvals, and execution truth,
- `Active-Projects.md` focused on dashboard-visible project data,
- coordination docs separate from runtime project content.

## AI Agent Assignments

| Agent | Core Function | Status |
|---|---|---|
| **Gemini** | Architect and UI lead. Responsible for system design, dashboard architecture, and technical review. | Available |
| **Claude** | UX and product owner. Responsible for planning, ratification flow, and authoring `AG-Update.md`. | Active |
| **AG** | Sole implementation agent authorized to commit code and update `AI-Logs.md` after execution. | Available |
| **Comet** | Researcher, auditor, and documentation maintainer. Responsible for review support and markdown alignment. | Active |

## MACP Workflow

0. **Context Sync** — Agent reads `AI_CHANGELOG.md` and relevant docs before starting.
1. **Objective Defined** — Ali defines the task with Claude.
2. **Planning Draft** — Claude creates or updates `Master-Update.md` with proposed architecture, phases, and sprints.
3. **Technical Review** — Gemini reviews and updates `Master-Update.md` directly when runtime allows, or provides exact edit-ready changes for repo application.
4. **Audit Review** — Comet reviews and updates `Master-Update.md` directly when runtime allows, or provides exact edit-ready changes for repo application.
5. **Approval Gate** — Proposed work is reviewed and marked according to the active approval model in `Master-Update.md`.
6. **Promotion to Canon** — Only approved phases and sprints are promoted into `Master.md`.
7. **Execution Order** — Claude creates `AG-Update.md` using only approved scope already present in `Master.md`.
8. **Implementation** — AG executes approved work and applies implementation changes.
9. **Execution Report** — AG records outcomes, blockers, and evidence in `AI-Logs.md`.

## Execution Rule

No implementation may begin unless:
- the relevant scope exists in `Master.md`,
- the related review cycle has completed in `Master-Update.md`,
