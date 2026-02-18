import { useState } from 'react'
import { Plus, ChevronRight, Trash2, X } from 'lucide-react'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import { useAuth } from '../context/AuthContext'
import { useUsers } from '../context/UsersContext'
import { deptNames } from '../data/mockData'

const roleConfig = {
  admin:      { label: 'Admin',           color: 'var(--accent-red)' },
  'dept-lead':{ label: 'Jefe de Depto',   color: '#2196F3' },
  'load-lead':{ label: 'Jefe de Carga',   color: 'var(--accent-yellow)' },
}

const depts = Object.entries(deptNames).map(([id, name]) => ({ id, name }))

const getAvatar = (name = '') => {
  const parts = name.trim().split(' ').filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0][0].toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

const suggestId = (name = '') =>
  name.trim().split(' ')[0].toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 10) || 'usuario'

const EMPTY_FORM = { name: '', role: 'dept-lead', dept: 'audio', loginId: '' }

const styles = {
  section: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    marginBottom: 12,
  },
  card: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '14px 16px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 8,
    cursor: 'pointer',
    transition: 'background 0.15s',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: '50%',
    background: 'var(--accent-red)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    flexShrink: 0,
    letterSpacing: '1px',
  },
  roleBadge: {
    display: 'inline-block',
    fontSize: 10,
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.3px',
    marginTop: 4,
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
  modalTitle: {
    fontSize: 17,
    fontWeight: 700,
  },
  avatarPreview: {
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'var(--accent-red)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 22,
    fontWeight: 700,
    margin: '0 auto 24px',
    letterSpacing: '2px',
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
  chips: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  chip: {
    padding: '8px 16px',
    borderRadius: 20,
    fontSize: 13,
    fontWeight: 600,
    border: '1.5px solid transparent',
    cursor: 'pointer',
    transition: 'all 0.15s',
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
  btnDelete: {
    padding: '14px 16px',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(227,6,19,0.12)',
    color: 'var(--accent-red)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
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
  errorMsg: {
    fontSize: 12,
    color: 'var(--accent-red)',
    marginBottom: 12,
    marginTop: -12,
  },
  idHint: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginTop: -16,
    marginBottom: 20,
  },
}

function UserModal({ user, onClose, onSave, onDelete, isNew, existingIds, currentUserId }) {
  const [form, setForm] = useState(
    isNew ? EMPTY_FORM : { name: user.name, role: user.role, dept: user.dept || 'audio', loginId: user.id }
  )
  const [error, setError] = useState('')

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  const handleSave = () => {
    if (!form.name.trim()) return setError('El nombre es obligatorio.')
    if (isNew && !form.loginId.trim()) return setError('El ID de login es obligatorio.')
    if (isNew && existingIds.includes(form.loginId.trim().toLowerCase())) {
      return setError('Ese ID de login ya existe.')
    }
    setError('')
    const avatar = getAvatar(form.name)
    const id = isNew ? form.loginId.trim().toLowerCase() : user.id
    onSave({ id, name: form.name.trim(), role: form.role, dept: form.role === 'dept-lead' ? form.dept : null, avatar })
  }

  const roleEntries = Object.entries(roleConfig)

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={e => e.stopPropagation()}>
        <div style={styles.modalHeader}>
          <span style={styles.modalTitle}>{isNew ? 'Nuevo Usuario' : 'Editar Usuario'}</span>
          <button onClick={onClose}><X size={22} color="var(--text-muted)" /></button>
        </div>

        <div style={{ ...styles.avatarPreview, background: roleConfig[form.role]?.color || 'var(--accent-red)' }}>
          {getAvatar(form.name)}
        </div>

        <div style={styles.label}>Nombre completo</div>
        <input
          style={styles.input}
          placeholder="Ej. Carlos García"
          value={form.name}
          onChange={e => {
            set('name', e.target.value)
            if (isNew && !form.loginId) set('loginId', suggestId(e.target.value))
          }}
          autoFocus
        />

        <div style={styles.label}>Rol</div>
        <div style={styles.chips}>
          {roleEntries.map(([id, cfg]) => {
            const active = form.role === id
            return (
              <button
                key={id}
                style={{
                  ...styles.chip,
                  background: active ? `${cfg.color}22` : 'transparent',
                  borderColor: active ? cfg.color : 'var(--border)',
                  color: active ? cfg.color : 'var(--text-muted)',
                }}
                onClick={() => set('role', id)}
              >
                {cfg.label}
              </button>
            )
          })}
        </div>

        {form.role === 'dept-lead' && (
          <>
            <div style={styles.label}>Departamento</div>
            <div style={styles.chips}>
              {depts.map(d => (
                <button
                  key={d.id}
                  style={{
                    ...styles.chip,
                    background: form.dept === d.id ? '#2196F322' : 'transparent',
                    borderColor: form.dept === d.id ? '#2196F3' : 'var(--border)',
                    color: form.dept === d.id ? '#2196F3' : 'var(--text-muted)',
                  }}
                  onClick={() => set('dept', d.id)}
                >
                  {d.name}
                </button>
              ))}
            </div>
          </>
        )}

        {isNew && (
          <>
            <div style={styles.label}>ID de login</div>
            <input
              style={styles.input}
              placeholder="Ej. carlos"
              value={form.loginId}
              onChange={e => set('loginId', e.target.value.toLowerCase().replace(/\s/g, ''))}
            />
            <div style={styles.idHint}>Con este ID el usuario selecciona su perfil al iniciar sesión.</div>
          </>
        )}

        {error && <div style={styles.errorMsg}>{error}</div>}

        <div style={styles.actions}>
          {!isNew && user.id !== currentUserId && (
            <button style={styles.btnDelete} onClick={() => onDelete(user.id)}>
              <Trash2 size={18} />
            </button>
          )}
          <button style={styles.btnSecondary} onClick={onClose}>Cancelar</button>
          <button style={styles.btnPrimary} onClick={handleSave}>Guardar</button>
        </div>
      </div>
    </div>
  )
}

export default function Users() {
  const { currentUser } = useAuth()
  const { users, addUser, updateUser, deleteUser } = useUsers()
  const [modal, setModal] = useState(null) // null | { mode: 'add' } | { mode: 'edit', user }

  const existingIds = users.map(u => u.id)

  const handleSave = (data) => {
    if (modal.mode === 'add') addUser(data)
    else updateUser(data.id, data)
    setModal(null)
  }

  const handleDelete = (id) => {
    deleteUser(id)
    setModal(null)
  }

  return (
    <>
      <TopBar title="Usuarios" />
      <div className="page">
        <div style={styles.section} className="fade-in">
          Equipo — {users.length} {users.length === 1 ? 'miembro' : 'miembros'}
        </div>

        {users.map(user => {
          const cfg = roleConfig[user.role]
          const isMe = user.id === currentUser?.id
          return (
            <div
              key={user.id}
              style={styles.card}
              onClick={() => setModal({ mode: 'edit', user })}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
              className="fade-in"
            >
              <div style={{ ...styles.avatar, background: cfg?.color || 'var(--accent-red)' }}>
                {user.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>
                  {user.name}{isMe && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>• Tú</span>}
                </div>
                <div>
                  <span style={{ ...styles.roleBadge, background: `${cfg?.color}22`, color: cfg?.color }}>
                    {cfg?.label}
                  </span>
                  {user.dept && (
                    <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 8 }}>
                      {deptNames[user.dept]}
                    </span>
                  )}
                </div>
              </div>
              <ChevronRight size={18} color="var(--text-muted)" />
            </div>
          )
        })}
      </div>

      {modal && (
        <UserModal
          user={modal.user}
          isNew={modal.mode === 'add'}
          existingIds={existingIds}
          currentUserId={currentUser?.id}
          onClose={() => setModal(null)}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}

      <button style={styles.fab} onClick={() => setModal({ mode: 'add' })}>
        <Plus size={26} color="#fff" />
      </button>

      <BottomNav />
    </>
  )
}
