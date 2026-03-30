import type { MasterData, Project, ReviewEntry, Priority, ProjectStatus } from "@/types/project";

function extractVersion(raw: string): string {
  const match = raw.match(/Version:\s*([\d.]+)/);
  return match?.[1] ?? "unknown";
}

function extractLastUpdated(raw: string): string {
  const match = raw.match(/Last updated:\s*(\d{4}-\d{2}-\d{2})/);
  return match?.[1] ?? "unknown";
}

/**
 * Extracts projects from Active-Projects.md.
 * Each project is a ### N. Name section with a key-value markdown table.
 */
function extractProjects(projectsRaw: string): Project[] {
  const projects: Project[] = [];

  // Split on ### headings that start with a number (project entries)
  const blocks = projectsRaw.split(/(?=^### \d+\.)/m).filter(Boolean);

  for (const block of blocks) {
    // Must start with a numbered heading
    const headingMatch = block.match(/^### \d+\.\s+(.+)/m);
    if (!headingMatch) continue;
    const name = headingMatch[1].trim();

    // Helper: extract table row value by field name
    const field = (label: string): string => {
      const re = new RegExp(`\\|\\s*\\*\\*${label}\\*\\*\\s*\\|\\s*(.+?)\\s*\\|`, "i");
      return block.match(re)?.[1]?.trim() ?? "";
    };

    const repo      = field("Repo");
    const stack     = field("Stack");
    const statusRaw = field("Status").toLowerCase();
    const nextStep  = field("Next Step");
    const lastUpdated = field("Last Updated");
    const priorityRaw = field("Priority");
    const agentsRaw = field("Assigned Agent");
    const progress  = field("Progress");

    // Derive Priority enum from the priority string
    let priority: Priority = "low";
    if (/priority\s*1/i.test(priorityRaw))      priority = "critical";
    else if (/priority\s*2/i.test(priorityRaw)) priority = "high";
    else if (/priority\s*3/i.test(priorityRaw)) priority = "medium";

    // Derive ProjectStatus enum
    const statusMap: Record<string, ProjectStatus> = {
      active: "active",
      blocked: "blocked",
      complete: "complete",
      paused: "paused",
      "in progress": "active",
    };
    let status: ProjectStatus = "active";
    for (const [key, val] of Object.entries(statusMap)) {
      if (statusRaw.includes(key)) { status = val; break; }
    }

    projects.push({
      id:        name.toLowerCase().replace(/\s+/g, "-"),
      name,
      repo,
      stack,
      status,
      priority,
      nextStep,
      lastCommit: lastUpdated,
      agents:     agentsRaw.split(/[·,+]/).map((a) => a.trim()).filter(Boolean),
      progress,
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
      agent:   block[3].trim(),
      date:    block[1].trim(),
      topic:   block[4].trim(),
      status:  "completed",
    });
  }

  return reviews;
}

/**
 * Finds the first phase heading in Master.md that does NOT have ✅ COMPLETE.
 * Falls back to the last phase heading if all are complete.
 */
function detectCurrentPhase(raw: string): { current: number; label: string } {
  const phaseMatches = [...raw.matchAll(/### Phase (\d+) — ([^\n]+)/g)];

  for (const match of phaseMatches) {
    const line = match[0];
    if (!line.includes("✅ COMPLETE")) {
      const num   = parseInt(match[1]);
      // Strip trailing status markers like "NEXT UP", emojis, etc.
      const label = match[2].replace(/[✅🔄🚧💡]\s*/g, "").trim();
      return { current: num, label };
    }
  }

  // All phases complete — return the last one
  if (phaseMatches.length > 0) {
    const last  = phaseMatches[phaseMatches.length - 1];
    const num   = parseInt(last[1]);
    const label = last[2].replace(/[✅🔄🚧💡]\s*/g, "").trim();
    return { current: num, label };
  }

  return { current: 0, label: "Documentation" };
}

export function parseMaster(raw: string, projectsRaw?: string): MasterData {
  return {
    version:     extractVersion(raw),
    lastUpdated: extractLastUpdated(raw),
    projects:    extractProjects(projectsRaw ?? raw),
    reviews:     extractReviews(raw),
    phase:       detectCurrentPhase(raw),
  };
}
