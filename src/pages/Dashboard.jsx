import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Calendar, MessageSquare, AlertTriangle, RotateCcw } from 'lucide-react'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import ProgressBar from '../components/ProgressBar'
import TruckCard from '../components/TruckCard'
import ItemCard from '../components/ItemCard'
import { useAuth } from '../context/AuthContext'
import { usePhase } from '../context/PhaseContext'
import { useItems } from '../context/ItemsContext'
import { useTrucks } from '../context/TrucksContext'
import { show, departments, deptNames, deptColors } from '../data/mockData'

const phases = ['Descarga', 'Carga']

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
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.7)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  modal: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    border: '1px solid var(--border)',
    padding: 24,
    width: '100%',
    maxWidth: 360,
    animation: 'fadeIn 0.2s ease-out',
  },
  modalIcon: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    background: 'rgba(245,166,35,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 16px',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: 8,
  },
  modalBody: {
    fontSize: 13,
    color: 'var(--text-muted)',
    textAlign: 'center',
    lineHeight: 1.6,
    marginBottom: 24,
  },
  modalActions: {
    display: 'flex',
    gap: 10,
  },
  btnCancel: {
    flex: 1,
    padding: '12px 0',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--border)',
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--text-muted)',
  },
  btnConfirm: {
    flex: 1,
    padding: '12px 0',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-red)',
    fontSize: 14,
    fontWeight: 600,
    color: '#fff',
  },
}

const phaseInfo = {
  Descarga: {
    description: 'Solo el Jefe de Carga podrá escanear. Los Jefes de Departamento pasan a modo solo lectura.',
  },
  Carga: {
    description: 'Los Jefes de Departamento marcan ítems como listos, y el Jefe de Carga los carga al camión.',
  },
}

function ShowInfo() {
  const { phase, setPhase } = usePhase()
  const [pendingPhase, setPendingPhase] = useState(null)

  const handleChipClick = (p) => {
    if (p === phase) return
    setPendingPhase(p)
  }

  const handleConfirm = () => {
    setPhase(pendingPhase)
    setPendingPhase(null)
  }

  const handleCancel = () => setPendingPhase(null)

  return (
    <>
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
              onClick={() => handleChipClick(p)}
              style={{
                ...styles.phaseChip,
                background: p === phase ? 'var(--accent-red)' : 'var(--border)',
                color: p === phase ? '#fff' : 'var(--text-muted)',
                cursor: p === phase ? 'default' : 'pointer',
                transition: 'background 0.2s, color 0.2s',
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {pendingPhase && (
        <div style={styles.overlay} onClick={handleCancel}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalIcon}>
              <AlertTriangle size={24} color="var(--accent-yellow)" />
            </div>
            <div style={styles.modalTitle}>Cambiar a fase {pendingPhase}</div>
            <div style={styles.modalBody}>
              {phaseInfo[pendingPhase].description}
            </div>
            <div style={styles.modalActions}>
              <button style={styles.btnCancel} onClick={handleCancel}>Cancelar</button>
              <button style={styles.btnConfirm} onClick={handleConfirm}>Confirmar</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function GlobalDashboard() {
  const { items } = useItems()
  const { trucks } = useTrucks()
  const navigate = useNavigate()

  const totalItems = items.length
  const loadedCount = items.filter(i => i.status === 'loaded').length
  const overallProgress = totalItems > 0 ? Math.round((loadedCount / totalItems) * 100) : 0

  const deptStats = departments.map(dept => {
    const deptItems = items.filter(i => i.dept === dept.id)
    const deptLoaded = deptItems.filter(i => i.status === 'loaded').length
    const progress = deptItems.length > 0 ? Math.round((deptLoaded / deptItems.length) * 100) : 0
    return { ...dept, progress }
  })

  return (
    <>
      <ShowInfo />

      <div style={styles.overallProgress} className="fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Progreso General</span>
          <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-yellow)' }}>{overallProgress}%</span>
        </div>
        <ProgressBar progress={overallProgress} height={10} />
      </div>

      <div style={styles.section} className="fade-in">
        <div style={styles.sectionTitle}>Por Departamento</div>
        <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: '6px 16px', border: '1px solid var(--border)' }}>
          {deptStats.map(dept => (
            <div
              key={dept.id}
              style={{ ...styles.deptRow, cursor: 'pointer' }}
              onClick={() => navigate('/inventory')}
            >
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
  const { items } = useItems()
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
  const { resetItems } = useItems()
  const { resetPhase } = usePhase()
  const { resetTrucks } = useTrucks()
  const [confirmReset, setConfirmReset] = useState(false)
  const isDeptLead = currentUser?.role === 'dept-lead'

  const handleReset = () => {
    resetItems()
    resetPhase()
    resetTrucks()
    setConfirmReset(false)
  }

  return (
    <>
      <TopBar
        title="RoadSync"
        actions={
          <button onClick={() => setConfirmReset(true)}>
            <RotateCcw size={18} color="var(--text-muted)" />
          </button>
        }
      />
      <div className="page">
        {isDeptLead ? (
          <DeptDashboard dept={currentUser.dept} />
        ) : (
          <GlobalDashboard />
        )}
      </div>

      {confirmReset && (
        <div style={styles.overlay} onClick={() => setConfirmReset(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalIcon}>
              <RotateCcw size={22} color="var(--accent-yellow)" />
            </div>
            <div style={styles.modalTitle}>Resetear demo</div>
            <div style={styles.modalBody}>
              Todos los ítems vuelven a su estado inicial y la fase cambia a Carga.
            </div>
            <div style={styles.modalActions}>
              <button style={styles.btnCancel} onClick={() => setConfirmReset(false)}>Cancelar</button>
              <button style={styles.btnConfirm} onClick={handleReset}>Resetear</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  )
}
