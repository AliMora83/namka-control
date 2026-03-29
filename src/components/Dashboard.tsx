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
