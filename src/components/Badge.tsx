interface BadgeProps {
  type: 'effort' | 'status' | 'agent'
  value: string
}

export function Badge({ type, value }: BadgeProps) {
  const classMap: Record<string, string> = {
    // Effort
    S:  'badge badge-effort-s',
    M:  'badge badge-effort-m',
    L:  'badge badge-effort-l',
    XL: 'badge badge-effort-xl',
    // Status
    Active:  'badge badge-status-active',
    active:  'badge badge-status-active',
    Stale:   'badge badge-status-stale',
    stale:   'badge badge-status-stale',
    paused:  'badge badge-status-stale',
    Review:  'badge badge-status-review',
    review:  'badge badge-status-review',
    Done:    'badge badge-status-done',
    done:    'badge badge-status-done',
    complete: 'badge badge-status-done',
    blocked:  'badge badge-effort-xl',
    // Agents
    Claude: 'badge badge-claude',
    Gemini: 'badge badge-gemini',
    Qwen:   'badge badge-qwen',
  }

  const className = classMap[value] ?? 'badge badge-status-stale'

  return <span className={className}>{value}</span>
}
