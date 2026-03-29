# 🧐 🤖 Namka Control – Project Overview

> Last updated: 2026-03-29 | Owner: Ali Mora | Location: Johannesburg, ZA

---

## 🎯 Mission

Streamline project management through AI-assisted development — providing real-time visibility, multi-agent coordination, and a single source of truth for all active projects.

**Why Master.md exists:**
- Persistent memory across AI agent sessions — when a chat gets too long, agents reference this for full context.
- MACP (Multi-Agent Coordination Protocol) uses this as the ground truth to cross-check agent reviews and prevent hallucinations.

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
- **Data Source:** Master.md fetched via GitHub REST API.
- **AI Layer:** Gemini API (Google AI Pro).
- **State Management:** React Context / Hooks.

---

## 📋 Build Phases

### Phase 1 — Foundation (IN PROGRESS)
- [ ] Scaffold Next.js 15 app locally.
- [ ] Connect to GitHub API, fetch Master.md.
- [ ] Parse Master.md into typed JSON (Projects, Reviews, Priorities).
- [ ] Display 5 focus project cards (filtered from full portfolio).

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
- **Next Step:** Scaffold Next.js app locally, connect GitHub API, build 5-project card view.
- **AI Model:** Claude (UX/Ratification) + Gemini (Architecture/UI)

---

## 👥 AI Agent Assignments (Updated Roles)

| Agent | Core Function | Status |
|-------|---------------|--------|
| **Gemini** | Architect & UI Lead. Responsible for system design, Dashboard implementation, and Master.md initialization. | Available |
| **Claude** | UX & Product Owner. Responsible for final ratification, UX flow logic, and authoring AG-Update.md. | Active |
| **Antigravity (AG)** | The Implementer. Sole agent authorized to commit code. Executes instructions from AG-Update.md. | Available |
| **Comet** | Researcher & Auditor. Responsible for browser-based research, reasoning, and maintaining all .md documentation. | Available |

---

## 🔄 MACP Workflow (The Chain of Custody)

1. **Objective Defined:** Ali sets the project goal.
2. **Concept & Brainstorm (Gemini):** Gemini updates Master.md and README.md with proposed architecture.
3. **Audit (Comet):** Comet researches dependencies and ratifies technical logic.
4. **UX Ratification (Claude):** Claude ensures the plan meets Ali's needs and updates Master.md.
5. **Execution Trigger (Claude):** Claude writes AG-Update.md (the strict work order).
6. **Implementation (Antigravity):** AG reads AG-Update.md and commits the code.
7. **Verification (Gemini):** Gemini updates the Dashboard UI and verification status.

---

## 📋 Review Log

### Session Review — 2026-03-29 (Evening)
**Agent:** Gemini  
**Status:** Completed  
**Topic:** MACP Protocol Refinement

#### Analysis
Refined the agent coordination model to prevent conflicts and ensure high-velocity execution. Key updates:
- Restricted code commit authority exclusively to Antigravity (AG).
- Designated Comet as the primary maintainer of Markdown documentation and browser-based research.
- Formulated the "Chain of Custody" workflow to ensure triple-checked logic before implementation.
- Initialized AGENT-ONBOARDING.md to codify these rules for all agents.

#### Recommendations
- Proceed with Claude or Comet to perform their specific "Lens" reviews of the Phase 1 architecture.
- Ensure all agents adhere strictly to the "No-Commit" rule except for AG.

---

## 🔗 Related Resources

- [Namka Mission Control](https://github.com/AliMora83/Namka-Mission-Control) - Parent repository.
- [namka-control repo](https://github.com/AliMora83/namka-control) - Dashboard repo.
- [README.md](./README.md) - Repository documentation.
- [AGENT-ONBOARDING.md](./AGENT-ONBOARDING.md) - Agent roles and protocols.

---

*This is a living document. AI agents update this file with reviews, status changes, and recommendations.*
