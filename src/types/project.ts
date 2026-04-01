export type Priority = "critical" | "high" | "medium" | "low";
export type ProjectStatus = "active" | "blocked" | "complete" | "paused" | "Active" | "Done" | "Stale" | "Review" | string;

export interface Project {
  id: string;
  name: string;
  repo: string;
  stack: string;
  status: ProjectStatus;
  priority: Priority;
  /** Numeric priority alias: 1 = P1, 2 = P2, 3 = P3, 4 = P4 */
  priorityNum?: number;
  nextStep: string;
  lastCommit: string;
  agents: string[];
  /** Progress percentage — may be a number (0-100) or a string like "65%" */
  progress?: string | number;
  /** Blocker description, if any */
  blocker?: string;
  /** Effort sizing: S | M | L | XL */
  effort?: string;
  liveUrl?: string;
  lastUpdated?: string;
  version?: string;
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
