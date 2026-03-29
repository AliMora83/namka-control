# 🧐 🤖 Namka Control – Project Overview
> Last updated: 2026-03-29 | Owner: Ali Mora | Location: Johannesburg, ZA

---

## 🎯 Mission

Streamline project management through AI-assisted development — providing real-time visibility, multi-agent coordination, and a single source of truth for all active projects.

**Why Master.md exists:**
1. Persistent memory across AI agent sessions — when a chat gets too long, agents reference this for full context
2. MACP (Multi-Agent Coordination Protocol) uses this as the ground truth to cross-check agent reviews and prevent hallucinations

---

## 🏗 Confirmed Architecture

### Infrastructure
- **Server:** Hostinger VPS (namka.cloud) — already paid, always on, no cold starts
- **Domain:** control.namka.cloud (subdomain A record → VPS IP)
- **Reverse Proxy:** Nginx (already installed on VPS)
- **Containerization:** Docker + Docker Compose (already installed on VPS)
- **SSL:** Certbot / Let's Encrypt (free, auto-renews)
- **CI/CD:** GitHub Actions (auto-deploy on push to main)

### Application Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Data Source:** Master.md fetched via GitHub REST API
- **AI Layer:** Gemini API (Google AI Pro)
- **State Management:** React Context / Hooks

### Data Flow
```
Master.md (GitHub)
      ↓  read/write via GitHub API
Next.js 15 (Docker container on Hostinger VPS)
      ↓
Nginx → control.namka.cloud (SSL via Certbot)
      ↓
Gemini API (AI analysis + portfolio health)
```

---

## 📋 Build Phases

### Phase 1 — Foundation (NEXT UP)
- [ ] Scaffold Next.js 15 app locally
- [ ] Connect to GitHub API, fetch Master.md
- [ ] Parse Master.md into typed JSON (Projects, Reviews, Priorities)
- [ ] Display 5 focus project cards (filtered from full portfolio)

### Phase 2 — Deploy
- [ ] Write Dockerfile + docker-compose.yml for Next.js app
- [ ] Configure Nginx reverse proxy for control.namka.cloud
- [ ] Add A record in Hostinger DNS → VPS IP
- [ ] Install SSL via Certbot
- [ ] Set up GitHub Actions for auto-deploy on push to main

### Phase 3 — AI Layer
- [ ] Integrate Gemini API
- [ ] Portfolio health analysis panel
- [ ] Agent review log with Approve flow (quality gate for MACP)

### Phase 4 — Edit & Write Back
- [ ] Edit project modal in dashboard
- [ ] Commit approved changes back to Master.md via GitHub API

---

## 🖥 Dashboard Features (MVP)

### What's on the single-page dashboard:
1. **Project cards** — Name, Stack, Status, Priority, Next Step, Assigned Agent (5 focus projects)
2. **AI Analysis panel** — Gemini's summary of portfolio health and blockers
3. **Review log** — Agent entries with Approve button (MACP quality gate)
4. **Edit modal** — Click any project to update its fields → writes back to GitHub

### Project Scope:
- Ali has 10+ total projects
- MVP focuses on **5 projects** (configurable filter in dashboard)
- All projects remain in Master.md; dashboard filters to active focus set

---

## 📂 Active Projects

### 🔴 Priority 1 – Setup & Configuration

#### 1. Namka Control Dashboard
- **Repo:** https://github.com/AliMora83/namka-control
- **Stack:** TypeScript / React / Next.js 15 / Tailwind / shadcn/ui
- **Status:** Active | Last commit: 2026-03-29
- **Next Step:** Scaffold Next.js app locally, connect GitHub API, build 5-project card view
- **AI Model:** Claude (Frontend & UX) + Gemini (AI Analysis)
- **Notes:** Architecture finalized. Hostinger VPS + Nginx + Docker confirmed. control.namka.cloud target domain. Build starting Phase 1.

---

## 👥 AI Agent Assignments

| Agent | Role | Status |
|-------|------|--------|
| **Gemini** | Architecture & Multi-project oversight | Available |
| **Claude** | Frontend & UX Development | Active — Phase 1 ready |
| **Antigravity** | Backend & API Development | Available |
| **Comet** | Cross-checking & Coordination | Available |

---

## 📋 Review Log

### Session Review — 2026-03-29
**Agent**: Claude  
**Status**: Completed  
**Project**: Namka Control Dashboard  
**Topic**: Architecture Decision Session

### Analysis
Full architecture discussion completed with Ali. Key decisions made:
- Rejected Vercel and Google Cloud Run in favour of existing Hostinger VPS (already paid, Docker + Nginx already installed)
- Confirmed control.namka.cloud as dashboard subdomain
- Confirmed Gemini API as AI layer (Ali has Google AI Pro)
- MACP purpose clarified: cross-agent hallucination prevention + persistent session memory via Master.md
- MVP scoped to 5 focus projects out of 10+ total

### Recommendations
1. Start Phase 1 immediately: scaffold Next.js 15 locally
2. Use Gemini API to parse Master.md intelligently (avoids brittle regex parsers)
3. Approve flow is critical — treat it as MACP quality gate, not just a UI feature
4. Keep Master.md clean and structured — it's the memory layer for all agents

### Next Action
> ⚡ **Claude to proceed**: Begin Phase 1 — Next.js scaffold + GitHub API connection + 5-project card view

---

## 🔗 Related Resources

- [Namka Mission Control](https://github.com/AliMora83/Namka-Mission-Control) - Parent repository
- [namka-control repo](https://github.com/AliMora83/namka-control) - Dashboard repo
- [README.md](./README.md) - Repository documentation

---

*This is a living document. AI agents update this file with reviews, status changes, and recommendations.*
