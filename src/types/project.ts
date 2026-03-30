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
  progress?: string;
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
