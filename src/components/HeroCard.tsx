import type { Project } from '@/types/project'

interface HeroCardProps {
  project: Project
}

export function HeroCard({ project }: HeroCardProps) {
  const progress = typeof project.progress === 'number'
    ? project.progress
    : parseInt(project.progress ?? '0') || 0

  return (
    <div style={{
      background: '#0D0D0D',
      borderRadius: 'var(--radius-lg)',
      padding: '22px 24px',
      boxShadow: '0 4px 24px rgba(13,13,13,0.18)',
      marginBottom: 'var(--card-gap)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Red warmth glow top-right */}
      <div style={{
        position: 'absolute',
        top: 0, right: 0,
        width: 200, height: 200,
        background: 'radial-gradient(circle at top right, rgba(232,56,13,0.15), transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Live badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#3DFF9A',
          display: 'inline-block',
          animation: 'pulse-green 2s ease-in-out infinite',
        }} />
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 9,
          color: '#3DFF9A',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          ACTIVE NOW · COMMITTED TODAY
        </span>
      </div>

      {/* Project name */}
      <h2 style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: 800,
        fontSize: 'var(--text-2xl)',
        color: 'white',
        letterSpacing: '-0.01em',
        marginBottom: 6,
      }}>
        {project.name}
      </h2>

      {/* Stack */}
      <p style={{
        fontFamily: 'var(--font-mono)',
        fontSize: 11,
        color: 'rgba(255,255,255,0.38)',
        marginBottom: 16,
        lineHeight: 1.6,
      }}>
        {project.stack}
      </p>

      {/* Progress bar */}
      <div style={{
        height: 3,
        background: 'rgba(255,255,255,0.08)',
        borderRadius: 2,
        marginBottom: 16,
        overflow: 'hidden',
      }}>
        <div className="progress-fill" style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #3DFF9A, #00D4FF)',
          borderRadius: 2,
        }} />
      </div>

      {/* Next step */}
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 13,
        color: 'rgba(255,255,255,0.55)',
        lineHeight: 1.55,
      }}>
        <span style={{ color: '#E8380D', fontWeight: 600, marginRight: 6 }}>Next:</span>
        {project.nextStep}
      </p>
    </div>
  )
}
