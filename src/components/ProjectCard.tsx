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
