interface StatusLabelProps {
  status: string
}

const STATUS_COLORS: Record<string, string> = {
  Active:     '#16A34A',
  active:     '#16A34A',
  Processing: '#2563EB',
  Standby:    '#9CA3AF',
  Idle:       '#D1D5DB',
  Stale:      '#D97706',
  stale:      '#D97706',
  paused:     '#D97706',
  Done:       '#16A34A',
  done:       '#16A34A',
  complete:   '#16A34A',
  Review:     '#2563EB',
  review:     '#2563EB',
  blocked:    '#DC2626',
}

export function StatusLabel({ status }: StatusLabelProps) {
  const color = STATUS_COLORS[status] ?? '#9CA3AF'
  const isActive = status === 'Active' || status === 'active'

  return (
    <span className={`status-label ${isActive ? 'active' : ''}`} style={{ color }}>
      <span className="status-dot" />
      {status}
    </span>
  )
}
