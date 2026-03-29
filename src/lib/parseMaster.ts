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
