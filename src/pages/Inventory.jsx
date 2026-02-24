import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Search, Plus, Filter, X } from 'lucide-react'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import ItemCard from '../components/ItemCard'
import { useAuth } from '../context/AuthContext'
import { useItems } from '../context/ItemsContext'
import { deptNames } from '../data/mockData'

const typeIconMap = { case: 'Box', rack: 'Server', consola: 'Sliders', otro: 'Package' }
const typeLabels = { case: 'Case', rack: 'Rack', consola: 'Consola', otro: 'Otro' }
const deptEntries = Object.entries(deptNames)

const allDeptFilters = ['Todos', ...Object.values(deptNames)]
const statusFilters = ['Todos', 'Cargado', 'Listo para cargar', 'Descargado', 'Faltante']

const statusFilterMap = {
  'Cargado': 'loaded',
  'Listo para cargar': 'ready-to-load',
  'Descargado': 'descargado',
  'Faltante': 'missing',
}

const deptFilterMap = Object.fromEntries(
  Object.entries(deptNames).map(([k, v]) => [v, k])
)

const styles = {
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: '10px 14px',
    marginBottom: 12,
    border: '1px solid var(--border)',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    background: 'none',
    color: 'var(--text)',
  },
  filters: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    marginBottom: 14,
    paddingBottom: 4,
  },
  filterChip: {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    border: '1px solid var(--border)',
    transition: 'all 0.15s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
  fab: {
    position: 'fixed',
    bottom: 'calc(var(--nav-height) + 16px)',
    right: 16,
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'var(--accent-red)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(227, 6, 19, 0.4)',
    zIndex: 50,
  },
  count: {
    fontSize: 12,
    color: 'var(--text-muted)',
    marginBottom: 12,
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
    fontFamily: 'inherit',
    boxSizing: 'border-box',
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
    fontFamily: 'inherit',
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
    fontFamily: 'inherit',
  },
  btnSecondary: {
    flex: 1,
    padding: '14px 0',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--border)',
    fontSize: 15,
    fontWeight: 600,
    color: 'var(--text-muted)',
    fontFamily: 'inherit',
  },
  errorMsg: { fontSize: 12, color: 'var(--accent-red)', marginBottom: 12, marginTop: -12 },
}

const deptPrefixes = { audio: 'AUDIO', video: 'VIDEO', iluminacion: 'ILUM', staging: 'STAG', backline: 'BACK' }

function ItemModal({ onClose, onSave, defaultDept }) {
  const { items } = useItems()

  const suggestId = (dept) => {
    const prefix = deptPrefixes[dept] || 'ITEM'
    const count = items.filter(i => i.dept === dept).length
    return `${prefix}-${String(count + 1).padStart(2, '0')}`
  }

  const initDept = defaultDept || 'audio'
  const [form, setForm] = useState({ name: '', dept: initDept, type: 'case', id: suggestId(initDept) })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const setDept = (dept) => setForm(prev => ({ ...prev, dept, id: suggestId(dept) }))

  const handleSave = async () => {
    if (!form.id.trim()) return setError('El código es obligatorio.')
    if (!form.name.trim()) return setError('El nombre es obligatorio.')
    setError('')
    setSaving(true)
    try {
      await onSave({ id: form.id.trim().toUpperCase(), name: form.name.trim(), dept: form.dept, type: form.type, icon: typeIconMap[form.type] })
    } catch (err) {
      setError(err.message || 'Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>Nuevo Equipo</span>
          <button onClick={onClose}><X size={22} color="var(--text-muted)" /></button>
        </div>

        <div style={styles.label}>Nombre del equipo</div>
        <input
          style={styles.input}
          placeholder="Ej. Consola DiGiCo SD12"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          autoFocus
        />

        {!defaultDept && (
          <>
            <div style={styles.label}>Departamento</div>
            <div style={styles.chips}>
              {deptEntries.map(([id, name]) => (
                <button
                  key={id}
                  style={{
                    ...styles.chip,
                    background: form.dept === id ? '#ffffff18' : 'transparent',
                    borderColor: form.dept === id ? 'var(--text)' : 'var(--border)',
                    color: form.dept === id ? 'var(--text)' : 'var(--text-muted)',
                  }}
                  onClick={() => setDept(id)}
                >{name}</button>
              ))}
            </div>
          </>
        )}

        <div style={styles.label}>Código</div>
        <input
          style={{ ...styles.input, textTransform: 'uppercase', letterSpacing: '1px' }}
          placeholder="Ej. VIDEO-03"
          value={form.id}
          onChange={e => set('id', e.target.value.toUpperCase())}
        />

        <div style={styles.label}>Tipo</div>
        <div style={styles.chips}>
          {Object.entries(typeLabels).map(([id, label]) => (
            <button
              key={id}
              style={{
                ...styles.chip,
                background: form.type === id ? 'var(--accent-red)22' : 'transparent',
                borderColor: form.type === id ? 'var(--accent-red)' : 'var(--border)',
                color: form.type === id ? 'var(--accent-red)' : 'var(--text-muted)',
              }}
              onClick={() => set('type', id)}
            >{label}</button>
          ))}
        </div>

        {error && <div style={styles.errorMsg}>{error}</div>}

        <div style={styles.actions}>
          <button style={styles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button style={{ ...styles.btnPrimary, opacity: saving ? 0.7 : 1 }} onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Inventory() {
  const { currentUser } = useAuth()
  const { items, addItem } = useItems()
  const role = currentUser?.role
  const location = useLocation()
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState(location.state?.dept || 'Todos')
  const [statusFilter, setStatusFilter] = useState(location.state?.status || 'Todos')
  const [showFilters, setShowFilters] = useState(!!location.state?.status)
  const [showModal, setShowModal] = useState(false)

  const isDeptLead = role === 'dept-lead'
  const showFab = role === 'admin' || role === 'dept-lead'
  const showDeptFilters = role !== 'dept-lead'

  const filtered = items.filter(item => {
    if (isDeptLead && item.dept !== currentUser.dept) return false
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.id.toLowerCase().includes(search.toLowerCase())) return false
    if (deptFilter !== 'Todos' && item.dept !== deptFilterMap[deptFilter]) return false
    if (statusFilter !== 'Todos' && item.status !== statusFilterMap[statusFilter]) return false
    return true
  })

  return (
    <>
      <TopBar
        title="Inventario"
        actions={
          <button onClick={() => setShowFilters(!showFilters)}>
            <Filter size={20} color={showFilters ? 'var(--accent-red)' : 'var(--text-muted)'} />
          </button>
        }
      />
      <div className="page">
        <div style={styles.searchBar} className="fade-in">
          <Search size={18} color="var(--text-muted)" />
          <input
            style={styles.searchInput}
            placeholder="Buscar equipo o código..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {showDeptFilters && (
          <div style={styles.filters} className="fade-in">
            {allDeptFilters.map(f => (
              <button
                key={f}
                style={{
                  ...styles.filterChip,
                  background: deptFilter === f ? 'var(--accent-red)' : 'transparent',
                  color: deptFilter === f ? '#fff' : 'var(--text-muted)',
                  borderColor: deptFilter === f ? 'var(--accent-red)' : 'var(--border)',
                }}
                onClick={() => setDeptFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {showFilters && (
          <div style={styles.filters} className="fade-in">
            {statusFilters.map(f => (
              <button
                key={f}
                style={{
                  ...styles.filterChip,
                  background: statusFilter === f ? 'var(--accent-yellow)' : 'transparent',
                  color: statusFilter === f ? '#000' : 'var(--text-muted)',
                  borderColor: statusFilter === f ? 'var(--accent-yellow)' : 'var(--border)',
                }}
                onClick={() => setStatusFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        <div style={styles.count}>{filtered.length} equipos</div>

        <div style={styles.list}>
          {filtered.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        {showFab && (
          <button style={styles.fab} onClick={() => setShowModal(true)}>
            <Plus size={24} color="#fff" />
          </button>
        )}
      </div>

      {showModal && (
        <ItemModal
          defaultDept={role === 'dept-lead' ? currentUser.dept : null}
          onClose={() => setShowModal(false)}
          onSave={async (data) => { await addItem(data); setShowModal(false) }}
        />
      )}

      <BottomNav />
    </>
  )
}
