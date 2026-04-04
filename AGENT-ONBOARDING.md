# 🛸 Agent Onboarding & MACP Protocol

> **MACP Version 1.2** | Last Updated: 2026-04-04 | Maintained by: Comet

Welcome to **Namka Control**.

This repository uses a document-driven **Multi-Agent Coordination Protocol (MACP)** to help Ali Mora manage planning, architecture, approvals, execution, and reporting without relying on manual relay work between AI agents.

## Core Principle

`Master.md` is the approved operating truth.

All planning, review, and proposed changes happen before promotion into `Master.md`. No implementation should proceed unless the relevant scope has been approved and promoted.

## Document Roles

### `Master.md`
Approved operating truth.

Use this file for:
- approved architecture,
- approved workflow rules,
- approved phase and sprint scope,
- execution truth.

### `Master-Update.md`
Planning and review workspace.

Use this file for:
- draft architecture,
- proposed updates,
- review comments,
- approval staging,
- phase and sprint proposals.

### `AG-Update-*.md`
Execution work order for AG.

Use this file for:
- implementation instructions,
- approved sprint execution scope,
- success criteria,
- code and file change guidance.

Every `AG-Update-*.md` must begin with a `📌 AG-Update Meta` block.

Required format:

```md
## 📌 AG-Update Meta

- Phase: Phase X
- Sprint: Sprint X
- Issued by: Claude
- Date: YYYY-MM-DD
- Time: HH:MM SAST
- Status: READY | IN PROGRESS | COMPLETE | BLOCKED

***
```

### `AI-Logs.md`
Execution evidence and outcomes.

Use this file for:
- completed work summaries,
- blockers,
- validation notes,
- implementation evidence,
- next-step follow-up after execution.

### `Active-Projects.md`
Project portfolio and dashboard content source.

Use this file for:
- active projects,
- portfolio project metadata,
- project-facing content for dashboard display.

## Agent Roles

| Agent | Core Function |
|---|---|
| **Claude** | UX and product owner; drafts `Master-Update.md`; authors `AG-Update-*.md` from approved scope |
| **Gemini** | Architect and UI lead; reviews technical direction and updates `Master-Update.md` |
| **Comet** | Researcher, auditor, and markdown/documentation maintainer |
| **Antigravity (AG)** | Sole implementation agent authorized to commit code and write execution results to `AI-Logs.md` |

## Agent File Authority

Each agent is expected to directly open, read, review, update, and save files relevant to its role **when its runtime supports direct repository access**.

If a runtime cannot directly persist edits to GitHub or the repository, the agent must still complete its role by producing exact edit-ready changes for application through a repo-capable path.

### Authority Types

- **Review authority** — inspect files, identify issues, propose changes, and add review notes
- **Write authority** — author or modify content within approved role scope
- **Persistence authority** — save approved changes to the repository
- **Execution authority** — implement approved code or documentation changes and record outcomes

## MACP Workflow

1. **Context Sync**  
   Read `Master.md`, `AGENT-ONBOARDING.md`, and any relevant current sprint files.

2. **Objective Defined**  
   Ali defines the task with Claude.

3. **Planning Draft**  
   Claude creates or updates `Master-Update.md` with proposed architecture, phases, and sprints.

4. **Technical Review**  
   Gemini reviews and updates `Master-Update.md` directly when runtime allows, or provides exact edit-ready changes for repo application.

5. **Audit Review**  
   Comet reviews and updates `Master-Update.md` directly when runtime allows, or provides exact edit-ready changes for repo application.

6. **Approval Gate**  
   Proposed work is reviewed according to the active approval model in `Master-Update.md`.

7. **Promotion to Canon**  
   Only approved phases and sprints are promoted into `Master.md`.

8. **Execution Order**  
   Claude creates `AG-Update-*.md` using only approved scope already present in `Master.md`.

9. **Implementation**  
   AG executes the approved work.

10. **Execution Report**  
    AG records outcomes, blockers, and evidence in `AI-Logs.md`.

## Execution Rules

- No agent other than AG may commit implementation code.
- No `AG-Update-*.md` may be written from unapproved scope.
- `Master.md` must not contain unresolved alternatives or draft review content.
- `Master-Update.md` must not be treated as execution truth until approval is completed.
- If `Master.md` and `Master-Update.md` conflict, follow `Master.md` until a new approval cycle completes.
- If an agent lacks persistence authority in its runtime, it must still provide exact, usable edit-ready text.

## Session Checklist

Every agent should complete this checklist at the start of each session:

- [ ] Read `Master.md`
- [ ] Read `AGENT-ONBOARDING.md`
- [ ] Check active sprint or phase context
- [ ] Confirm whether work belongs in `Master-Update.md`, `Master.md`, `AG-Update-*.md`, or `AI-Logs.md`
- [ ] Act only within current role authority
- [ ] Record outcomes in the correct file before closing the session

## Final Note

Namka Control is designed to reduce ambiguity between planning, approval, execution, and reporting.

If a task is unclear, the agent should pause, clarify the correct document layer, and avoid writing approved truth, execution orders, or implementation changes into the wrong file.
