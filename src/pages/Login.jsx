import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Shield, Users, Package, ChevronLeft } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useUsers } from '../context/UsersContext'

const roles = [
  { id: 'admin', label: 'Admin', desc: 'Control total del sistema', icon: Shield },
  { id: 'dept-lead', label: 'Jefe de Depto', desc: 'Gestión por departamento', icon: Users },
  { id: 'load-lead', label: 'Jefe de Carga', desc: 'Control de camiones y escaneo', icon: Package },
]

const deptLabels = {
  audio: 'Audio',
  video: 'Video',
  iluminacion: 'Iluminación',
}

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: 'var(--bg)',
  },
  logo: {
    fontSize: 42,
    fontWeight: 700,
    letterSpacing: '6px',
    textTransform: 'uppercase',
    marginBottom: 8,
    background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: 13,
    color: 'var(--text-muted)',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: 60,
  },
  label: {
    fontSize: 12,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: 16,
  },
  roleBtn: {
    width: '100%',
    maxWidth: 340,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '18px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    marginBottom: 12,
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    background: 'var(--accent-red)22',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleName: {
    fontSize: 16,
    fontWeight: 600,
  },
  roleDesc: {
    fontSize: 12,
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  redLine: {
    width: 60,
    height: 3,
    background: 'var(--accent-red)',
    borderRadius: 2,
    marginBottom: 48,
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    color: 'var(--text-muted)',
    marginBottom: 24,
    cursor: 'pointer',
    background: 'none',
    border: 'none',
    padding: 0,
  },
  userBtn: {
    width: '100%',
    maxWidth: 340,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '16px 20px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    marginBottom: 10,
    transition: 'all 0.2s',
    cursor: 'pointer',
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: 'var(--accent-red)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 14,
    fontWeight: 700,
    letterSpacing: '1px',
    flexShrink: 0,
  },
  userName: {
    fontSize: 15,
    fontWeight: 600,
  },
  userDept: {
    fontSize: 12,
    color: 'var(--text-muted)',
    marginTop: 2,
  },
}

export default function Login() {
  const navigate = useNavigate()
  const { login, currentUser } = useAuth()
  const { users } = useUsers()
  const [selectedRole, setSelectedRole] = useState(null)

  // If already logged in, redirect
  if (currentUser) {
    navigate('/dashboard', { replace: true })
    return null
  }

  const filteredUsers = selectedRole
    ? users.filter(u => u.role === selectedRole)
    : []

  const handleSelectUser = (userId) => {
    login(userId)
    navigate('/dashboard')
  }

  return (
    <div style={styles.container}>
      <div style={styles.logo}>RoadSync</div>
      <div style={styles.redLine} />
      <div style={styles.subtitle}>Tour Logistics</div>

      {!selectedRole ? (
        <>
          <div style={styles.label}>Selecciona tu rol</div>
          {roles.map((role) => {
            const Icon = role.icon
            return (
              <button
                key={role.id}
                style={styles.roleBtn}
                onClick={() => setSelectedRole(role.id)}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--surface-hover)'
                  e.currentTarget.style.borderColor = 'var(--accent-red)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--surface)'
                  e.currentTarget.style.borderColor = 'var(--border)'
                }}
              >
                <div style={styles.iconWrap}>
                  <Icon size={22} color="var(--accent-red)" />
                </div>
                <div style={{ textAlign: 'left' }}>
                  <div style={styles.roleName}>{role.label}</div>
                  <div style={styles.roleDesc}>{role.desc}</div>
                </div>
              </button>
            )
          })}
        </>
      ) : (
        <>
          <button style={styles.backBtn} onClick={() => setSelectedRole(null)}>
            <ChevronLeft size={16} />
            Cambiar rol
          </button>
          <div style={styles.label}>¿Quién eres?</div>
          {filteredUsers.map((user) => (
            <button
              key={user.id}
              style={styles.userBtn}
              onClick={() => handleSelectUser(user.id)}
              onMouseEnter={e => {
                e.currentTarget.style.background = 'var(--surface-hover)'
                e.currentTarget.style.borderColor = 'var(--accent-red)'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = 'var(--surface)'
                e.currentTarget.style.borderColor = 'var(--border)'
              }}
            >
              <div style={styles.avatar}>{user.avatar}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={styles.userName}>{user.name}</div>
                <div style={styles.userDept}>
                  {user.dept ? deptLabels[user.dept] || user.dept : roles.find(r => r.id === user.role)?.label}
                </div>
              </div>
            </button>
          ))}
        </>
      )}
    </div>
  )
}
