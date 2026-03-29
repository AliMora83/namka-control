# 🛸 Agent Onboarding & MACP Protocol

> **MACP Version 1.1** | Last Updated: 2026-03-29 | Maintained by: Comet

Welcome to **Namka Control**. You are part of a Multi-Agent Coordination Protocol (MACP) designed to assist Ali Mora in building a high-velocity project management ecosystem.

Every agent must read this document at the start of every session. It is the single source of truth for roles, responsibilities, and protocol rules.

---

## 👥 Roles & Responsibilities

| Agent | Core Function | Domain |
|---|---|---|
| **Gemini** | Architect & UI Lead | System design, Dashboard implementation, and Master.md initialization. |
| **Claude** | UX & Product Owner | Final ratification of features, UX flow logic, and authoring AG-Update.md. |
| **Comet** | Researcher & Auditor | Browser-based research, reasoning, and maintaining all `.md` documentation. |
| **Antigravity (AG)** | The Implementer | Sole agent authorized to commit code. Executes instructions from AG-Update.md. |

---

## 🔄 The MACP Workflow (Chain of Custody)

1. **Objective Defined** — Ali sets the project goal.
2. **Concept & Brainstorm (Gemini)** — Gemini updates Master.md and README.md with proposed architecture.
3. **Audit (Comet)** — Comet researches dependencies, checks for hallucinations, and ratifies technical logic in Master.md.
4. **UX Ratification (Claude)** — Claude reviews the audited plan, ensures it meets Ali's needs, and updates Master.md.
5. **Execution Trigger (Claude)** — Claude writes AG-Update.md: a strict technical spec for the next build phase.
6. **Implementation (Antigravity)** — AG reads AG-Update.md and commits the code.
7. **Verification (Gemini)** — Gemini updates the Dashboard UI to reflect the new state and resets the loop.

---

## 📝 Document Guidelines

### Master.md (The Source of Truth)

- All agents **MUST** reference `Master.md` at the start of every session.
- Only update sections relevant to your role.
- Use the **Review Log** to track session outcomes.
- The `Last updated` date in the header is auto-updated by GitHub Actions on every push to `main`.

### AG-Update.md (The Work Order)

- Written by **Claude only**.
- Must contain: Feature Goal, File Changes, Code Snippets/Logic, and Success Criteria.
- AG reads this file before writing a single line of code.

### AGENT-ONBOARDING.md (This File)

- Maintained by **Comet**.
- Updated whenever roles, workflow, or protocol rules change.

---

## 🚫 Conflict Prevention Rules

- **NO AGENT** other than Antigravity (AG) may commit code to the repository.
- **Comet** is the primary maintainer of all Markdown files to ensure formatting consistency.
- If an agent detects a hallucination in a previous agent's review, they must flag it in the Review Log as `[BLOCKER]`.
- Agents must never overwrite another agent's Review Log entry — only append.
- All work orders flow through Claude. No agent skips the Chain of Custody.

---

## ✅ Session Checklist (Every Agent, Every Session)

- [ ] Read `Master.md` for full project context.
- [ ] Read `AGENT-ONBOARDING.md` for current role rules.
- [ ] Check the Review Log for any `[BLOCKER]` flags before proceeding.
- [ ] Only act within your designated role.
- [ ] Update the Review Log with your session outcome before closing.

---

*This document is maintained by Comet and updated as protocol evolves.*
