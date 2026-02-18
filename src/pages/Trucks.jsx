import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import TruckCard from '../components/TruckCard'
import { useAuth } from '../context/AuthContext'
import { useTrucks } from '../context/TrucksContext'

const EMPTY_FORM = { name: '', assignedTo: '', capacity: '' }

const styles = {
  fab: {
    position: 'fixed',
    bottom: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px) + 16px)',
    right: 20,
    width: 56,
    height: 56,
    borderRadius: '50%',
    background: 'var(--accent-red)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(227, 6, 19, 0.45)',
    zIndex: 50,
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
  },
  modalHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: 700,
  },
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
  actions: {
    display: 'flex',
    gap: 10,
    marginTop: 8,
  },
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
  errorMsg: {
    fontSize: 12,
    color: 'var(--accent-red)',
    marginBottom: 12,
  },
}

export default function Trucks() {
  const { currentUser } = useAuth()
  const { trucks, addTruck } = useTrucks()
  const isAdmin = currentUser?.role === 'admin'
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleAdd = () => {
    if (!form.name.trim()) return setError('El nombre es obligatorio.')
    if (!form.capacity || isNaN(form.capacity) || Number(form.capacity) <= 0)
      return setError('La capacidad debe ser un número mayor a 0.')
    setError('')
    addTruck({
      id: `truck-${Date.now()}`,
      name: form.name.trim(),
      assignedTo: form.assignedTo.trim() || 'Sin asignar',
      capacity: Number(form.capacity),
      loaded: 0,
      progress: 0,
      status: 'open',
    })
    setForm(EMPTY_FORM)
    setShowModal(false)
  }

  const handleClose = () => {
    setForm(EMPTY_FORM)
    setError('')
    setShowModal(false)
  }

  return (
    <>
      <TopBar title="Camiones" />
      <div className="page">
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
          {trucks.length} camiones asignados
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {trucks.map(truck => (
            <div key={truck.id} className="fade-in">
              <TruckCard truck={truck} />
            </div>
          ))}
        </div>

        {isAdmin && (
          <button style={styles.fab} onClick={() => setShowModal(true)}>
            <Plus size={26} color="#fff" />
          </button>
        )}
      </div>

      {showModal && (
        <div style={styles.overlay} onClick={handleClose}>
          <div style={styles.modal} onClick={e => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <span style={styles.modalTitle}>Nuevo Camión</span>
              <button onClick={handleClose}><X size={22} color="var(--text-muted)" /></button>
            </div>

            <div style={styles.label}>Nombre</div>
            <input
              style={styles.input}
              placeholder="Ej. Camión 04"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              autoFocus
            />

            <div style={styles.label}>Asignado a</div>
            <input
              style={styles.input}
              placeholder="Ej. Audio / Video"
              value={form.assignedTo}
              onChange={e => set('assignedTo', e.target.value)}
            />

            <div style={styles.label}>Capacidad (ítems)</div>
            <input
              style={styles.input}
              placeholder="Ej. 24"
              value={form.capacity}
              onChange={e => set('capacity', e.target.value)}
              type="number"
              inputMode="numeric"
            />

            {error && <div style={styles.errorMsg}>{error}</div>}

            <div style={styles.actions}>
              <button style={styles.btnSecondary} onClick={handleClose}>Cancelar</button>
              <button style={styles.btnPrimary} onClick={handleAdd}>Agregar</button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  )
}
