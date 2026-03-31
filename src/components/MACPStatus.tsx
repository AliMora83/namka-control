const STEPS = [
  { label: 'Unreviewed',     state: 'done'    },
  { label: 'Agent Reviewed', state: 'done'    },
  { label: 'Cross-Checked',  state: 'done'    },
  { label: 'Ratified',       state: 'current' },
]

export function MACPStatus() {
  return (
    <div className="sidebar-panel">
      <div className="panel-title">MACP Status</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {STEPS.map((step) => (
          <div key={step.label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              width: 10, height: 10,
              borderRadius: '50%',
              flexShrink: 0,
              display: 'inline-block',
              background: step.state === 'done' ? '#16A34A' : step.state === 'current' ? '#D97706' : 'var(--border2)',
              animation: step.state === 'current' ? 'pulse-amber 2s ease-in-out infinite' : 'none',
            }} />
            <span style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 12,
              color: step.state === 'pending' ? 'var(--ink-dim)' : 'var(--ink-mid)',
              fontWeight: step.state === 'current' ? 600 : 400,
            }}>
              {step.label}
            </span>
            {step.state === 'done' && (
              <span style={{ marginLeft: 'auto', fontSize: 10, color: '#16A34A' }}>✓</span>
            )}
            {step.state === 'current' && (
              <span style={{ marginLeft: 'auto', fontSize: 9, fontFamily: 'var(--font-mono)', color: '#D97706', letterSpacing: '0.06em' }}>NOW</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
