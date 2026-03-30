import { parseMaster } from "@/lib/parseMaster";
import { ProjectCard } from "@/components/ProjectCard";
import { ErrorCard } from "@/components/ErrorCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";

interface FetchResult {
  data: ReturnType<typeof parseMaster> | null;
  error: string | null;
  detail?: string;
}

async function getMasterData(): Promise<FetchResult> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/master`, { next: { revalidate: 60 } });
    const json = await res.json();

    if (!res.ok || json.error) {
      return { data: null, error: json.error ?? "Failed to fetch data", detail: json.detail };
    }

    return { data: parseMaster(json.raw, json.projectsRaw), error: null };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return { data: null, error: "Network error", detail: message };
  }
}

export async function Dashboard() {
  const { data, error, detail } = await getMasterData();
  const topProjects = data?.projects.slice(0, 5) ?? [];

  return (
    <ErrorBoundary
      fallback={
        <ErrorCard
          title="Dashboard error"
          message="An unexpected error occurred. Please refresh the page."
        />
      }
    >
      <main className="min-h-screen bg-slate-50 p-6 md:p-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <span className="text-2xl">🛸</span>
            <h1 className="text-2xl font-bold text-slate-800">Namka Control</h1>
          </div>
          <p className="text-sm text-slate-500">
            {data ? (
              <>
                Phase {data.phase.current} — {data.phase.label}&nbsp;·&nbsp;
                Master.md v{data.version}&nbsp;·&nbsp;
                Updated {data.lastUpdated}
              </>
            ) : (
              "Dashboard data unavailable"
            )}
          </p>
        </div>

        {/* Project Grid */}
        <section>
          <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mb-4">
            Focus Projects ({topProjects.length})
          </h2>
          {error ? (
            <ErrorCard
              title="Could not load projects"
              message="The dashboard was unable to fetch project data from GitHub. This may be a temporary API issue."
              detail={detail}
            />
          ) : topProjects.length === 0 ? (
            <p className="text-sm text-slate-400">No projects found.</p>
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
          Data sourced live from Master.md via GitHub API · Namka Control ·{" "}
          {data?.lastUpdated ?? "—"}
        </footer>
      </main>
    </ErrorBoundary>
  );
}
