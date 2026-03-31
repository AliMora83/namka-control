import { parseMaster } from "@/lib/parseMaster";
import { Header } from "@/components/Header";
import { HeroCard } from "@/components/HeroCard";
import { ProjectCard } from "@/components/ProjectCard";
import { StatGrid } from "@/components/StatGrid";
import { MACPStatus } from "@/components/MACPStatus";
import { ErrorCard } from "@/components/ErrorCard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import type { Project } from "@/types/project";

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

/** Maps the parser's priority string to a numeric tier (1–4) */
function toPriorityNum(priority: string): number {
  switch (priority) {
    case "critical": return 1;
    case "high":     return 2;
    case "medium":   return 3;
    default:         return 4;
  }
}

export async function Dashboard() {
  const { data, error, detail } = await getMasterData();

  const allProjects: Project[] = (data?.projects ?? []).map(p => ({
    ...p,
    priorityNum: toPriorityNum(p.priority),
  }));

  const p1Projects = allProjects.filter(p => p.priorityNum === 1);
  const p2Projects = allProjects.filter(p => p.priorityNum === 2);
  const p3Projects = allProjects.filter(p => p.priorityNum === 3);
  const p4Projects = allProjects.filter(p => (p.priorityNum ?? 4) >= 4);

  return (
    <ErrorBoundary
      fallback={
        <ErrorCard
          title="Dashboard error"
          message="An unexpected error occurred. Please refresh the page."
        />
      }
    >
      <Header />

      <div className="layout">
        {/* ── Main panel ── */}
        <main className="main-panel">

          {error ? (
            <ErrorCard
              title="Could not load projects"
              message="The dashboard was unable to fetch project data from GitHub. This may be a temporary API issue."
              detail={detail}
            />
          ) : allProjects.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 320,
              gap: 12,
            }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: 'var(--text-sm)', color: 'var(--ink-dim)' }}>
                No projects found in Active-Projects.md
              </p>
            </div>
          ) : (
            <>
              {/* P1 — SHIP NOW */}
              {p1Projects.length > 0 && (
                <div style={{ marginBottom: 'var(--section-gap)' }}>
                  <div className="priority-header tier-1">
                    <span className="priority-title">P1 — Ship Now</span>
                    <span className="priority-meta">{p1Projects.length} PROJECT{p1Projects.length !== 1 ? 'S' : ''}</span>
                  </div>
                  {p1Projects[0] && <HeroCard project={p1Projects[0]} />}
                  {p1Projects.length > 1 && (
                    <div className="project-grid grid-2">
                      {p1Projects.slice(1).map((p, i) => (
                        <ProjectCard key={p.id} project={p} index={i + 2} />
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* P2 — ACTIVE DEVELOPMENT */}
              {p2Projects.length > 0 && (
                <div style={{ marginBottom: 'var(--section-gap)' }}>
                  <div className="priority-header tier-2">
                    <span className="priority-title">P2 — Active Development</span>
                    <span className="priority-meta">{p2Projects.length} PROJECT{p2Projects.length !== 1 ? 'S' : ''}</span>
                  </div>
                  <div className="project-grid grid-3">
                    {p2Projects.map((p, i) => (
                      <ProjectCard key={p.id} project={p} index={p1Projects.length + i + 1} />
                    ))}
                  </div>
                </div>
              )}

              {/* P3 — MAINTENANCE / CLIENT */}
              {p3Projects.length > 0 && (
                <div style={{ marginBottom: 'var(--section-gap)' }}>
                  <div className="priority-header tier-3">
                    <span className="priority-title">P3 — Maintenance / Client</span>
                    <span className="priority-meta">{p3Projects.length} PROJECT{p3Projects.length !== 1 ? 'S' : ''}</span>
                  </div>
                  <div className="project-grid grid-3">
                    {p3Projects.map((p, i) => (
                      <ProjectCard key={p.id} project={p} index={p1Projects.length + p2Projects.length + i + 1} />
                    ))}
                  </div>
                </div>
              )}

              {/* P4 — BACKLOG */}
              {p4Projects.length > 0 && (
                <div style={{ marginBottom: 'var(--section-gap)' }}>
                  <div className="priority-header tier-4">
                    <span className="priority-title">P4 — Backlog</span>
                    <span className="priority-meta">{p4Projects.length} PROJECT{p4Projects.length !== 1 ? 'S' : ''}</span>
                  </div>
                  <div className="project-grid grid-3">
                    {p4Projects.map((p, i) => (
                      <ProjectCard key={p.id} project={p} index={p1Projects.length + p2Projects.length + p3Projects.length + i + 1} />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Footer */}
          <footer style={{
            marginTop: 40,
            paddingTop: 16,
            borderTop: '1px solid var(--border)',
            fontFamily: 'var(--font-mono)',
            fontSize: 'var(--text-xs)',
            color: 'var(--ink-placeholder)',
            textAlign: 'center',
          }}>
            {data ? (
              <>
                {data.phase.label} · Master.md v{data.version} · Updated {data.lastUpdated}
              </>
            ) : (
              'Data sourced from Active-Projects.md via GitHub API · Namka Mission Control'
            )}
          </footer>
        </main>

        {/* ── Sidebar ── */}
        <aside className="sidebar">
          <StatGrid projects={allProjects} />
          <MACPStatus />
        </aside>
      </div>
    </ErrorBoundary>
  );
}
