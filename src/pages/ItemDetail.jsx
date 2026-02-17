import { useParams } from 'react-router-dom'
import { Hash, Layers, Clock, Edit2, MessageSquare } from 'lucide-react'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { items, deptNames, deptColors, movementHistory, users } from '../data/mockData'

const getUserName = (userId) => {
  const user = users.find(u => u.id === userId)
  return user ? user.name : userId
}

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: 24,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 8,
  },
  itemId: {
    fontSize: 13,
    color: 'var(--text-muted)',
    marginBottom: 16,
  },
  qrContainer: {
    width: 140,
    height: 140,
    margin: '0 auto 20px',
    background: '#fff',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qrGrid: {
    width: 100,
    height: 100,
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridTemplateRows: 'repeat(7, 1fr)',
    gap: 2,
  },
  infoCard: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 16,
    marginBottom: 16,
    border: '1px solid var(--border)',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
  },
  infoLabel: {
    fontSize: 12,
    color: 'var(--text-muted)',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 500,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    marginBottom: 12,
  },
  timeline: {
    position: 'relative',
    paddingLeft: 24,
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: 20,
    paddingLeft: 16,
  },
  timelineDot: {
    position: 'absolute',
    left: -6,
    top: 4,
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: '2px solid var(--accent-red)',
    background: 'var(--bg)',
  },
  timelineLine: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 0,
    width: 1,
    background: 'var(--border)',
  },
  timeAction: {
    fontSize: 14,
    fontWeight: 500,
  },
  timeMeta: {
    fontSize: 12,
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  notesPlaceholder: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 20,
    border: '1px solid var(--border)',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: 13,
    marginBottom: 16,
  },
}

function QRCode() {
  const pattern = [
    1,1,1,0,1,1,1,
    1,0,1,1,1,0,1,
    1,1,1,0,1,1,1,
    0,1,0,1,0,1,0,
    1,1,1,0,1,1,1,
    1,0,1,0,1,0,1,
    1,1,1,0,1,1,1,
  ]
  return (
    <div style={styles.qrContainer}>
      <div style={styles.qrGrid}>
        {pattern.map((filled, i) => (
          <div key={i} style={{ background: filled ? '#000' : '#fff', borderRadius: 1 }} />
        ))}
      </div>
    </div>
  )
}

export default function ItemDetail() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const item = items.find(i => i.id === id)
  const role = currentUser?.role

  if (!item) {
    return (
      <>
        <TopBar title="Detalle" showBack />
        <div className="page" style={{ textAlign: 'center', paddingTop: 100 }}>
          <p style={{ color: 'var(--text-muted)' }}>Ítem no encontrado</p>
        </div>
        <BottomNav />
      </>
    )
  }

  const canEdit = role === 'admin' || (role === 'dept-lead' && item.dept === currentUser.dept)

  const history = movementHistory[item.id] || [
    { action: 'Descargado', userId: 'juan', time: '14:30' },
    { action: 'En posición montaje', userId: 'maria', time: '16:00' },
    { action: 'Desmontado', userId: 'carlos', time: '21:30' },
  ]

  return (
    <>
      <TopBar
        title={item.id}
        showBack
        actions={canEdit ? (
          <button>
            <Edit2 size={18} color="var(--text-muted)" />
          </button>
        ) : undefined}
      />
      <div className="page">
        <div style={styles.header} className="fade-in">
          <div style={styles.itemName}>{item.name}</div>
          <div style={styles.itemId}>{item.id}</div>
          <StatusBadge status={item.status} large />
        </div>

        <QRCode />

        <div style={styles.infoCard} className="fade-in">
          <div style={styles.infoRow}>
            <Layers size={16} color="var(--text-muted)" />
            <span style={styles.infoLabel}>Departamento</span>
            <span style={{ ...styles.infoValue, color: deptColors[item.dept] }}>{deptNames[item.dept]}</span>
          </div>
          <div style={{ ...styles.infoRow, borderBottom: 'none' }}>
            <Hash size={16} color="var(--text-muted)" />
            <span style={styles.infoLabel}>Tipo</span>
            <span style={styles.infoValue}>{item.type}</span>
          </div>
        </div>

        <div className="fade-in" style={{ marginBottom: 20 }}>
          <div style={styles.sectionTitle}>
            <MessageSquare size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Anotaciones
          </div>
          <div style={styles.notesPlaceholder}>
            Las anotaciones aparecerán aquí
          </div>
        </div>

        <div className="fade-in">
          <div style={styles.sectionTitle}>
            <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Historial de Movimientos
          </div>
          <div style={styles.timeline}>
            {history.map((entry, i) => (
              <div key={i} style={styles.timelineItem}>
                <div style={styles.timelineDot} />
                {i < history.length - 1 && <div style={styles.timelineLine} />}
                <div style={styles.timeAction}>{entry.action}</div>
                <div style={styles.timeMeta}>{getUserName(entry.userId)} — {entry.time}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
