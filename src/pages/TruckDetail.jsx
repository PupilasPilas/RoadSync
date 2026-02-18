import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Truck, CheckCircle, AlertTriangle, Edit2, MessageSquare, Trash2, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import ProgressBar from '../components/ProgressBar'
import ItemCard from '../components/ItemCard'
import { useAuth } from '../context/AuthContext'
import { useTrucks } from '../context/TrucksContext'
import { useItems } from '../context/ItemsContext'

const statusMap = {
  open:     { label: 'Abierto',         color: 'var(--status-pending)' },
  complete: { label: 'Carga completa',  color: 'var(--status-ok)' },
  transit:  { label: 'En tránsito',     color: 'var(--accent-yellow)' },
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
  truckName: { fontSize: 20, fontWeight: 700, marginBottom: 4 },
  assign: { fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 },
  stats: { display: 'flex', justifyContent: 'center', gap: 32, marginTop: 16 },
  stat: { textAlign: 'center' },
  statNum: { fontSize: 24, fontWeight: 700 },
  statLabel: { fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' },
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
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(0,0,0,0.75)',
    zIndex: 200,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  modal: {
    background: 'var(--surface)',
    borderRadius: '20px 20px 0 0',
    border: '1px solid var(--border)',
    borderBottom: 'none',
    width: '100%',
    maxWidth: 640,
    padding: '24px 24px 40px',
    animation: 'fadeIn 0.2s ease-out',
    maxHeight: '90vh',
    overflowY: 'auto',
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: { fontSize: 17, fontWeight: 700 },
  label: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    marginBottom: 8,
  },
  input: {
    width: '100%',
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 14px',
    fontSize: 15,
    color: 'var(--text)',
    marginBottom: 20,
  },
  chips: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 },
  chip: {
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    border: '1.5px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s',
  },
  actions: { display: 'flex', gap: 10, marginTop: 8 },
  btnPrimary: {
    flex: 1,
    padding: '14px 0',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-red)',
    fontSize: 15,
    fontWeight: 700,
    color: '#fff',
  },
  btnSecondary: {
    flex: 1,
    padding: '14px 0',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--border)',
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-muted)',
  },
  btnDelete: {
    padding: '14px 16px',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(227,6,19,0.12)',
    color: 'var(--accent-red)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorMsg: { fontSize: 12, color: 'var(--accent-red)', marginBottom: 12 },
}

export default function TruckDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { trucks, updateTruck, deleteTruck } = useTrucks()
  const { items } = useItems()
  const isAdmin = currentUser?.role === 'admin'

  const truck = trucks.find(t => t.id === id)
  const [showEdit, setShowEdit] = useState(false)
  const [form, setForm] = useState(null)
  const [error, setError] = useState('')

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
  const loadedItems = truckItems.filter(i => i.status === 'loaded').length
  const missingItems = truckItems.filter(i => ['missing', 'pending', 'ready-to-load'].includes(i.status))
  const progress = truckItems.length > 0 ? Math.round((loadedItems / truckItems.length) * 100) : truck.progress
  const st = statusMap[truck.status]

  const openEdit = () => {
    setForm({ name: truck.name, assignedTo: truck.assignedTo, capacity: String(truck.capacity), status: truck.status })
    setError('')
    setShowEdit(true)
  }

  const handleSave = () => {
    if (!form.name.trim()) return setError('El nombre es obligatorio.')
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) <= 0)
      return setError('La capacidad debe ser un número mayor a 0.')
    setError('')
    updateTruck(truck.id, {
      name: form.name.trim(),
      assignedTo: form.assignedTo.trim() || 'Sin asignar',
      capacity: Number(form.capacity),
      status: form.status,
    })
    setShowEdit(false)
  }

  const handleDelete = () => {
    deleteTruck(truck.id)
    navigate('/trucks', { replace: true })
  }

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  return (
    <>
      <TopBar
        title={truck.name}
        showBack
        actions={isAdmin ? (
          <button onClick={openEdit}>
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
            <ProgressBar progress={progress} height={10} showLabel />
          </div>
          <div style={styles.stats}>
            <div style={styles.stat}>
              <div style={styles.statNum}>{loadedItems}</div>
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
              <div style={styles.statLabel}>Capacidad</div>
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
          {truckItems.length === 0 ? (
            <div style={styles.notesPlaceholder}>No hay ítems asignados a este camión</div>
          ) : (
            truckItems.map(item => <ItemCard key={item.id} item={item} />)
          )}
        </div>
      </div>

      {showEdit && form && (
        <div style={styles.overlay} onClick={() => setShowEdit(false)}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span style={styles.modalTitle}>Editar Camión</span>
              <button onClick={() => setShowEdit(false)}><X size={22} color="var(--text-muted)" /></button>
            </div>

            <div style={styles.label}>Nombre</div>
            <input
              style={styles.input}
              value={form.name}
              onChange={e => set('name', e.target.value)}
              autoFocus
            />

            <div style={styles.label}>Asignado a</div>
            <input
              style={styles.input}
              value={form.assignedTo}
              onChange={e => set('assignedTo', e.target.value)}
            />

            <div style={styles.label}>Capacidad (ítems)</div>
            <input
              style={styles.input}
              value={form.capacity}
              onChange={e => set('capacity', e.target.value)}
              type="number"
              inputMode="numeric"
            />

            <div style={styles.label}>Estado</div>
            <div style={styles.chips}>
              {Object.entries(statusMap).map(([key, cfg]) => (
                <button
                  key={key}
                  style={{
                    ...styles.chip,
                    background: form.status === key ? `${cfg.color}22` : 'transparent',
                    borderColor: form.status === key ? cfg.color : 'var(--border)',
                    color: form.status === key ? cfg.color : 'var(--text-muted)',
                  }}
                  onClick={() => set('status', key)}
                >
                  {cfg.label}
                </button>
              ))}
            </div>

            {error && <div style={styles.errorMsg}>{error}</div>}

            <div style={styles.actions}>
              <button style={styles.btnDelete} onClick={handleDelete}>
                <Trash2 size={18} />
              </button>
              <button style={styles.btnSecondary} onClick={() => setShowEdit(false)}>Cancelar</button>
              <button style={styles.btnPrimary} onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  )
}
