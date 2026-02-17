import { useNavigate } from 'react-router-dom'
import { Truck } from 'lucide-react'
import ProgressBar from './ProgressBar'

const statusMap = {
  open: { label: 'Abierto', color: 'var(--status-pending)' },
  complete: { label: 'Carga completa', color: 'var(--status-ok)' },
  transit: { label: 'En tránsito', color: 'var(--accent-yellow)' },
}

const styles = {
  card: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 16,
    cursor: 'pointer',
    border: '1px solid var(--border)',
    transition: 'background 0.15s',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    background: 'var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: 600,
  },
  assign: {
    fontSize: 12,
    color: 'var(--text-muted)',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    fontSize: 12,
  },
}

export default function TruckCard({ truck, compact = false }) {
  const navigate = useNavigate()
  const st = statusMap[truck.status]

  return (
    <div
      style={{ ...styles.card, minWidth: compact ? 260 : undefined }}
      onClick={() => navigate(`/truck/${truck.id}`)}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
    >
      <div style={styles.header}>
        <div style={styles.iconWrap}>
          <Truck size={20} color="var(--text-muted)" />
        </div>
        <div>
          <div style={styles.name}>{truck.name}</div>
          <div style={styles.assign}>{truck.assignedTo}</div>
        </div>
      </div>
      <ProgressBar progress={truck.progress} />
      <div style={styles.footer}>
        <span style={{ color: 'var(--text-muted)' }}>
          {truck.loaded} de {truck.capacity} ítems
        </span>
        <span style={{
          fontSize: 11,
          fontWeight: 600,
          padding: '2px 8px',
          borderRadius: 10,
          background: `${st.color}22`,
          color: st.color,
          textTransform: 'uppercase',
        }}>
          {st.label}
        </span>
      </div>
    </div>
  )
}
