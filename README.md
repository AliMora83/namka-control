# Namka Control

Namka Control is an AI-assisted project control dashboard for Ali Mora.

It combines a live project dashboard with a structured multi-agent governance model so planning, approval, execution, and reporting stay aligned across the repo.

## Purpose

Namka Control exists to:

- provide real-time visibility into active projects,
- maintain a clear approved source of truth for execution,
- coordinate multiple AI agents through a document-driven workflow,
- reduce ambiguity between planning, approvals, implementation, and logs.

## Core Documents

- `Master.md` — approved operating truth for architecture, workflow, and approved phase/sprint scope
- `Master-Update.md` — planning, review, and proposed updates
- `AG-Update-*.md` — execution work orders written from approved scope
- `AI-Logs.md` — execution evidence, delivery notes, blockers, and outcomes
- `Active-Projects.md` — project portfolio data for dashboard display
- `AGENT-ONBOARDING.md` — MACP onboarding rules, document roles, and agent responsibilities

## Architecture

### Infrastructure

- Hostinger VPS (`namka.cloud`)
- Docker + Docker Compose
- Nginx reverse proxy
- SSL via Let's Encrypt / Certbot
- GitHub Actions for deployment and automation

### Application Stack

- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui
- GitHub API for markdown-backed project data
- Gemini API via `/api/ai`

## Governance Model

Namka Control uses a document-driven multi-agent workflow:

1. Ali defines the goal with Claude.
2. Claude creates or updates `Master-Update.md`.
3. Gemini reviews technical architecture and updates `Master-Update.md`.
4. Comet audits, aligns docs, and updates `Master-Update.md`.
5. Approved work is promoted into `Master.md`.
6. Claude writes `AG-Update-*.md` from approved scope.
7. AG executes the work.
8. AG records outcomes in `AI-Logs.md`.

## Local Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment Variables

Create a local environment file based on `.env.example`.

Typical variables include:

- `GITHUB_TOKEN`
- `GEMINI_API_KEY`

Add any future approved environment variables according to `Master.md` and the active sprint scope.

## Deployment

Deployment targets the Hostinger VPS and is handled through Docker and GitHub Actions.

High-level deployment flow:

1. Push to `main`
2. GitHub Actions runs the deployment workflow
3. Application is rebuilt and deployed to the VPS
4. Nginx serves the app at `control.namka.cloud`

## Agent Notes

- Do not treat `README.md` as the governance source of truth.
- Always use `Master.md` for approved architecture and execution truth.
- Use `Master-Update.md` for review-stage planning and proposed changes.
- Use `AGENT-ONBOARDING.md` for the current MACP operating rules.

## Status

Namka Control is actively evolving under phased sprint delivery.

Refer to `Master.md` for:
- approved scope,
- active phase,
- governance rules,
- current execution direction.
