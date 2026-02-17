import { MapPin, Calendar, MessageSquare } from 'lucide-react'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import ProgressBar from '../components/ProgressBar'
import TruckCard from '../components/TruckCard'
import ItemCard from '../components/ItemCard'
import { useAuth } from '../context/AuthContext'
import { show, departments, trucks, items, deptNames, deptColors } from '../data/mockData'

const phases = ['Descarga', 'Montaje', 'Desmontaje', 'Carga']

const styles = {
  showInfo: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 16,
    marginBottom: 16,
    border: '1px solid var(--border)',
  },
  showName: {
    fontSize: 18,
    fontWeight: 700,
    marginBottom: 6,
  },
  showMeta: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    fontSize: 12,
    color: 'var(--text-muted)',
    marginBottom: 14,
  },
  metaItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  phases: {
    display: 'flex',
    gap: 8,
    marginBottom: 16,
  },
  phaseChip: {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    letterSpacing: '0.3px',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    marginBottom: 12,
  },
  overallProgress: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 16,
    marginBottom: 16,
    border: '1px solid var(--border)',
  },
  deptRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 0',
  },
  deptName: {
    width: 90,
    fontSize: 13,
    fontWeight: 500,
  },
  deptDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  truckScroll: {
    display: 'flex',
    gap: 12,
    overflowX: 'auto',
    paddingBottom: 8,
    margin: '0 -16px',
    padding: '0 16px 8px',
  },
  counterRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 16,
  },
  counterCard: {
    flex: 1,
    background: 'var(--surface)',
    borderRadius: 'var(--radius-sm)',
    padding: '14px 10px',
    textAlign: 'center',
    border: '1px solid var(--border)',
  },
  counterNum: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 2,
  },
  counterLabel: {
    fontSize: 10,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  notesPlaceholder: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 20,
    border: '1px solid var(--border)',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: 13,
  },
}

function ShowInfo() {
  return (
    <div style={styles.showInfo} className="fade-in">
      <div style={styles.showName}>{show.name}</div>
      <div style={styles.showMeta}>
        <span style={styles.metaItem}><MapPin size={14} /> {show.city} — {show.venue}</span>
        <span style={styles.metaItem}><Calendar size={14} /> {show.date}</span>
      </div>
      <div style={styles.phases}>
        {phases.map(p => (
          <span
            key={p}
            style={{
              ...styles.phaseChip,
              background: p === show.phase ? 'var(--accent-red)' : 'var(--border)',
              color: p === show.phase ? '#fff' : 'var(--text-muted)',
            }}
          >
            {p}
          </span>
        ))}
      </div>
    </div>
  )
}

function GlobalDashboard() {
  return (
    <>
      <ShowInfo />

      <div style={styles.overallProgress} className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Progreso General</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-yellow)' }}>{show.overallProgress}%</span>
        </div>
        <ProgressBar progress={show.overallProgress} height={10} />
      </div>

      <div style={styles.section} className="fade-in">
        <div style={styles.sectionTitle}>Por Departamento</div>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '6px 16px', border: '1px solid var(--border)' }}>
          {departments.map(dept => (
            <div key={dept.id} style={styles.deptRow}>
              <div style={{ ...styles.deptDot, background: dept.color }} />
              <div style={styles.deptName}>{dept.name}</div>
              <div style={{ flex: 1 }}>
                <ProgressBar progress={dept.progress} color={dept.color} height={6} showLabel />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section} className="fade-in">
        <div style={styles.sectionTitle}>Camiones</div>
        <div style={styles.truckScroll}>
          {trucks.map(t => <TruckCard key={t.id} truck={t} compact />)}
        </div>
      </div>
    </>
  )
}

function DeptDashboard({ dept }) {
  const deptItems = items.filter(i => i.dept === dept)
  const pending = deptItems.filter(i => i.status === 'pending').length
  const ready = deptItems.filter(i => i.status === 'ready-to-load').length
  const loaded = deptItems.filter(i => i.status === 'loaded').length
  const total = deptItems.length
  const progress = total > 0 ? Math.round((loaded / total) * 100) : 0

  return (
    <>
      <ShowInfo />

      <div style={styles.overallProgress} className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Progreso — {deptNames[dept]}</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: deptColors[dept] }}>{progress}%</span>
        </div>
        <ProgressBar progress={progress} color={deptColors[dept]} height={10} />
      </div>

      <div style={styles.counterRow} className="fade-in">
        <div style={styles.counterCard}>
          <div style={{ ...styles.counterNum, color: 'var(--status-pending)' }}>{pending}</div>
          <div style={styles.counterLabel}>Pendiente</div>
        </div>
        <div style={styles.counterCard}>
          <div style={{ ...styles.counterNum, color: 'var(--status-ready)' }}>{ready}</div>
          <div style={styles.counterLabel}>Listo</div>
        </div>
        <div style={styles.counterCard}>
          <div style={{ ...styles.counterNum, color: 'var(--status-ok)' }}>{loaded}</div>
          <div style={styles.counterLabel}>Cargado</div>
        </div>
      </div>

      <div style={styles.section} className="fade-in">
        <div style={styles.sectionTitle}>Ítems de {deptNames[dept]} ({total})</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {deptItems.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      </div>

      <div style={styles.section} className="fade-in">
        <div style={styles.sectionTitle}>
          <MessageSquare size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
          Anotaciones
        </div>
        <div style={styles.notesPlaceholder}>
          Las anotaciones del departamento aparecerán aquí
        </div>
      </div>
    </>
  )
}

export default function Dashboard() {
  const { currentUser } = useAuth()
  const isDeptLead = currentUser?.role === 'dept-lead'

  return (
    <>
      <TopBar title="RoadSync" />
      <div className="page">
        {isDeptLead ? (
          <DeptDashboard dept={currentUser.dept} />
        ) : (
          <GlobalDashboard />
        )}
      </div>
      <BottomNav />
    </>
  )
}
