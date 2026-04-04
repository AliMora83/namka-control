# AG-Update.md — Cross-Repo Standardisation
## Phase 1: namka-control + PROJECT-SYNC.json Infrastructure

> **Issued by:** Claude (UX & Product Owner)
> **Date:** 2026-03-31
> **Session:** Cross-Repo Documentation & Dashboard Sync Infrastructure
> **Priority:** 🔴 Execute in order — namka-control first, then remaining 6 repos
> **Repo Hub:** https://github.com/AliMora83/namka-control

---

## 📌 AG-Update Meta

- Phase: Phase X
- Sprint: Sprint X
- Issued by: Claude
- Date: YYYY-MM-DD
- Time: HH:MM SAST
- Status: READY | IN PROGRESS | COMPLETE | BLOCKED

---

## 🔍 Audit Results — What Exists vs. What's Needed

| Repo | Branch | README | Master.md | AI_CHANGELOG | AGENT-ONBOARDING | Workflows | PROJECT-SYNC.json |
|---|---|---|---|---|---|---|---|
| namka-control | main | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ Add |
| Odoo-POS-Terminal | **master** ⚠️ | ✅ basic | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Add |
| SmartPress | main | ✅ | ✅ | ❌ Missing | ✅ (needs update) | ✅ partial | ❌ Add |
| Atlas-Website | main | ✅ | ✅ | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Add |
| Kora-Tutor | main | ✅ | ⚠️ Named `Kora-Master.md` | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Add |
| EventSaaS | main | ✅ | ❌ Missing | ❌ Missing | ❌ Missing | ✅ partial | ❌ Add |
| Odoo-BA-API | main | ❓ unconfirmed | ❓ | ❌ Missing | ❌ Missing | ❌ Missing | ❌ Add |

### ⚠️ Key Issues Found

1. **Kora-Tutor** — Master file is named `Kora-Master.md`, not `Master.md`. Must be standardised. Dashboard looks for `Master.md` by convention.
2. **Odoo-POS-Terminal** — Uses `master` branch, not `main`. All workflows must target `master`.
3. **SmartPress** — `AGENT-ONBOARDING.md` references the old `Namka-Mission-Control` repo. Must be updated to point to `namka-control`.
4. **EventSaaS** — Has a `.agent/` folder (non-standard). Retain — do not modify or delete it.
5. **Odoo-BA-API** — Could not confirm file list due to rate limit. AG must audit manually before creating files.

---

## 📐 Decided Standard: 4-File Schema Per Project

| File | Purpose | Who Updates |
|---|---|---|
| `README.md` | Human-facing intro. Quick links. AI onboarding pointer. | AG (once, rarely changes) |
| `Master.md` | Ground truth. Goals, stack, phases, MACP roles, review log. | Comet / Claude per session |
| `AI_CHANGELOG.md` | Auto-prepended log of every push. Version + commit. | GitHub Actions (auto) |
| `PROJECT-SYNC.json` | Machine-readable snapshot for Namka Control Dashboard. | GitHub Actions (auto) |

---

## 📦 PROJECT-SYNC.json — Decided Schema

This schema is used for all 7 repos. Complete enough for the Dashboard to render rich project cards with zero markdown parsing required.

```json
{
  "project": "Project Display Name",
  "repo": "AliMora83/repo-name",
  "branch": "main",
  "stack": "TypeScript / Next.js 15 / Tailwind CSS",
  "status": "Active",
  "priority": 1,
  "priority_label": "🔴 Priority 1 — Ship Now",
  "progress_percent": 75,
  "progress_label": "Phase 2 complete",
  "current_phase": "Phase 3",
  "next_step": "Description of next action",
  "blocker": null,
  "live_url": "https://example.namka.cloud",
  "deploy_target": "Hostinger VPS · Docker · Nginx",
  "agents": ["Claude", "Comet"],
  "version": "1.0.10",
  "last_push": {
    "timestamp": "2026-03-31T10:22:00Z",
    "actor": "AliMora83",
    "commit_message": "feat: description",
    "sha": "a3f9c12"
  },
  "last_updated": "2026-03-31"
}
```

> **Dashboard note:** Namka Control's `/api/projects` route (Part 3, issued separately) will fetch all 7 `PROJECT-SYNC.json` files in parallel via the GitHub Contents API. Same auth pattern as `Master.md`. No new secrets required.

---

## 🔄 Reusable Workflow Template: `generate-project-sync.yml`

This is the base workflow AG adapts for each repo. The only things that change between repos are the JSON field values and the branch name.

```yaml
name: Generate PROJECT-SYNC.json

on:
  push:
    branches:
      - main   # ← Change to 'master' for Odoo-POS-Terminal only

permissions:
  contents: write

jobs:
  generate-project-sync:
    runs-on: ubuntu-latest
    if: github.actor != 'github-actions[bot]'

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GITHUB_TOKEN }}

      - name: Generate PROJECT-SYNC.json
        run: |
          TIMESTAMP=$(date -u '+%Y-%m-%dT%H:%M:%SZ')
          TODAY=$(date -u '+%Y-%m-%d')
          ACTOR="${{ github.actor }}"
          COMMIT_MSG="${{ github.event.head_commit.message }}"
          SHORT_SHA="${{ github.sha }}"
          SHORT_SHA="${SHORT_SHA:0:7}"
          VERSION=$(grep -oP 'Version: \K[0-9]+\.[0-9]+\.[0-9]+' Master.md 2>/dev/null || echo "0.0.0")

          # ↓↓↓ AG: Replace the JSON values below for each repo ↓↓↓
          cat > PROJECT-SYNC.json << ENDJSON
          {
            "project": "REPLACE_PROJECT_NAME",
            "repo": "AliMora83/REPLACE_REPO",
            "branch": "main",
            "stack": "REPLACE_STACK",
            "status": "REPLACE_STATUS",
            "priority": 0,
            "priority_label": "REPLACE_PRIORITY_LABEL",
            "progress_percent": 0,
            "progress_label": "REPLACE_PROGRESS_LABEL",
            "current_phase": "REPLACE_PHASE",
            "next_step": "REPLACE_NEXT_STEP",
            "blocker": null,
            "live_url": "REPLACE_LIVE_URL_OR_NULL",
            "deploy_target": "REPLACE_DEPLOY_TARGET",
            "agents": ["REPLACE_AGENTS"],
            "version": "$VERSION",
            "last_push": {
              "timestamp": "$TIMESTAMP",
              "actor": "$ACTOR",
              "commit_message": "$COMMIT_MSG",
              "sha": "$SHORT_SHA"
            },
            "last_updated": "$TODAY"
          }
          ENDJSON

          sed -i 's/^          //' PROJECT-SYNC.json
          echo "PROJECT-SYNC.json generated."

      - name: Commit PROJECT-SYNC.json
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git diff --quiet PROJECT-SYNC.json || (
            git add PROJECT-SYNC.json &&
            git commit -m "chore: update PROJECT-SYNC.json [skip ci]" &&
            git push
          )
```

---

## 🚀 PART 1 — namka-control (Execute First)

### Step 1 — Create `PROJECT-SYNC.json` placeholder at repo root

```json
{
  "project": "Namka Control Dashboard",
  "repo": "AliMora83/namka-control",
  "branch": "main",
  "stack": "TypeScript / Next.js 15 / Tailwind CSS / shadcn/ui / GitHub API / Gemini API",
  "status": "Active",
  "priority": 1,
  "priority_label": "🔴 Priority 1 — Ship Now",
  "progress_percent": 70,
  "progress_label": "Phase 2 complete — Phase 3 not started",
  "current_phase": "Phase 3",
  "next_step": "Caching, zero-downtime deploy, error boundaries",
  "blocker": null,
  "live_url": "https://control.namka.cloud",
  "deploy_target": "Hostinger VPS · Docker · Nginx · Certbot",
  "agents": ["Claude", "Comet", "Gemini", "AG"],
  "version": "1.0.10",
  "last_push": {
    "timestamp": "",
    "actor": "",
    "commit_message": "placeholder — overwritten by workflow on next push",
    "sha": ""
  },
  "last_updated": "2026-03-31"
}
```

### Step 2 — Create `.github/workflows/generate-project-sync.yml`
Use the reusable template above with namka-control values filled in (they match Step 1).

### Step 3 — Verify
- [ ] Workflow green in Actions tab
- [ ] `PROJECT-SYNC.json` committed by `github-actions[bot]`
- [ ] Raw URL returns valid JSON:
  `https://raw.githubusercontent.com/AliMora83/namka-control/main/PROJECT-SYNC.json`
- [ ] **Report back to Claude before proceeding to Part 2**

---

## 🚀 PART 2 — Remaining 6 Repos

> Execute in this order: **SmartPress → Atlas-Website → Kora-Tutor → EventSaaS → Odoo-POS-Terminal → Odoo-BA-API**

---

### Repo 1: SmartPress

**Actions required:**
1. Create `AI_CHANGELOG.md` (template below)
2. Create `.github/workflows/generate-project-sync.yml`
3. Update `AGENT-ONBOARDING.md` — replace all references to `Namka-Mission-Control` with `namka-control`

**`AI_CHANGELOG.md` template (same for all repos):**
```markdown
# AI Changelog — [Project Name]

> Auto-maintained by GitHub Actions. Each entry reflects a versioned push.
> Newest entries appear first. Do not edit manually.

---

*Awaiting first workflow run.*
```

**PROJECT-SYNC.json values:**
```json
{
  "project": "SmartPress",
  "repo": "AliMora83/SmartPress",
  "branch": "main",
  "stack": "TypeScript / Next.js 15 / Python / FastAPI / FFmpeg / Tailwind CSS",
  "status": "Active",
  "priority": 2,
  "priority_label": "🟡 Priority 2 — Active Development",
  "progress_percent": 60,
  "progress_label": "MVP core complete — pending deploy",
  "current_phase": "Phase 1 — MVP Stabilisation",
  "next_step": "FFmpeg pipeline stability validation · Error handling for unsupported formats",
  "blocker": null,
  "live_url": null,
  "deploy_target": "Vercel (frontend) · Docker + Google Cloud Run (backend)",
  "agents": ["Claude", "Comet"]
}
```

---

### Repo 2: Atlas-Website

**Actions required:**
1. Create `AI_CHANGELOG.md`
2. Create `AGENT-ONBOARDING.md` (template below)
3. Create `.github/workflows/generate-project-sync.yml`
4. Create `.github/workflows/update-master-date.yml` (copy from namka-control exactly — `Master.md` already exists)

**`AGENT-ONBOARDING.md` template (adapt name/links for each repo):**
```markdown
# 🤖 Agent Onboarding — [Project Name]

> Read this before doing **any** work in this repo.

---

## Step 1 — Read These Files First (in order)

1. `Master.md` — full project context, stack, phases, decisions
2. `AI_CHANGELOG.md` — what changed recently and current version
3. namka-control `Master.md` — MACP protocol and portfolio overview

**Raw URLs:**
- `https://raw.githubusercontent.com/AliMora83/[REPO]/main/Master.md`
- `https://raw.githubusercontent.com/AliMora83/[REPO]/main/AI_CHANGELOG.md`
- `https://raw.githubusercontent.com/AliMora83/namka-control/main/Master.md`

---

## Step 2 — Agent Roles

| Agent | Role |
|---|---|
| **Claude** | UX review, product decisions, issues AG-Update.md |
| **Comet** | Research, audit, documentation |
| **Gemini** | Architecture, UI proposals |
| **AG (Antigravity)** | Implementation only — executes AG-Update.md |

---

## Step 3 — Rules

- Do not commit code without an AG-Update.md from Claude
- Do not modify `Master.md` during implementation — Comet and Claude own it
- Add a review log entry to `Master.md` at the end of your session
- Check `AI_CHANGELOG.md` for current version before starting work

---

*Part of the [Namka Control](https://github.com/AliMora83/namka-control) portfolio.*
```

**PROJECT-SYNC.json values:**
```json
{
  "project": "Atlas Conference Website",
  "repo": "AliMora83/Atlas-Website",
  "branch": "main",
  "stack": "TypeScript / Next.js / Tailwind CSS / sharp",
  "status": "Active",
  "priority": 2,
  "priority_label": "🟡 Priority 2 — Active Development",
  "progress_percent": 90,
  "progress_label": "90% complete",
  "current_phase": "Content Completion",
  "next_step": "Review /src page structure · Complete remaining content sections",
  "blocker": null,
  "live_url": "https://atlasconference.africa",
  "deploy_target": "Netlify (atlasglobal26)",
  "agents": ["Comet"]
}
```

---

### Repo 3: Kora-Tutor

**Actions required:**
1. ⚠️ Rename `Kora-Master.md` → `Master.md` and update all README links
2. Create `AI_CHANGELOG.md`
3. Create `AGENT-ONBOARDING.md`
4. Create `.github/workflows/generate-project-sync.yml`
5. Create `.github/workflows/update-master-date.yml` — **verify** renamed `Master.md` contains `Version: X.Y.Z` and `Last updated: YYYY-MM-DD` fields before deploying

**Rename command:**
```bash
git mv Kora-Master.md Master.md
git commit -m "refactor: rename Kora-Master.md to Master.md for MACP standardisation"
```
Then update `README.md` — replace all occurrences of `Kora-Master.md` with `Master.md`.

**PROJECT-SYNC.json values:**
```json
{
  "project": "Kora Tutor",
  "repo": "AliMora83/Kora-Tutor",
  "branch": "main",
  "stack": "TypeScript / Next.js 14+ / Firebase / Gemini 1.5 Flash / Google Cloud TTS / WaveSurfer.js / GSAP",
  "status": "In Progress",
  "priority": 2,
  "priority_label": "🟡 Priority 2 — Active Development",
  "progress_percent": 30,
  "progress_label": "Sprint 2 active",
  "current_phase": "Sprint 2 (Mar 30 – Apr 12)",
  "next_step": "SVG mouth animations + WaveSurfer.js waveform rendering",
  "blocker": null,
  "live_url": null,
  "deploy_target": "Vercel + Firebase",
  "agents": ["Claude", "Comet"]
}
```

---

### Repo 4: EventSaaS

**Actions required:**
1. Create `Master.md` (content below)
2. Create `AI_CHANGELOG.md`
3. Create `AGENT-ONBOARDING.md`
4. Create `.github/workflows/generate-project-sync.yml`
5. Create `.github/workflows/update-master-date.yml`
6. Do **not** modify `.agent/` folder or existing workflows

**`Master.md` content:**
```markdown
# EventSaaS — Production Management Platform

> Owner: Ali Mora | Location: Johannesburg, ZA
> Last updated: 2026-03-31 | Version: 1.0.0

## 🎯 Mission

Replace fragmented spreadsheets, WhatsApps, and email chains in South African event production workflows. One platform from first budget estimate to final load-out.

## 🏗 Stack

- Frontend: React 18 / TypeScript / Vite
- Styling: Tailwind CSS v4 (warm neutral design system)
- State: Zustand
- Backend / DB: Firebase Auth · Firestore · Storage
- AI: Google Gemini (layout suggestions, budget insights)
- PDF: @react-pdf/renderer
- Canvas: HTML5 Canvas (2D) · Three.js (Phase 3 planned)
- Deployment: Hostinger VPS · Nginx · GitHub Actions CI/CD

## 📋 Build Phases

### Phase 1 ✅ COMPLETE
- [x] Dashboard · Budget Hub · Inventory Manager
- [x] Timeline & Crew · Client Proposals · Visual Engine (2D)
- [x] Deployed to eventsaas.namka.cloud

### Phase 2 🔄 Not Started
- [ ] Xero invoice sync
- [ ] Resend email automation
- [ ] PDF export polish
- [ ] 3D floor plan preview (Three.js)

### Phase 3 — Planned
- [ ] Mobile PWA + offline mode
- [ ] Advanced AI budgeting
- [ ] Multi-org white-label

## 👥 Agent Assignments

| Agent | Role |
|---|---|
| TBC | Implementation |

## 📋 Review Log

*No entries yet.*
```

**PROJECT-SYNC.json values:**
```json
{
  "project": "EventSaaS",
  "repo": "AliMora83/EventSaas",
  "branch": "main",
  "stack": "React 18 / TypeScript / Vite / Tailwind CSS v4 / Zustand / Firebase / Gemini AI",
  "status": "Active",
  "priority": 2,
  "priority_label": "🟡 Priority 2 — Active Development",
  "progress_percent": 50,
  "progress_label": "Phase 1 deployed — Phase 2 not started",
  "current_phase": "Phase 2 Planning",
  "next_step": "Xero invoice sync · Resend email automation · PDF export polish · 3D preview",
  "blocker": null,
  "live_url": "https://eventsaas.namka.cloud",
  "deploy_target": "Hostinger VPS · Nginx · GitHub Actions CI/CD",
  "agents": ["TBC"]
}
```

---

### Repo 5: Odoo-POS-Terminal

**Actions required:**
1. Create `Master.md` (content below)
2. Create `AI_CHANGELOG.md`
3. Create `AGENT-ONBOARDING.md`
4. Create `.github/workflows/generate-project-sync.yml` — **branch: master**
5. Create `.github/workflows/update-master-date.yml` — **branch: master**

**`Master.md` content:**
```markdown
# Odoo POS Terminal

> Owner: Ali Mora | Location: Johannesburg, ZA
> Last updated: 2026-03-31 | Version: 1.0.0

## 🎯 Mission

Custom hardware POS terminal bridging an ESP32 microcontroller to Odoo POS via a FastAPI middleware layer. Replaces off-the-shelf POS hardware with a bespoke PCBA.

## 🏗 Stack

- Hardware: ESP32 (FreeRTOS)
- Middleware: FastAPI (Python) — hosted on Hostinger VPS
- POS Integration: Odoo JSON-RPC
- PCB Design: EasyEDA
- PCB Manufacturing: PCBWay PCBA
- Deployment: Hostinger VPS (FastAPI) · Odoo.sh (POS + Accounting)

## 📋 Build Phases

### Phase 1 🔄 In Progress — 20%
- [x] FastAPI scaffold — /health endpoint created
- [ ] Additional API endpoints (order sync, payment confirmation)
- [ ] ESP32 firmware scaffold
- [ ] Odoo JSON-RPC integration
- [ ] PCB design finalised in EasyEDA
- [ ] PCBA order placed with PCBWay

## 👥 Agent Assignments

| Agent | Role |
|---|---|
| Claude | Architecture |
| Qwen | Build / Python |
| Comet | Cross-check |

## 📋 Review Log

*No entries yet.*
```

**PROJECT-SYNC.json values:**
```json
{
  "project": "Odoo POS Terminal",
  "repo": "AliMora83/Odoo-POS-Terminal",
  "branch": "master",
  "stack": "ESP32 (FreeRTOS) / FastAPI / Odoo JSON-RPC / Python / EasyEDA / PCBWay PCBA",
  "status": "In Progress",
  "priority": 1,
  "priority_label": "🔴 Priority 1 — Ship Now",
  "progress_percent": 20,
  "progress_label": "20% — FastAPI scaffold in progress",
  "current_phase": "Phase 1",
  "next_step": "Additional FastAPI endpoints · ESP32 firmware · Odoo JSON-RPC integration",
  "blocker": null,
  "live_url": "https://namka.cloud",
  "deploy_target": "Hostinger VPS (FastAPI) · Odoo.sh (POS + Accounting)",
  "agents": ["Claude", "Qwen", "Comet"]
}
```

---

### Repo 6: Odoo-BA-API

**Actions required:**
1. **Audit the repo root first** — list all files and report back before creating anything
2. Create any missing files from: `Master.md`, `AI_CHANGELOG.md`, `AGENT-ONBOARDING.md`, `.github/workflows/`
3. Use the same templates above

**PROJECT-SYNC.json values:**
```json
{
  "project": "Bridging Africa Odoo API",
  "repo": "AliMora83/Odoo-BA-API",
  "branch": "main",
  "stack": "Python 3.11+ / Odoo 19.0 / PostgreSQL / Odoo.sh",
  "status": "Active — Maintenance",
  "priority": 3,
  "priority_label": "🟢 Priority 3 — Client / Maintenance",
  "progress_percent": 65,
  "progress_label": "Phase 3 complete — Phase 4 not started",
  "current_phase": "Phase 4 Planning",
  "next_step": "Accounting Refinement — invoice layout + payment reconciliation",
  "blocker": null,
  "live_url": "https://bridging-africa.com",
  "deploy_target": "Odoo.sh (bridging-africa-sh) · GitHub → Odoo.sh integration",
  "agents": ["TBC"]
}
```

---

## 📡 PART 3 — Dashboard API (Separate Work Order)

> Do not implement until all 7 repos confirm `PROJECT-SYNC.json` is live.
> Claude will issue Part 3 as a standalone `AG-Update.md`.

**Preview of what Part 3 will contain:**
- New `/api/projects` route — fetches all 7 `PROJECT-SYNC.json` files in parallel
- Dashboard project cards driven by live JSON (replacing manual `Active-Projects.md` parsing)
- Activity feed showing `last_push` across all 7 projects sorted by timestamp
- Error boundary handling for any repo that fails to return valid JSON

---

## ✅ Completion Checklist

### Part 1 — namka-control
- [ ] `PROJECT-SYNC.json` placeholder created at repo root
- [ ] `generate-project-sync.yml` workflow created
- [ ] Workflow runs green in Actions tab
- [ ] Raw JSON URL confirmed accessible
- [ ] **Notify Claude: "Part 1 complete"**

### Part 2 — 6 Repos (confirm each)
- [ ] SmartPress — `AI_CHANGELOG.md` created · `PROJECT-SYNC.json` workflow live · `AGENT-ONBOARDING.md` updated
- [ ] Atlas-Website — All 4 files created · both workflows live
- [ ] Kora-Tutor — `Kora-Master.md` renamed · all 4 files · both workflows live
- [ ] EventSaaS — `Master.md` created · all 4 files · both workflows live
- [ ] Odoo-POS-Terminal — `Master.md` created · all 4 files · workflows targeting `master` branch
- [ ] Odoo-BA-API — Audited · all missing files created · workflows live
- [ ] **Notify Claude: "Part 2 complete — all 6 repos confirmed"**

---

## 🚫 Out of Scope

- Do not modify any application code in any repo
- Do not modify or delete `deploy.yml` or any existing deployment workflows
- Do not delete the `.agent/` folder in EventSaaS
- Do not restructure the `docs/` folder in Odoo-POS-Terminal
- Part 3 (Dashboard API) will be a separate AG-Update.md from Claude

---

*Issued by Claude — UX & Product Owner | MACP v2.0 | 2026-03-31*
