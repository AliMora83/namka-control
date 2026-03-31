import type { Project } from '@/types/project'
import { Badge } from './Badge'
import { StatusLabel } from './StatusLabel'

interface ProjectCardProps {
  project: Project
  index: number
}

export function ProjectCard({ project, index }: ProjectCardProps) {
  const cardClass = [
    'project-card',
    project.blocker ? 'has-blocker' : '',
    project.status === 'Stale' || project.status === 'paused' ? 'stale' : '',
    project.status === 'Done' || project.status === 'complete' ? 'done' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={cardClass}>
      {/* Card header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 7 }}>
          <span className="card-number" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: 10,
            color: 'var(--ink-dim)',
            flexShrink: 0,
          }}>
            {index}.
          </span>
          <span style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 700,
            fontSize: 'var(--text-md)',
            color: 'var(--ink)',
            lineHeight: 1.3,
          }}>
            {project.name}
          </span>
        </div>
        <span style={{
          fontFamily: 'var(--font-sans)',
          fontSize: 11,
          color: 'var(--ink-placeholder)',
          flexShrink: 0,
          paddingLeft: 4,
        }}>
          Open →
        </span>
      </div>

      {/* Stack */}
      <p className="card-stack" style={{
        fontSize: 'var(--text-sm)',
        color: 'var(--ink-dim)',
        lineHeight: 1.6,
        marginBottom: 10,
      }}>
        {project.stack}
      </p>

      {/* Blocker strip */}
      {project.blocker && (
        <div className="card-blocker">
          <span>⚠</span>
          <span>{project.blocker}</span>
        </div>
      )}

      {/* Next step */}
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-base)',
        color: 'var(--ink-mid)',
        lineHeight: 1.55,
        flexGrow: 1,
        marginBottom: 14,
      }}>
        {project.nextStep}
      </p>

      {/* Footer: badges + status */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 6,
        marginTop: 'auto',
      }}>
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {project.effort && <Badge type="effort" value={project.effort} />}
          {project.agents?.map(agent => (
            <Badge key={agent} type="agent" value={agent.split('(')[0].trim()} />
          ))}
        </div>
        <StatusLabel status={project.status} />
      </div>
    </div>
  )
}
