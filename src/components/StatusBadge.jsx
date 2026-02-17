import { statusLabels, statusColors } from '../data/mockData'

export default function StatusBadge({ status, large = false }) {
  const color = statusColors[status] || 'var(--text-muted)'
  const label = statusLabels[status] || status

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: large ? '6px 14px' : '3px 10px',
        borderRadius: 20,
        fontSize: large ? 13 : 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        background: `${color}22`,
        color: color,
        border: `1px solid ${color}44`,
      }}
    >
      {label}
    </span>
  )
}
