import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const styles = {
  bar: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 'env(safe-area-inset-top, 0px)',
    background: 'var(--bg)',
    borderBottom: '1px solid var(--border)',
    zIndex: 100,
  },
  barInner: {
    height: 'var(--topbar-height)',
    display: 'flex',
    alignItems: 'center',
    padding: '0 16px',
    gap: 12,
    maxWidth: 640,
    margin: '0 auto',
  },
  backBtn: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  title: {
    fontSize: 16,
    fontWeight: 600,
    flex: 1,
  },
  actions: {
    display: 'flex',
    gap: 8,
  },
  userArea: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 'var(--radius-sm)',
    transition: 'background 0.2s',
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: '50%',
    background: 'var(--accent-red)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 11,
    fontWeight: 700,
    letterSpacing: '0.5px',
    flexShrink: 0,
  },
  userName: {
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--text-muted)',
    maxWidth: 80,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}

export default function TopBar({ title, showBack = false, actions }) {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  return (
    <div style={styles.bar}>
      <div style={styles.barInner}>
        {showBack && (
          <button style={styles.backBtn} onClick={() => navigate(-1)}>
            <ChevronLeft size={22} />
          </button>
        )}
        <span style={styles.title}>{title}</span>
        {actions && <div style={styles.actions}>{actions}</div>}
        {currentUser && (
          <div
            style={styles.userArea}
            onClick={handleLogout}
            title="Cerrar sesión"
            onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <span style={styles.userName}>{currentUser.name.split(' ')[0]}</span>
            <div style={styles.avatar}>{currentUser.avatar}</div>
          </div>
        )}
      </div>
    </div>
  )
}
