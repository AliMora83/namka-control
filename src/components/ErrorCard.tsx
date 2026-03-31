interface ErrorCardProps {
  title: string
  message: string
  detail?: string
}

export function ErrorCard({ title, message, detail }: ErrorCardProps) {
  return (
    <div style={{
      background: 'var(--danger-bg)',
      border: '1px solid var(--danger-border)',
      borderLeft: '3px solid var(--danger)',
      borderRadius: 'var(--radius-md)',
      padding: '14px 16px',
      margin: '12px 0',
    }}>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        fontSize: 'var(--text-base)',
        color: 'var(--danger)',
        marginBottom: 4,
      }}>
        {title}
      </p>
      <p style={{
        fontFamily: 'var(--font-sans)',
        fontSize: 'var(--text-sm)',
        color: 'var(--ink-mid)',
        lineHeight: 1.5,
      }}>
        {message}
      </p>
      {detail && (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 'var(--text-xs)',
          color: 'var(--ink-dim)',
          marginTop: 8,
        }}>
          {detail}
        </p>
      )}
    </div>
  )
}
