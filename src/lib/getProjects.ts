import type { Project } from "@/types/project";

const GITHUB_OWNER = process.env.GITHUB_OWNER || "AliMora83";
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

const REPOS = [
  { name: "namka-control", branch: "main" },
  { name: "SmartPress", branch: "main" },
  { name: "Atlas-Website", branch: "main" },
  { name: "Kora-Tutor", branch: "main" },
  { name: "EventSaas", branch: "main" },
  { name: "Odoo-POS-Terminal", branch: "master" },
  { name: "Odoo-BA-API", branch: "main" },
  { name: "event-serve", branch: "main" }
];

function getSyncUrl(repo: string, branch: string) {
  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${repo}/${branch}/PROJECT-SYNC.json`;
}

function mapPriorityLabel(p: number): "critical" | "high" | "medium" | "low" {
  switch (p) {
    case 1: return "critical";
    case 2: return "high";
    case 3: return "medium";
    default: return "low";
  }
}

export async function getAggregatedProjects(): Promise<{ projects: Project[]; errors: string[]; timestamp: string }> {
  if (!GITHUB_TOKEN) {
    return { projects: [], errors: ["GITHUB_TOKEN is not set"], timestamp: new Date().toISOString() };
  }

  const results = await Promise.allSettled(
    REPOS.map(async (repoInfo): Promise<Project> => {
      const { name: repo, branch } = repoInfo;
      const res = await fetch(getSyncUrl(repo, branch), {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
        },
        next: { revalidate: 60 },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch ${repo} (${branch}): ${res.status}`);
      }

      const data = await res.json();
      
      const project: Project = {
        id: repo,
        name: data.project || repo,
        repo: data.repo || `${GITHUB_OWNER}/${repo}`,
        stack: data.stack || "Unknown",
        status: data.status || "Unknown",
        priority: mapPriorityLabel(data.priority),
        priorityNum: data.priority || 4,
        nextStep: data.next_step || "Check Master.md",
        lastCommit: data.last_push?.commit_message || "No recent commits found",
        agents: data.agents || [],
        progress: data.progress_percent || 0,
        blocker: data.blocker || null,
        liveUrl: data.live_url || null,
        lastUpdated: data.last_push?.timestamp || data.last_updated || "Unknown",
        version: data.version || "0.0.0"
      };

      return project;
    })
  );

  const projects: Project[] = [];
  const errors: string[] = [];

  for (const result of results) {
    if (result.status === "fulfilled") {
      projects.push(result.value);
    } else {
      errors.push(result.reason.message || "Unknown error during fetch");
    }
  }

  return { 
    projects: projects.sort((a, b) => (a.priorityNum ?? 4) - (b.priorityNum ?? 4)), 
    errors,
    timestamp: new Date().toISOString()
  };
}
