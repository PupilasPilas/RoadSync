import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutGrid, Box, ScanLine, Truck } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const tabsByRole = {
  admin: [
    { path: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { path: '/inventory', icon: Box, label: 'Inventario' },
    { path: '/trucks', icon: Truck, label: 'Camiones' },
  ],
  'dept-lead': [
    { path: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { path: '/inventory', icon: Box, label: 'Inventario' },
    { path: '/scan', icon: ScanLine, label: 'Escaneo', isScan: true },
  ],
  'load-lead': [
    { path: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { path: '/inventory', icon: Box, label: 'Inventario' },
    { path: '/scan', icon: ScanLine, label: 'Escaneo', isScan: true },
    { path: '/trucks', icon: Truck, label: 'Camiones' },
  ],
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 'var(--nav-height)',
    background: 'var(--surface)',
    borderTop: '1px solid var(--border)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 'env(safe-area-inset-bottom, 0)',
    zIndex: 100,
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '8px 12px',
    borderRadius: 12,
    transition: 'all 0.2s',
    position: 'relative',
    minWidth: 56,
  },
  label: {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.3px',
  },
  scanBtn: {
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'var(--accent-red)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -20,
    boxShadow: '0 4px 20px rgba(227, 6, 19, 0.4)',
  },
}

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const tabs = tabsByRole[currentUser?.role] || tabsByRole.admin

  return (
    <nav style={styles.nav}>
      {tabs.map((tab) => {
        const isActive = location.pathname === tab.path
        const Icon = tab.icon

        if (tab.isScan) {
          return (
            <button
              key={tab.path}
              style={styles.tab}
              onClick={() => navigate(tab.path)}
            >
              <div style={styles.scanBtn}>
                <Icon size={24} color="#fff" />
              </div>
              <span style={{ ...styles.label, color: isActive ? '#fff' : 'var(--text-muted)' }}>
                {tab.label}
              </span>
            </button>
          )
        }

        return (
          <button
            key={tab.path}
            style={styles.tab}
            onClick={() => navigate(tab.path)}
          >
            <Icon size={22} color={isActive ? '#fff' : 'var(--text-muted)'} />
            <span style={{ ...styles.label, color: isActive ? '#fff' : 'var(--text-muted)' }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
