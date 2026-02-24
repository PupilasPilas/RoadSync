import { useState, useRef } from 'react'
import { Search, Plus, Edit2, Trash2, Upload, X, Check, AlertTriangle } from 'lucide-react'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import StatusBadge from '../components/StatusBadge'
import { useItems } from '../context/ItemsContext'
import { useTrucks } from '../context/TrucksContext'
import { deptNames, deptColors } from '../data/mockData'

const TYPE_LABELS = { case: 'Case', rack: 'Rack', consola: 'Consola', otro: 'Otro' }
const TYPE_ICONS = { case: 'Box', rack: 'Server', consola: 'Sliders', otro: 'Package' }
const DEPT_PREFIXES = { audio: 'AUDIO', video: 'VIDEO', iluminacion: 'ILUM', staging: 'STAG', backline: 'BACK' }
const STATUS_OPTIONS = ['descargado', 'ready-to-load', 'loaded']
const STATUS_LABELS = { descargado: 'Descargado', 'ready-to-load': 'Listo para cargar', loaded: 'Cargado' }
const VALID_DEPTS = Object.keys(deptNames)
const VALID_TYPES = Object.keys(TYPE_LABELS)

const styles = {
  tabs: { display: 'flex', gap: 8, marginBottom: 20 },
  tab: {
    flex: 1, padding: '10px 0', borderRadius: 'var(--radius-sm)',
    fontSize: 13, fontWeight: 600, textAlign: 'center',
    border: '1px solid var(--border)', transition: 'all 0.15s', fontFamily: 'inherit', cursor: 'pointer',
  },
  searchRow: { display: 'flex', gap: 8, marginBottom: 12, alignItems: 'center' },
  searchBar: {
    flex: 1, display: 'flex', alignItems: 'center', gap: 8,
    background: 'var(--surface)', borderRadius: 'var(--radius)',
    padding: '10px 14px', border: '1px solid var(--border)',
  },
  searchInput: { flex: 1, fontSize: 14, background: 'none', color: 'var(--text)' },
  addBtn: {
    display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px',
    borderRadius: 'var(--radius)', background: 'var(--accent-red)',
    fontSize: 13, fontWeight: 700, color: '#fff', whiteSpace: 'nowrap', fontFamily: 'inherit', cursor: 'pointer',
  },
  itemRow: {
    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
    background: 'var(--surface)', borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--border)', marginBottom: 8,
  },
  itemDot: { width: 8, height: 8, borderRadius: '50%', flexShrink: 0 },
  itemInfo: { flex: 1, minWidth: 0 },
  itemId: { fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, letterSpacing: '0.5px' },
  itemName: { fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
  itemMeta: { fontSize: 11, color: 'var(--text-muted)' },
  actionBtn: {
    width: 32, height: 32, borderRadius: 8, display: 'flex',
    alignItems: 'center', justifyContent: 'center', flexShrink: 0, cursor: 'pointer',
  },
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
    zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
  },
  modal: {
    background: 'var(--surface)', borderRadius: '20px 20px 0 0',
    border: '1px solid var(--border)', borderBottom: 'none',
    width: '100%', maxWidth: 640, padding: '24px 24px 40px',
    maxHeight: '90vh', overflowY: 'auto',
  },
  modalHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
  modalTitle: { fontSize: 17, fontWeight: 700 },
  label: {
    fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
    letterSpacing: '1px', color: 'var(--text-muted)', marginBottom: 8, display: 'block',
  },
  input: {
    width: '100%', background: 'var(--bg)', border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)', padding: '12px 14px', fontSize: 15,
    color: 'var(--text)', marginBottom: 16, fontFamily: 'inherit', boxSizing: 'border-box',
  },
  chips: { display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 },
  chip: {
    padding: '7px 14px', borderRadius: 20, fontSize: 13, fontWeight: 600,
    border: '1.5px solid transparent', cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit',
  },
  formActions: { display: 'flex', gap: 10, marginTop: 8 },
  btnPrimary: {
    flex: 1, padding: '14px 0', borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-red)', fontSize: 15, fontWeight: 700, color: '#fff', fontFamily: 'inherit', cursor: 'pointer',
  },
  btnSecondary: {
    flex: 1, padding: '14px 0', borderRadius: 'var(--radius-sm)',
    background: 'var(--border)', fontSize: 15, fontWeight: 600,
    color: 'var(--text-muted)', fontFamily: 'inherit', cursor: 'pointer',
  },
  dropZone: {
    border: '2px dashed var(--border)', borderRadius: 'var(--radius)',
    padding: 40, textAlign: 'center', cursor: 'pointer',
    transition: 'border-color 0.2s, background 0.2s', marginBottom: 20,
  },
  previewTable: { width: '100%', borderCollapse: 'collapse', fontSize: 12, marginBottom: 16 },
  previewTh: {
    padding: '8px 10px', textAlign: 'left', fontSize: 10, fontWeight: 600,
    textTransform: 'uppercase', letterSpacing: '0.5px',
    color: 'var(--text-muted)', borderBottom: '1px solid var(--border)',
  },
  previewTd: { padding: '8px 10px', borderBottom: '1px solid var(--border)', color: 'var(--text)' },
  importResult: {
    background: 'rgba(0,200,83,0.08)', border: '1px solid rgba(0,200,83,0.2)',
    borderRadius: 'var(--radius)', padding: 24, textAlign: 'center', marginBottom: 16,
  },
  errorBox: {
    display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px',
    background: 'rgba(227,6,19,0.08)', border: '1px solid rgba(227,6,19,0.2)',
    borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: 13, color: 'var(--status-error)',
  },
  errorMsg: { fontSize: 12, color: 'var(--accent-red)', marginTop: -8, marginBottom: 12 },
  emptyState: { textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)', fontSize: 13 },
}

// ─── Item Modal (Add / Edit) ──────────────────────────────────────────────────

function ItemModal({ item, onClose, onSave }) {
  const { items } = useItems()
  const { trucks } = useTrucks()
  const isEditing = !!item

  const suggestId = (dept) => {
    const prefix = DEPT_PREFIXES[dept] || 'ITEM'
    const count = items.filter(i => i.dept === dept).length
    return `${prefix}-${String(count + 1).padStart(2, '0')}`
  }

  const [form, setForm] = useState(isEditing ? {
    id: item.id, name: item.name, dept: item.dept, type: item.type,
    truck: item.truck || '', order: String(item.order || ''), status: item.status,
  } : {
    id: suggestId('audio'), name: '', dept: 'audio', type: 'case',
    truck: '', order: '', status: 'descargado',
  })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))
  const setDept = (dept) => setForm(prev => ({
    ...prev, dept,
    ...(isEditing ? {} : { id: suggestId(dept) }),
  }))

  const handleSave = async () => {
    if (!form.id.trim()) return setError('El código es obligatorio.')
    if (!form.name.trim()) return setError('El nombre es obligatorio.')
    if (!isEditing && items.some(i => i.id === form.id.trim().toUpperCase()))
      return setError('Ya existe un ítem con ese código.')
    setError('')
    setSaving(true)
    try {
      await onSave({
        id: form.id.trim().toUpperCase(),
        name: form.name.trim(),
        dept: form.dept,
        type: form.type,
        icon: TYPE_ICONS[form.type] || 'Box',
        truck: form.truck || null,
        order: Number(form.order) || 0,
        status: form.status,
      })
      onClose()
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
          <span style={styles.modalTitle}>{isEditing ? 'Editar ítem' : 'Nuevo ítem'}</span>
          <button onClick={onClose}><X size={22} color="var(--text-muted)" /></button>
        </div>

        <label style={styles.label}>Nombre</label>
        <input style={styles.input} placeholder="Ej. Consola DiGiCo SD12"
          value={form.name} onChange={e => set('name', e.target.value)} autoFocus />

        <label style={styles.label}>Departamento</label>
        <div style={styles.chips}>
          {Object.entries(deptNames).map(([id, name]) => (
            <button key={id} style={{
              ...styles.chip,
              background: form.dept === id ? `${deptColors[id]}22` : 'transparent',
              borderColor: form.dept === id ? deptColors[id] : 'var(--border)',
              color: form.dept === id ? deptColors[id] : 'var(--text-muted)',
            }} onClick={() => setDept(id)}>{name}</button>
          ))}
        </div>

        <label style={styles.label}>Código</label>
        <input style={{
          ...styles.input, textTransform: 'uppercase', letterSpacing: '1px',
          ...(isEditing ? { opacity: 0.5 } : {}),
        }} placeholder="Ej. AUDIO-09" value={form.id}
          onChange={e => !isEditing && set('id', e.target.value.toUpperCase())}
          readOnly={isEditing} />

        <label style={styles.label}>Tipo</label>
        <div style={styles.chips}>
          {Object.entries(TYPE_LABELS).map(([id, label]) => (
            <button key={id} style={{
              ...styles.chip,
              background: form.type === id ? 'var(--accent-red)22' : 'transparent',
              borderColor: form.type === id ? 'var(--accent-red)' : 'var(--border)',
              color: form.type === id ? 'var(--accent-red)' : 'var(--text-muted)',
            }} onClick={() => set('type', id)}>{label}</button>
          ))}
        </div>

        <label style={styles.label}>Camión asignado</label>
        <div style={styles.chips}>
          {[{ id: '', name: 'Sin asignar' }, ...trucks.map(t => ({ id: t.id, name: t.name }))].map(t => (
            <button key={t.id} style={{
              ...styles.chip,
              background: form.truck === t.id ? '#ffffff18' : 'transparent',
              borderColor: form.truck === t.id ? 'var(--text)' : 'var(--border)',
              color: form.truck === t.id ? 'var(--text)' : 'var(--text-muted)',
            }} onClick={() => set('truck', t.id)}>{t.name}</button>
          ))}
        </div>

        <label style={styles.label}>Estado</label>
        <div style={styles.chips}>
          {STATUS_OPTIONS.map(s => (
            <button key={s} style={{
              ...styles.chip,
              background: form.status === s ? '#ffffff18' : 'transparent',
              borderColor: form.status === s ? 'var(--text)' : 'var(--border)',
              color: form.status === s ? 'var(--text)' : 'var(--text-muted)',
            }} onClick={() => set('status', s)}>{STATUS_LABELS[s]}</button>
          ))}
        </div>

        {error && <div style={styles.errorMsg}>{error}</div>}

        <div style={styles.formActions}>
          <button style={styles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button style={{ ...styles.btnPrimary, opacity: saving ? 0.7 : 1 }}
            onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── List Tab ─────────────────────────────────────────────────────────────────

function ListTab({ onAdd, onEdit, onDeleteConfirm }) {
  const { items } = useItems()
  const [search, setSearch] = useState('')

  const filtered = items.filter(item =>
    !search ||
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.id.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <div style={styles.searchRow}>
        <div style={styles.searchBar}>
          <Search size={16} color="var(--text-muted)" />
          <input style={styles.searchInput} placeholder="Buscar por código o nombre..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <button style={styles.addBtn} onClick={onAdd}>
          <Plus size={16} />
          Nuevo
        </button>
      </div>

      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
        {filtered.length} ítem{filtered.length !== 1 ? 's' : ''}
      </div>

      {filtered.length === 0 ? (
        <div style={styles.emptyState}>Sin ítems</div>
      ) : (
        filtered.map(item => (
          <div key={item.id} style={styles.itemRow}>
            <div style={{ ...styles.itemDot, background: deptColors[item.dept] }} />
            <div style={styles.itemInfo}>
              <div style={styles.itemId}>{item.id}</div>
              <div style={styles.itemName}>{item.name}</div>
              <div style={styles.itemMeta}>{deptNames[item.dept]} · {TYPE_LABELS[item.type] || item.type}</div>
            </div>
            <StatusBadge status={item.status} />
            <button style={{ ...styles.actionBtn, background: 'var(--border)' }} onClick={() => onEdit(item)}>
              <Edit2 size={14} color="var(--text-muted)" />
            </button>
            <button style={{ ...styles.actionBtn, background: 'rgba(227,6,19,0.1)' }} onClick={() => onDeleteConfirm(item.id)}>
              <Trash2 size={14} color="var(--accent-red)" />
            </button>
          </div>
        ))
      )}
    </>
  )
}

// ─── Import Tab ───────────────────────────────────────────────────────────────

function ImportTab() {
  const { items, importItems } = useItems()
  const fileRef = useRef(null)
  const [parsed, setParsed] = useState(null)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const parseCSV = (text) => {
    const lines = text.trim().split(/\r?\n/)
    if (lines.length < 2) throw new Error('El archivo está vacío o solo tiene encabezados.')
    const headers = lines[0].split(',').map(h => h.trim().toLowerCase())
    if (!headers.includes('id') || !headers.includes('name') || !headers.includes('dept'))
      throw new Error('El CSV debe tener columnas: id, name, dept (mínimo).')
    return lines.slice(1).filter(l => l.trim()).map(line => {
      const values = line.split(',').map(v => v.trim())
      return Object.fromEntries(headers.map((h, i) => [h, values[i] || '']))
    })
  }

  const processFile = (file) => {
    if (!file) return
    setError('')
    setResult(null)
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const rows = parseCSV(e.target.result)
        const existingIds = new Set(items.map(i => i.id.toUpperCase()))
        const newRows = rows.filter(r => r.id && !existingIds.has(r.id.toUpperCase()))
        setParsed({ rows, newRows, skipped: rows.length - newRows.length })
      } catch (err) {
        setError(err.message)
        setParsed(null)
      }
    }
    reader.readAsText(file)
  }

  const handleImport = async () => {
    if (!parsed || parsed.newRows.length === 0) return
    setImporting(true)
    setError('')
    try {
      const toImport = parsed.newRows.map(row => ({
        id: row.id.trim().toUpperCase(),
        name: row.name.trim(),
        dept: VALID_DEPTS.includes(row.dept?.toLowerCase()) ? row.dept.toLowerCase() : 'audio',
        type: VALID_TYPES.includes(row.type?.toLowerCase()) ? row.type.toLowerCase() : 'case',
        icon: TYPE_ICONS[row.type?.toLowerCase()] || 'Box',
        truck: row.truck?.trim() || null,
        order: Number(row.order) || 0,
      }))
      const res = await importItems(toImport)
      setResult(res)
      setParsed(null)
      if (fileRef.current) fileRef.current.value = ''
    } catch (err) {
      setError(err.message || 'Error al importar.')
    } finally {
      setImporting(false)
    }
  }

  return (
    <>
      <input ref={fileRef} type="file" accept=".csv,.txt"
        style={{ display: 'none' }} onChange={e => processFile(e.target.files[0])} />

      {!parsed && !result && (
        <>
          <div style={{
            ...styles.dropZone,
            borderColor: dragging ? 'var(--accent-red)' : 'var(--border)',
            background: dragging ? 'rgba(227,6,19,0.04)' : 'transparent',
          }}
            onClick={() => fileRef.current?.click()}
            onDragOver={e => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]) }}
          >
            <Upload size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 6 }}>Subir archivo CSV</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Tocá o arrastrá un .csv aquí
            </div>
          </div>

          <div style={{ background: 'var(--surface)', borderRadius: 'var(--radius)', padding: 16, border: '1px solid var(--border)', fontSize: 12, color: 'var(--text-muted)', lineHeight: 1.9 }}>
            <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text)', fontSize: 13 }}>Formato esperado:</div>
            <code style={{ display: 'block', fontSize: 11 }}>
              id,name,dept,type,truck,order<br />
              AUDIO-09,Nuevo Rack,audio,rack,truck-01,9<br />
              VIDEO-09,Case Cables,video,case,,10
            </code>
            <div style={{ marginTop: 10 }}>
              <b>dept:</b> audio · video · iluminacion · staging · backline<br />
              <b>type:</b> case · rack · consola · otro (opcional)<br />
              <b>truck:</b> truck-01 · truck-02 · truck-03 (opcional)
            </div>
          </div>
        </>
      )}

      {error && (
        <div style={styles.errorBox}>
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {result && (
        <div style={styles.importResult}>
          <Check size={28} color="var(--status-ok)" style={{ marginBottom: 8 }} />
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>
            {result.imported} ítem{result.imported !== 1 ? 's' : ''} importado{result.imported !== 1 ? 's' : ''}
          </div>
          {result.skipped > 0 && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
              {result.skipped} saltado{result.skipped !== 1 ? 's' : ''} por código duplicado
            </div>
          )}
          <button onClick={() => setResult(null)} style={{
            marginTop: 16, padding: '10px 24px', borderRadius: 'var(--radius-sm)',
            background: 'var(--border)', fontSize: 13, fontWeight: 600,
            color: 'var(--text-muted)', fontFamily: 'inherit', cursor: 'pointer',
          }}>
            Importar otro archivo
          </button>
        </div>
      )}

      {parsed && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 14, fontWeight: 600 }}>Vista previa</div>
            <button style={{ fontSize: 12, color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit' }}
              onClick={() => { setParsed(null); if (fileRef.current) fileRef.current.value = '' }}>
              Cancelar
            </button>
          </div>

          <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
            <div style={{ fontSize: 13 }}>
              <span style={{ color: 'var(--status-ok)', fontWeight: 700 }}>{parsed.newRows.length}</span>
              <span style={{ color: 'var(--text-muted)' }}> nuevos</span>
            </div>
            {parsed.skipped > 0 && (
              <div style={{ fontSize: 13 }}>
                <span style={{ color: 'var(--text-muted)', fontWeight: 700 }}>{parsed.skipped}</span>
                <span style={{ color: 'var(--text-muted)' }}> duplicados (se saltarán)</span>
              </div>
            )}
          </div>

          <div style={{ overflowX: 'auto', marginBottom: 16 }}>
            <table style={styles.previewTable}>
              <thead>
                <tr>
                  <th style={styles.previewTh}>ID</th>
                  <th style={styles.previewTh}>Nombre</th>
                  <th style={styles.previewTh}>Depto</th>
                  <th style={styles.previewTh}>Tipo</th>
                  <th style={styles.previewTh}></th>
                </tr>
              </thead>
              <tbody>
                {parsed.rows.map((row, i) => {
                  const isDup = !parsed.newRows.includes(row)
                  return (
                    <tr key={i} style={{ opacity: isDup ? 0.4 : 1 }}>
                      <td style={styles.previewTd}>{row.id}</td>
                      <td style={styles.previewTd}>{row.name}</td>
                      <td style={styles.previewTd}>{row.dept}</td>
                      <td style={styles.previewTd}>{row.type || 'case'}</td>
                      <td style={{ ...styles.previewTd, color: isDup ? 'var(--text-muted)' : 'var(--status-ok)', fontSize: 11, fontWeight: 600 }}>
                        {isDup ? 'DUPLICADO' : 'NUEVO'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <button style={{ ...styles.btnPrimary, opacity: (importing || parsed.newRows.length === 0) ? 0.6 : 1 }}
            onClick={handleImport} disabled={importing || parsed.newRows.length === 0}>
            {importing ? 'Importando...' : `Importar ${parsed.newRows.length} ítem${parsed.newRows.length !== 1 ? 's' : ''}`}
          </button>
        </>
      )}
    </>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function AdminItems() {
  const { items, addItem, updateItem, deleteItem } = useItems()
  const [tab, setTab] = useState('list')
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const handleAdd = () => { setEditingItem(null); setShowModal(true) }
  const handleEdit = (item) => { setEditingItem(item); setShowModal(true) }
  const handleSave = async (data) => {
    if (editingItem) await updateItem(editingItem.id, data)
    else await addItem(data)
  }
  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try { await deleteItem(deleteTarget); setDeleteTarget(null) }
    finally { setDeleting(false) }
  }

  return (
    <>
      <TopBar title="Gestión de Ítems" />
      <div className="page">
        <div style={styles.tabs}>
          {[
            { id: 'list', label: `Lista (${items.length})` },
            { id: 'import', label: 'Importar CSV' },
          ].map(t => (
            <button key={t.id} style={{
              ...styles.tab,
              background: tab === t.id ? 'var(--accent-red)' : 'transparent',
              color: tab === t.id ? '#fff' : 'var(--text-muted)',
              borderColor: tab === t.id ? 'var(--accent-red)' : 'var(--border)',
            }} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'list' && (
          <ListTab onAdd={handleAdd} onEdit={handleEdit} onDeleteConfirm={setDeleteTarget} />
        )}
        {tab === 'import' && <ImportTab />}

        {deleteTarget && (
          <div style={styles.overlay} onClick={() => setDeleteTarget(null)}>
            <div style={{ ...styles.modal, padding: 24 }} onClick={e => e.stopPropagation()}>
              <div style={styles.modalTitle}>¿Eliminar ítem?</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', margin: '12px 0 24px', lineHeight: 1.6 }}>
                <b>{items.find(i => i.id === deleteTarget)?.name}</b> ({deleteTarget})<br />
                Esta acción no se puede deshacer.
              </div>
              <div style={styles.formActions}>
                <button style={styles.btnSecondary} onClick={() => setDeleteTarget(null)}>Cancelar</button>
                <button style={{ ...styles.btnPrimary, background: 'var(--accent-red)', opacity: deleting ? 0.7 : 1 }}
                  onClick={handleDelete} disabled={deleting}>
                  {deleting ? 'Eliminando...' : 'Eliminar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showModal && (
        <ItemModal
          item={editingItem}
          onClose={() => { setShowModal(false); setEditingItem(null) }}
          onSave={handleSave}
        />
      )}
      <BottomNav />
    </>
  )
}
