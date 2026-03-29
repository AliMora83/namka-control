import { parseMaster } from "@/lib/parseMaster";
import { ProjectCard } from "@/components/ProjectCard";
import { 
  FolderKanban, 
  Activity, 
  Settings, 
  Bell, 
  Search, 
  Terminal,
  Zap,
  Globe
} from "lucide-react";
import Link from "next/link";

async function getMasterData() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${baseUrl}/api/master`, { 
      next: { revalidate: 60 },
      cache: 'no-store'
    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error("Master.md fetch failed:", errorData.error || res.statusText);
      return null;
    }
    const { raw } = await res.json();
    return parseMaster(raw);
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    return null;
  }
}

export async function Dashboard() {
  const data = await getMasterData();
  
  if (!data) {
    return (
      <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse border border-red-500/20">
          <Activity className="text-red-500 w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Signal Interrupted</h1>
        <p className="text-slate-400 max-w-sm mb-8 leading-relaxed">
          The Mission Control center is having trouble reaching the GitHub satellites. 
          Check your <code className="text-blue-400">GITHUB_TOKEN</code> in your environment vault.
        </p>
        <Link 
          href="/"
          className="px-8 py-3 bg-white text-slate-950 font-bold rounded-full hover:bg-slate-200 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95"
        >
          Re-establish Link
        </Link>
      </main>
    );
  }

  const topProjects = data.projects;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 flex selection:bg-blue-500/30">
      {/* Premium Sidebar */}
      <aside className="w-64 border-r border-slate-800/40 bg-[#020617]/50 backdrop-blur-2xl hidden lg:flex flex-col p-6 sticky top-0 h-screen z-20">
        <div className="flex items-center gap-3 mb-10 group cursor-default">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform">
            <Terminal className="text-white w-6 h-6" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg leading-none text-white">Namka</span>
            <span className="text-[10px] text-blue-400 font-bold tracking-[0.2em] uppercase">Control</span>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1">
          <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">Core Operations</div>
          <NavItem icon={<Activity size={18} />} label="Overview" active />
          <NavItem icon={<FolderKanban size={18} />} label="Portfolio" />
          <NavItem icon={<Zap size={18} />} label="Automation" />
          <NavItem icon={<Globe size={18} />} label="Network" />
          
          <div className="pt-8 text-[10px] font-bold text-slate-600 uppercase tracking-widest px-3 mb-3">User Space</div>
          <NavItem icon={<Bell size={18} />} label="Alerts" count={2} />
          <NavItem icon={<Settings size={18} />} label="Preferences" />
        </nav>

        <div className="pt-6 mt-auto">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 border border-slate-700/50 shadow-inner">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-lg border-2 border-slate-800">
                AM
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Administrator</p>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Mission Control Area */}
      <main className="flex-1 overflow-y-auto relative">
        {/* Subtle ambient light */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] pointer-events-none" />
        
        {/* Top Navbar */}
        <header className="h-16 border-b border-white/[0.03] flex items-center justify-between px-8 bg-[#020617]/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-6 w-full max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <input 
                type="text" 
                placeholder="Search projects, logs, or agents..." 
                className="bg-slate-900/40 border border-slate-800/50 rounded-full py-2 pl-10 pr-4 text-xs text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 w-64 md:w-80 transition-all font-medium"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Global Sync</p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-blue-400 font-mono">STABLE // 200 OK</span>
                <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.6)]" />
              </div>
            </div>
            <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors">
              <Bell size={16} />
            </button>
          </div>
        </header>

        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto space-y-12">
          {/* Hero Section */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-4 border-b border-white/[0.03]">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                <Zap size={10} /> Active Operations
              </div>
              <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-none">
                Mission <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">Control</span>
              </h1>
              <p className="text-slate-400 text-lg max-w-2xl font-medium leading-relaxed">
                Phase {data.phase.current} — <span className="text-white">{data.phase.label}</span>. 
                Synchronized across <span className="text-white">{data.projects.length}</span> critical vectors.
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-slate-900/50 border border-white/[0.03] p-4 rounded-2xl min-w-[140px] group hover:border-blue-500/30 transition-colors">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Build Variant</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white tracking-tighter">v{data.version}</span>
                  <span className="text-[10px] font-bold text-blue-500 uppercase">Master</span>
                </div>
              </div>
              <div className="bg-slate-900/50 border border-white/[0.03] p-4 rounded-2xl min-w-[140px] group hover:border-blue-500/30 transition-colors">
                <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-2">Sync Time</p>
                <p className="text-xl font-bold text-white tabular-nums">{data.lastUpdated}</p>
              </div>
            </div>
          </div>

          {/* Project Dashboard Grid */}
          <section className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-white tracking-tight">Focus Portfolio</h2>
                <p className="text-sm text-slate-500 font-medium">Prioritized systems requiring immediate attention.</p>
              </div>
              <div className="flex items-center gap-2 bg-slate-900/50 p-1.5 rounded-xl border border-white/[0.03]">
                <button className="px-4 py-1.5 rounded-lg bg-blue-600 text-xs font-bold text-white shadow-lg">Grid View</button>
                <button className="px-4 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:text-white transition-colors">System List</button>
              </div>
            </div>
            
            {topProjects.length === 0 ? (
              <div className="bg-slate-900/30 rounded-[2.5rem] p-24 text-center border-2 border-dashed border-white/[0.03]">
                <div className="w-16 h-16 bg-slate-800/50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
                  <FolderKanban size={32} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Zero Active Signal</h3>
                <p className="text-slate-500 max-w-xs mx-auto text-sm leading-relaxed"> No projects matched your current mission filters in Master.md.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {topProjects.map((project, idx) => (
                  <div key={project.id} className="animate-in fade-in slide-in-from-bottom-4 duration-700 fill-mode-both" style={{ animationDelay: `${idx * 100}ms` }}>
                    <ProjectCard project={project} />
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Footer Metadata */}
          <footer className="pt-20 pb-4 flex flex-col items-center justify-center gap-6">
            <div className="flex items-center gap-6 text-[10px] font-bold text-slate-600 uppercase tracking-[0.3em]">
              <span className="hover:text-white transition-colors cursor-pointer">Security Protocol 7.21</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="hover:text-white transition-colors cursor-pointer">MACP Compliant</span>
              <span className="w-1 h-1 rounded-full bg-slate-800" />
              <span className="hover:text-white transition-colors cursor-pointer">Neural Handshake Active</span>
            </div>
            <p className="text-[10px] text-slate-700 font-mono tracking-tighter">
              {`> SYSTEM_READY // DATA_SYNCED // AGENT:ANTIGRAVITY // DATE:${data.lastUpdated} // TZ:CAT`}
            </p>
          </footer>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, count = 0 }: { icon: React.ReactNode, label: string, active?: boolean, count?: number }) {
  return (
    <Link 
      href="#" 
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 group relative ${
        active 
          ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_8px_16px_-4px_rgba(37,99,235,0.4)] translate-x-1' 
          : 'text-slate-500 hover:text-white hover:bg-white/[0.03]'
      }`}
    >
      <span className={`${active ? 'text-white' : 'text-slate-600 group-hover:text-blue-400'} transition-colors duration-300`}>
        {icon}
      </span>
      <span className="text-sm font-bold tracking-tight">{label}</span>
      {count > 0 && (
        <span className="ml-auto w-5 h-5 flex items-center justify-center bg-red-500 text-[10px] font-black text-white rounded-full border-2 border-[#020617] group-hover:scale-110 transition-transform">
          {count}
        </span>
      )}
      {active && (
        <div className="absolute left-[-2px] top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]" />
      )}
    </Link>
  );
}
