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
 * Finds the first phase heading in Master.md that does NOT have ✅ COMPLETE.
 * Falls back to the last phase heading if all are complete.
 */
function detectCurrentPhase(raw: string): { current: number; label: string } {
  const lines = raw.split('\n');
  const phaseLines = lines.filter(l => l.startsWith('### Phase'));

  // First non-complete phase
  for (const line of phaseLines) {
    if (!line.includes('✅ COMPLETE')) {
      const match = line.match(/### Phase (\d+)\s*[—-]\s*(.+)/);
      if (match) {
        const num   = parseInt(match[1]);
        const label = match[2].replace(/[✅🔄🚧💡]\s*/g, '').replace(/\s*(NEXT UP|IN PROGRESS|NOT STARTED)\s*/gi, '').trim();
        return { current: num, label: `Phase ${num} — ${label}` };
      }
    }
  }

  // All complete — return the last one
  if (phaseLines.length > 0) {
    const last  = phaseLines[phaseLines.length - 1];
    const match = last.match(/### Phase (\d+)\s*[—-]\s*(.+)/);
    if (match) {
      const num   = parseInt(match[1]);
      const label = match[2].replace(/[✅🔄🚧💡]\s*/g, '').trim();
      return { current: num, label: `Phase ${num} — ${label}` };
    }
  }

  return { current: 0, label: "Unknown" };
}

/**
 * Parses a Progress field value into a 0–100 number.
 * Handles: "50%", "20%", prose strings like "Phase 1 ✅ Complete · Phase 2 ✅ Complete · Phase 3 🔄 Not started"
 */
function parseProgress(raw: string): number {
  if (!raw) return 0;

  // Direct percentage: "50%", "20 %"
  const pctMatch = raw.match(/^(\d+)\s*%/);
  if (pctMatch) return Math.min(100, parseInt(pctMatch[1]));

  // Prose with phase completion markers — count complete phases
  if (raw.includes('Phase')) {
    const total    = (raw.match(/Phase \d+/g) ?? []).length;
    const complete = (raw.match(/Phase \d+ ✅/g) ?? []).length;
    if (total > 0) return Math.round((complete / total) * 100);
  }

  return 0;
}

/**
 * Extracts projects from Active-Projects.md.
 * Each project is a ### N. Name section with a key-value markdown table.
 * Field format: | **Field Name** | Value |
 */
function extractProjects(projectsRaw: string): Project[] {
  if (!projectsRaw) return [];

  const projects: Project[] = [];

  // Split on ### headings that start with a number (project entries)
  const blocks = projectsRaw.split(/(?=^### \d+\.)/m).filter(Boolean);

  for (const block of blocks) {
    // Must start with a numbered heading
    const headingMatch = block.match(/^### \d+\.\s+(.+)/m);
    if (!headingMatch) continue;
    const headingName = headingMatch[1].trim();

    // Helper: extract table row value by field name (bold label in first column)
    const field = (label: string): string => {
      const re = new RegExp(`\\|\\s*\\*\\*${label}\\*\\*\\s*\\|\\s*(.+?)\\s*\\|`, "i");
      return block.match(re)?.[1]?.trim() ?? "";
    };

    // Use "Project Name" field if present, otherwise fall back to heading
    const nameField = field("Project Name");
    const name      = nameField || headingName;

    const repo        = field("Repo");
    const stack       = field("Stack");
    const statusRaw   = field("Status").toLowerCase();
    const nextStep    = field("Next Step");
    const lastUpdated = field("Last Updated");
    const priorityRaw = field("Priority");
    const agentsRaw   = field("Assigned Agent");
    const progressRaw = field("Progress");
    const blockerRaw  = field("Blocker");
    const effortRaw   = field("Effort");

    // Skip blocks with no meaningful data
    if (!name || (!stack && !statusRaw && !priorityRaw)) continue;

    // Derive Priority enum from the priority string
    let priority: Priority = "low";
    if (/priority\s*1/i.test(priorityRaw))      priority = "critical";
    else if (/priority\s*2/i.test(priorityRaw)) priority = "high";
    else if (/priority\s*3/i.test(priorityRaw)) priority = "medium";

    // Derive ProjectStatus enum
    const statusMap: Record<string, ProjectStatus> = {
      active:        "active",
      blocked:       "blocked",
      complete:      "complete",
      paused:        "paused",
      "in progress": "active",
      "stale":       "paused",
    };
    let status: ProjectStatus = "active";
    for (const [key, val] of Object.entries(statusMap)) {
      if (statusRaw.includes(key)) { status = val; break; }
    }

    // Blocker: omit if empty or "None"
    const blocker = blockerRaw && !/^none$/i.test(blockerRaw.trim()) ? blockerRaw : undefined;

    // Progress: parse to number
    const progress = parseProgress(progressRaw);

    // Agents: split on ·, commas, or +
    const agents = agentsRaw
      ? agentsRaw.split(/\s*[·,+]\s*/).map(a => a.split('(')[0].trim()).filter(Boolean)
      : [];

    // Effort: S | M | L | XL (normalize)
    const effortNorm = effortRaw ? effortRaw.toUpperCase().trim() : undefined;
    const effort = ['S', 'M', 'L', 'XL'].includes(effortNorm ?? '') ? effortNorm : undefined;

    projects.push({
      id:         name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""),
      name,
      repo,
      stack,
      status,
      priority,
      nextStep,
      lastCommit: lastUpdated,
      agents,
      progress,
      blocker,
      effort,
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

export function parseMaster(raw: string, projectsRaw?: string): MasterData {
  return {
    version:     extractVersion(raw),
    lastUpdated: extractLastUpdated(raw),
    projects:    extractProjects(projectsRaw ?? raw),
    reviews:     extractReviews(raw),
    phase:       detectCurrentPhase(raw),
  };
}
