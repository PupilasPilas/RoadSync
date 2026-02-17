import { useParams } from 'react-router-dom'
import { Truck, CheckCircle, AlertTriangle, Edit2, MessageSquare } from 'lucide-react'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import ProgressBar from '../components/ProgressBar'
import ItemCard from '../components/ItemCard'
import { useAuth } from '../context/AuthContext'
import { trucks, items } from '../data/mockData'

const statusMap = {
  open: { label: 'Abierto', color: 'var(--status-pending)' },
  complete: { label: 'Carga completa', color: 'var(--status-ok)' },
  transit: { label: 'En tránsito', color: 'var(--accent-yellow)' },
}

const styles = {
  header: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 20,
    marginBottom: 16,
    border: '1px solid var(--border)',
    textAlign: 'center',
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 14,
    background: 'var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  truckName: {
    fontSize: 20,
    fontWeight: 700,
    marginBottom: 4,
  },
  assign: {
    fontSize: 13,
    color: 'var(--text-muted)',
    marginBottom: 16,
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: 32,
    marginTop: 16,
  },
  stat: {
    textAlign: 'center',
  },
  statNum: {
    fontSize: 24,
    fontWeight: 700,
  },
  statLabel: {
    fontSize: 11,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  verifyBtn: {
    width: '100%',
    padding: '14px 0',
    borderRadius: 'var(--radius)',
    background: 'var(--status-ok)',
    fontSize: 14,
    fontWeight: 700,
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 16,
  },
  missing: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 14px',
    background: 'rgba(227,6,19,0.1)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid rgba(227,6,19,0.2)',
    marginBottom: 16,
    fontSize: 13,
    color: 'var(--status-error)',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    marginBottom: 12,
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

export default function TruckDetail() {
  const { id } = useParams()
  const { currentUser } = useAuth()
  const truck = trucks.find(t => t.id === id)
  const isAdmin = currentUser?.role === 'admin'

  if (!truck) {
    return (
      <>
        <TopBar title="Camión" showBack />
        <div className="page" style={{ textAlign: 'center', paddingTop: 100 }}>
          <p style={{ color: 'var(--text-muted)' }}>Camión no encontrado</p>
        </div>
        <BottomNav />
      </>
    )
  }

  const truckItems = items.filter(i => i.truck === truck.id)
  const missingItems = truckItems.filter(i => i.status === 'missing' || i.status === 'pending' || i.status === 'ready-to-load')
  const st = statusMap[truck.status]

  return (
    <>
      <TopBar
        title={truck.name}
        showBack
        actions={isAdmin ? (
          <button>
            <Edit2 size={18} color="var(--text-muted)" />
          </button>
        ) : undefined}
      />
      <div className="page">
        <div style={styles.header} className="fade-in">
          <div style={styles.iconWrap}>
            <Truck size={26} color="var(--text-muted)" />
          </div>
          <div style={styles.truckName}>{truck.name}</div>
          <div style={styles.assign}>{truck.assignedTo}</div>
          <span style={{
            display: 'inline-block',
            fontSize: 11,
            fontWeight: 600,
            padding: '4px 12px',
            borderRadius: 20,
            background: `${st.color}22`,
            color: st.color,
            textTransform: 'uppercase',
          }}>
            {st.label}
          </span>
          <div style={{ marginTop: 16 }}>
            <ProgressBar progress={truck.progress} height={10} showLabel />
          </div>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statNum}>{truck.loaded}</div>
              <div style={styles.statLabel}>Cargados</div>
            </div>
            <div style={styles.stat}>
              <div style={{ ...styles.statNum, color: missingItems.length > 0 ? 'var(--status-error)' : 'var(--status-ok)' }}>
                {missingItems.length}
              </div>
              <div style={styles.statLabel}>Faltantes</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNum}>{truck.capacity}</div>
              <div style={styles.statLabel}>Total</div>
            </div>
          </div>
        </div>

        {missingItems.length > 0 && (
          <div style={styles.missing} className="fade-in">
            <AlertTriangle size={16} />
            {missingItems.length} ítem(s) pendientes de carga
          </div>
        )}

        {isAdmin && (
          <button style={styles.verifyBtn}>
            <CheckCircle size={18} />
            Verificar carga completa
          </button>
        )}

        <div style={{ marginBottom: 20 }} className="fade-in">
          <div style={styles.sectionTitle}>
            <MessageSquare size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Anotaciones
          </div>
          <div style={styles.notesPlaceholder}>
            Las anotaciones del camión aparecerán aquí
          </div>
        </div>

        <div style={styles.sectionTitle}>Ítems asignados ({truckItems.length})</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {truckItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  )
}
