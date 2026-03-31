'use client'

export function Header() {
  return (
    <>
      {/* Main header */}
      <header style={{
        background: '#0D0D0D',
        height: 52,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          <span className="logo" style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            fontSize: 15,
            color: 'white',
            letterSpacing: '0.01em',
          }}>
            NAMKA
          </span>
          <span style={{ color: '#E8380D', fontWeight: 800, fontSize: 15, margin: '0 2px' }}>
            {' //'}
          </span>
          <span className="logo" style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 800,
            fontSize: 15,
            color: 'white',
            letterSpacing: '0.01em',
          }}>
            {' MISSION CONTROL'}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: '#3DFF9A',
              display: 'inline-block',
              animation: 'pulse-green 2s ease-in-out infinite',
            }} />
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 11,
              color: '#3DFF9A',
              letterSpacing: '0.05em',
            }}>
              SYSTEM ONLINE
            </span>
          </div>
          <button className="btn-new" style={{
            background: '#E8380D',
            color: 'white',
            border: 'none',
            borderRadius: 7,
            padding: '6px 14px',
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 12,
            cursor: 'pointer',
          }}>
            + New Project
          </button>
        </div>
      </header>

      {/* Sync bar */}
      <div style={{
        background: '#181818',
        height: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'rgba(255,255,255,0.35)',
          letterSpacing: '0.06em',
        }}>
          V2.0 · NAMKA · JHB_ZA
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 10,
          color: 'rgba(255,255,255,0.35)',
        }}>
          Last GitHub sync: {new Date().toISOString().slice(0, 16).replace('T', ' ')}
        </span>
      </div>
    </>
  )
}
