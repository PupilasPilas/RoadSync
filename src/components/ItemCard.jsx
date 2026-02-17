import { useNavigate } from 'react-router-dom'
import * as Icons from 'lucide-react'
import StatusBadge from './StatusBadge'
import { deptColors, deptNames } from '../data/mockData'

const styles = {
  card: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    cursor: 'pointer',
    transition: 'background 0.15s',
    border: '1px solid var(--border)',
  },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  info: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    fontSize: 14,
    fontWeight: 600,
    marginBottom: 4,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  meta: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
  },
  deptBadge: {
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
  },
}

export default function ItemCard({ item }) {
  const navigate = useNavigate()
  const IconComponent = Icons[item.icon] || Icons.Box
  const deptColor = deptColors[item.dept]

  return (
    <div
      style={styles.card}
      onClick={() => navigate(`/item/${item.id}`)}
      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
      onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
    >
      <div style={{ ...styles.iconWrap, background: `${deptColor}22` }}>
        <IconComponent size={20} color={deptColor} />
      </div>
      <div style={styles.info}>
        <div style={styles.name}>{item.name}</div>
        <div style={styles.meta}>
          <span style={{ ...styles.deptBadge, background: `${deptColor}22`, color: deptColor }}>
            {deptNames[item.dept]}
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{item.id}</span>
        </div>
      </div>
      <StatusBadge status={item.status} />
    </div>
  )
}
