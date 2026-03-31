import type { Project } from '@/types/project'

interface StatGridProps {
  projects: Project[]
}

export function StatGrid({ projects }: StatGridProps) {
  const activeCount  = projects.filter(p => p.status === 'active' || p.status === 'Active').length
  const blockerCount = projects.filter(p => p.blocker).length
  const criticalCount = projects.filter(p => p.priority === 'critical' || p.priorityNum === 1).length

  const progressNums = projects
    .filter(p => p.priority === 'critical' || p.priorityNum === 1)
    .map(p => typeof p.progress === 'number' ? p.progress : parseInt(p.progress ?? '0') || 0)

  const avgProgress = progressNums.length > 0
    ? Math.round(progressNums.reduce((a, b) => a + b, 0) / progressNums.length)
    : 0

  const stats = [
    { value: activeCount,        label: 'ACTIVE',     color: '#16A34A' },
    { value: blockerCount,       label: 'BLOCKERS',   color: blockerCount > 0 ? '#DC2626' : 'var(--ink)' },
    { value: criticalCount,      label: 'P1 OPEN',    color: '#D97706' },
    { value: `${avgProgress}%`,  label: 'SPRINT',     color: '#2563EB' },
  ]

  return (
    <div className="stat-grid" style={{ paddingBottom: 16 }}>
      {stats.map(s => (
        <div key={s.label} className="stat-mini">
          <div className="stat-mini-value" style={{ color: s.color }}>{s.value}</div>
          <div className="stat-mini-label">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
