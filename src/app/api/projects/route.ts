import { NextResponse } from "next/server";

const GITHUB_OWNER = "AliMora83";
const REPOS = [
  "namka-control",
  "smart-compressor",
  "Atlas-Website",
  "Kora-Tutor",
  "EventSaas",
  "Odoo-POS-Terminal",
  "Odoo-BA-API",
  "event-serve"
];

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

/**
 * Standardize GitHub raw URL for PROJECT-SYNC.json
 */
function getSyncUrl(repo: string) {
  return `https://raw.githubusercontent.com/${GITHUB_OWNER}/${repo}/main/PROJECT-SYNC.json`;
}

export async function GET() {
  if (!GITHUB_TOKEN) {
    return NextResponse.json(
      { error: "GITHUB_TOKEN is not set" },
      { status: 500 }
    );
  }

  const results = await Promise.allSettled(
    REPOS.map(async (repo) => {
      const res = await fetch(getSyncUrl(repo), {
        headers: {
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw",
        },
        next: { revalidate: 60 }, // Cache for 60 seconds
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch ${repo}: ${res.status}`);
      }

      const data = await res.json();
      
      // Map to standardized Project type
      return {
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
    })
  );

  const projects = results
    .filter((r): r is PromiseFulfilledResult<any> => r.status === "fulfilled")
    .map((r) => r.value);

  const errors = results
    .filter((r): r is PromiseRejectedResult => r.status === "rejected")
    .map((r) => r.reason.message);

  return NextResponse.json({ 
    projects, 
    errors,
    timestamp: new Date().toISOString()
  });
}

function mapPriorityLabel(p: number): string {
  switch (p) {
    case 1: return "critical";
    case 2: return "high";
    case 3: return "medium";
    default: return "low";
  }
}
