# ⚙️ AG-Update.md — Phase 1 Scaffold + CI Upgrade

> **Authored by:** Claude (UX & Product Owner)
> **Date:** 2026-03-29
> **Version target:** 1.0.2
> **Repo:** https://github.com/AliMora83/namka-control
> **Status:** 🟢 READY FOR IMPLEMENTATION

---

## 📋 Pre-flight Checklist (AG must confirm before starting)

- [ ] Pull latest `main` branch — ensure you have the updated `Master.md` (Version: 1.0.1) and the new workflow file.
- [ ] Confirm Node.js ≥ 18 is available locally.
- [ ] Confirm you have write access to `github.com/AliMora83/namka-control`.
- [ ] Read `Master.md` in full before touching any file.
- [ ] No other agent is mid-session on this repo (check Review Log).

---

## 🎯 Feature Goal

Bootstrap the Namka Control Next.js 15 application from scratch inside the existing repo. At the end of this update, the repo must contain:

1. A working Next.js 15 (App Router, TypeScript) application.
2. A live GitHub API integration that fetches and parses `Master.md`.
3. A dashboard home page rendering 5 priority project cards from parsed data.
4. Environment variable scaffolding (`.env.example`, `.env.local` in `.gitignore`).
5. The upgraded CI workflow and updated `Master.md` (v1.0.1) committed first, before any app code.

---

## 🗂 Repo State After This Update

```
namka-control/
├── .github/
│   └── workflows/
│       └── update-master-date.yml     ← UPGRADED (version bump + AI_CHANGELOG)
├── src/
│   └── app/
│       ├── layout.tsx                 ← Root layout, metadata, fonts
│       ├── page.tsx                   ← Dashboard home page
│       ├── globals.css                ← Tailwind base styles
│       └── api/
│           └── master/
│               └── route.ts           ← GitHub API fetcher (server-side)
├── src/
│   └── lib/
│       └── parseMaster.ts             ← Master.md parser → typed JSON
├── src/
│   └── types/
│       └── project.ts                 ← TypeScript interfaces
├── src/
│   └── components/
│       ├── ProjectCard.tsx            ← Individual project card
│       └── Dashboard.tsx              ← Grid layout + data fetching wrapper
├── .env.example                       ← NEW
├── .gitignore                         ← Ensure .env.local is listed
├── Master.md                          ← UPDATED (v1.0.1)
├── AI_CHANGELOG.md                    ← NEW (auto-created by CI on first push)
├── AGENT-ONBOARDING.md                ← UNCHANGED
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
└── next.config.ts
```

---

## 📦 Step 1 — Commit CI Upgrade & Documentation First

Before scaffolding the app, commit the documentation and workflow changes as a standalone commit. This triggers the new CI pipeline for the first time and auto-creates `AI_CHANGELOG.md`.

```bash
# From repo root (namka-control/)
git add Master.md .github/workflows/update-master-date.yml
git commit -m "chore: upgrade CI workflow with version bump and add AI_CHANGELOG support"
git push origin main
```

> ✅ Expected result: GitHub Actions runs, bumps version to 1.0.2, creates `AI_CHANGELOG.md` with the first entry.

Verify the Action passed in the GitHub Actions tab before proceeding to Step 2.

---

## 📦 Step 2 — Scaffold Next.js 15 App

Run inside the repo root (not a subdirectory — the app lives at the root):

```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-git
```

> `--no-git` because the repo already exists. Do not re-initialise git.

Accept all defaults when prompted. Verify `package.json` shows `"next": "^15.x.x"`.

---

## 📦 Step 3 — Install Dependencies

```bash
npm install
npm install shadcn-ui @radix-ui/react-slot class-variance-authority clsx tailwind-merge lucide-react
npx shadcn@latest init
```

When `shadcn init` prompts:
- Style: **Default**
- Base colour: **Slate**
- CSS variables: **Yes**

Then add the Badge and Card components:

```bash
npx shadcn@latest add card badge
```

---

## 📦 Step 4 — Environment Variables

### `.env.example`

Create this file at repo root:

```env
# GitHub API — required to fetch Master.md
# Generate at: https://github.com/settings/tokens
# Scopes needed: repo (read)
GITHUB_TOKEN=your_github_pat_here

# GitHub Repo details
GITHUB_OWNER=AliMora83
GITHUB_REPO=namka-control
GITHUB_BRANCH=main

# Gemini AI (for future Phase 2 AI layer)
GEMINI_API_KEY=your_gemini_api_key_here
```

### `.env.local` (AG creates locally, never committed)

```env
GITHUB_TOKEN=<Ali's actual PAT>
GITHUB_OWNER=AliMora83
GITHUB_REPO=namka-control
GITHUB_BRANCH=main
```

### Verify `.gitignore`

Ensure this line exists in `.gitignore` (create-next-app adds it, but confirm):

```
.env.local
```

---

## 📦 Step 5 — TypeScript Types

Create `src/types/project.ts`:

```typescript
export type Priority = "critical" | "high" | "medium" | "low";
export type ProjectStatus = "active" | "blocked" | "complete" | "paused";

export interface Project {
  id: string;
  name: string;
  repo: string;
  stack: string;
  status: ProjectStatus;
  priority: Priority;
  nextStep: string;
  lastCommit: string;
  agents: string[];
}

export interface ReviewEntry {
  session: number;
  agent: string;
  date: string;
  topic: string;
  status: "completed" | "blocked" | "in-progress";
}

export interface MasterData {
  version: string;
  lastUpdated: string;
  projects: Project[];
  reviews: ReviewEntry[];
  phase: {
    current: number;
    label: string;
  };
}
```

---

## 📦 Step 6 — GitHub API Route

Create `src/app/api/master/route.ts`:

```typescript
import { NextResponse } from "next/server";

const GITHUB_API = "https://api.github.com";

export async function GET() {
  const owner  = process.env.GITHUB_OWNER  ?? "AliMora83";
  const repo   = process.env.GITHUB_REPO   ?? "namka-control";
  const branch = process.env.GITHUB_BRANCH ?? "main";
  const token  = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN is not set" },
      { status: 500 }
    );
  }

  const url = `${GITHUB_API}/repos/${owner}/${repo}/contents/Master.md?ref=${branch}`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github.v3.raw",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: `GitHub API error: ${res.status} ${res.statusText}` },
      { status: res.status }
    );
  }

  const raw = await res.text();
  return NextResponse.json({ raw });
}
```

---

## 📦 Step 7 — Master.md Parser

Create `src/lib/parseMaster.ts`:

```typescript
import type { MasterData, Project, ReviewEntry, Priority, ProjectStatus } from "@/types/project";

function extractVersion(raw: string): string {
  const match = raw.match(/Version:\s*([\d.]+)/);
  return match?.[1] ?? "unknown";
}

function extractLastUpdated(raw: string): string {
  const match = raw.match(/Last updated:\s*(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? "unknown";
}

function extractProjects(raw: string): Project[] {
  const projects: Project[] = [];

  // Match each project block starting with ####
  const projectBlocks = raw.matchAll(
    /####\s+\d+\.\s+(.+?)\n([\s\S]*?)(?=####|\n---|\n##\s)/g
  );

  for (const block of projectBlocks) {
    const name = block[1].trim();
    const body = block[2];

    const repo      = body.match(/\*\*Repo:\*\*.*\((https?:\/\/[^\)]+)\)/)?.[1]?.trim() ?? "";
    const stack     = body.match(/\*\*Stack:\*\*\s*(.+)/)?.[1]?.trim() ?? "";
    const statusRaw = body.match(/\*\*Status:\*\*\s*(.+)/)?.[1]?.split("|")[0]?.trim().toLowerCase() ?? "active";
    const nextStep  = body.match(/\*\*Next Step:\*\*\s*(.+)/)?.[1]?.trim() ?? "";
    const lastCommit = body.match(/Last commit:\s*(\d{4}-\d{2}-\d{2})/)?.[1]?.trim() ?? "";
    const agentsRaw = body.match(/\*\*AI Model:\*\*\s*(.+)/)?.[1]?.trim() ?? "";

    // Derive priority from section heading (Priority 1 → critical, etc.)
    const priorityMatch = raw.match(new RegExp(`### 🔴 Priority (\\d+)[^#]*####[^#]*${name}`));
    const priorityNum = parseInt(priorityMatch?.[1] ?? "2");
    const priorityMap: Record<number, Priority> = { 1: "critical", 2: "high", 3: "medium" };
    const priority: Priority = priorityMap[priorityNum] ?? "low";

    const statusMap: Record<string, ProjectStatus> = {
      active: "active", blocked: "blocked", complete: "complete", paused: "paused"
    };

    projects.push({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      repo,
      stack,
      status: statusMap[statusRaw] ?? "active",
      priority,
      nextStep,
      lastCommit,
      agents: agentsRaw.split("+").map((a) => a.trim()),
    });
  }

  return projects;
}

function extractReviews(raw: string): ReviewEntry[] {
  const reviews: ReviewEntry[] = [];
  const blocks = raw.matchAll(
    /### Session Review — (\d{4}-\d{2}-\d{2}).*?— Session (\d+)\n\*\*Agent:\*\*\s*(.+?)\s*\|.*?\*\*Topic:\*\*\s*(.+)/g
  );

  for (const block of blocks) {
    reviews.push({
      session: parseInt(block[2]),
      agent: block[3].trim(),
      date: block[1].trim(),
      topic: block[4].trim(),
      status: "completed",
    });
  }

  return reviews;
}

function detectCurrentPhase(raw: string): { current: number; label: string } {
  if (raw.includes("Phase 1") && raw.includes("NEXT UP")) return { current: 1, label: "Foundation" };
  if (raw.includes("Phase 2") && raw.includes("NEXT UP")) return { current: 2, label: "Deploy" };
  return { current: 0, label: "Documentation" };
}

export function parseMaster(raw: string): MasterData {
  return {
    version:     extractVersion(raw),
    lastUpdated: extractLastUpdated(raw),
    projects:    extractProjects(raw),
    reviews:     extractReviews(raw),
    phase:       detectCurrentPhase(raw),
  };
}
```

---

## 📦 Step 8 — Components

### `src/components/ProjectCard.tsx`

```typescript
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Project } from "@/types/project";

const priorityColour: Record<string, string> = {
  critical: "bg-red-500",
  high:     "bg-orange-500",
  medium:   "bg-yellow-500",
  low:      "bg-green-500",
};

const statusColour: Record<string, string> = {
  active:   "bg-blue-500",
  blocked:  "bg-red-600",
  complete: "bg-green-600",
  paused:   "bg-slate-400",
};

interface Props {
  project: Project;
}

export function ProjectCard({ project }: Props) {
  return (
    <Card className="border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold text-slate-800 leading-snug">
            {project.name}
          </CardTitle>
          <div className="flex flex-col gap-1 items-end shrink-0">
            <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${priorityColour[project.priority]}`}>
              {project.priority.toUpperCase()}
            </span>
            <span className={`text-[10px] font-bold text-white px-2 py-0.5 rounded-full ${statusColour[project.status]}`}>
              {project.status.toUpperCase()}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 text-sm text-slate-600">
        <p className="text-xs text-slate-400 font-mono">{project.stack}</p>
        <p><span className="font-medium text-slate-700">Next: </span>{project.nextStep}</p>
        <div className="flex flex-wrap gap-1 pt-1">
          {project.agents.map((agent) => (
            <Badge key={agent} variant="secondary" className="text-[10px]">
              {agent.split("(")[0].trim()}
            </Badge>
          ))}
        </div>
        {project.repo && (
          <a
            href={project.repo}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-xs text-blue-500 hover:underline truncate pt-1"
          >
            {project.repo.replace("https://", "")}
          </a>
        )}
      </CardContent>
    </Card>
  );
}
```

### `src/components/Dashboard.tsx`

```typescript
import { parseMaster } from "@/lib/parseMaster";
import { ProjectCard } from "@/components/ProjectCard";

async function getMasterData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  const res = await fetch(`${baseUrl}/api/master`, { next: { revalidate: 60 } });
  if (!res.ok) throw new Error("Failed to fetch Master.md");
  const { raw } = await res.json();
  return parseMaster(raw);
}

export async function Dashboard() {
  const data = await getMasterData();
  const topProjects = data.projects.slice(0, 5);

  return (
    <main className="min-h-screen bg-slate-50 p-6 md:p-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-2xl">🛸</span>
          <h1 className="text-2xl font-bold text-slate-800">Namka Control</h1>
        </div>
        <p className="text-sm text-slate-500">
          Phase {data.phase.current} — {data.phase.label} &nbsp;·&nbsp;
          Master.md v{data.version} &nbsp;·&nbsp;
          Updated {data.lastUpdated}
        </p>
      </div>

      {/* Project Grid */}
      <section>
        <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
          Focus Projects ({topProjects.length})
        </h2>
        {topProjects.length === 0 ? (
          <p className="text-slate-400 text-sm">No projects found in Master.md.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {topProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="mt-12 text-xs text-slate-400 text-center">
        Data sourced live from Master.md via GitHub API · Namka Control · {data.lastUpdated}
      </footer>
    </main>
  );
}
```

---

## 📦 Step 9 — Root Layout & Page

### `src/app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Namka Control",
  description: "AI-assisted project management dashboard — Ali Mora",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

### `src/app/page.tsx`

```typescript
import { Dashboard } from "@/components/Dashboard";

export default function Home() {
  return <Dashboard />;
}
```

---

## 📦 Step 10 — Local Verification

```bash
# Run dev server
npm run dev
```

Open `http://localhost:3000` and confirm:

- [ ] Page loads without errors.
- [ ] Header shows correct version and date from Master.md.
- [ ] At least 1 project card renders with name, status, priority, next step, and agents.
- [ ] No TypeScript errors (`npx tsc --noEmit`).
- [ ] No ESLint errors (`npm run lint`).

If the API route returns a 500, check that `.env.local` has a valid `GITHUB_TOKEN`.

---

## 📦 Step 11 — Commit & Push

Once local verification passes, commit in two logical groups:

```bash
# Group 1: Environment and config files
git add .env.example .gitignore next.config.ts tsconfig.json tailwind.config.ts postcss.config.mjs package.json package-lock.json
git commit -m "chore: scaffold Next.js 15 config, env example, and dependencies"

# Group 2: Application source
git add src/
git commit -m "feat: Phase 1 foundation — GitHub API, Master.md parser, dashboard UI"

# Push both
git push origin main
```

> ✅ Expected result: CI runs, bumps version to 1.0.3 (or 1.0.4 depending on how many pushes Step 1 generated), appends two entries to AI_CHANGELOG.md.

---

## ✅ Success Criteria

AG's work on this update is complete when ALL of the following are true:

| # | Criterion | How to verify |
|---|---|---|
| 1 | CI workflow upgraded and AI_CHANGELOG.md created | Check GitHub Actions tab — first run passed |
| 2 | Next.js 15 app runs locally on port 3000 | `npm run dev` — no errors |
| 3 | `/api/master` returns raw Master.md content | `curl http://localhost:3000/api/master` |
| 4 | Dashboard renders at least 1 project card | Browser — `http://localhost:3000` |
| 5 | Version and date visible in dashboard header | Matches Master.md header |
| 6 | `.env.example` committed, `.env.local` NOT committed | `git ls-files | grep env` — only `.env.example` |
| 7 | No TypeScript errors | `npx tsc --noEmit` exits 0 |
| 8 | No ESLint errors | `npm run lint` exits 0 |
| 9 | All commits pushed to `main` | GitHub repo shows latest commits |
| 10 | Review Log updated in Master.md | See instructions below |

---

## 📝 Review Log Entry (AG must append to Master.md before closing)

Add the following entry to the Review Log section in `Master.md`:

```markdown
### Session Review — 2026-03-29 — Session 4
**Agent:** Antigravity (AG) | **Status:** Completed | **Topic:** Phase 1 Foundation Scaffold

#### Work Completed This Session
- ✅ CI workflow committed — version bump and AI_CHANGELOG.md now live.
- ✅ Next.js 15 app scaffolded at repo root (App Router, TypeScript, Tailwind, shadcn/ui).
- ✅ GitHub API route created — fetches Master.md with 60s ISR revalidation.
- ✅ Master.md parser implemented — extracts version, date, projects, reviews, and current phase.
- ✅ ProjectCard and Dashboard components built and rendering live data.
- ✅ .env.example committed. .env.local excluded from git.
- ✅ All TypeScript and ESLint checks pass.

#### Recommendations
- Hand off to Gemini for dashboard UI review and Phase 2 architecture planning.
- Consider adding error boundary to Dashboard component for API failure states.
```

---

*AG-Update.md authored by Claude — UX & Product Owner — 2026-03-29*
*Next handoff: Gemini (dashboard UI verification) → Phase 2 planning*
