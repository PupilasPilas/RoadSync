import { useLocation, useNavigate } from 'react-router-dom'
import { LayoutGrid, Box, ScanLine, Truck, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const tabsByRole = {
  admin: [
    { path: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { path: '/inventory', icon: Box, label: 'Inventario' },
    { path: '/trucks', icon: Truck, label: 'Camiones' },
    { path: '/users', icon: Users, label: 'Usuarios' },
  ],
  'dept-lead': [
    { path: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { path: '/scan', icon: ScanLine, label: 'Escaneo', isScan: true },
    { path: '/inventory', icon: Box, label: 'Inventario' },
  ],
  'load-lead': [
    { path: '/dashboard', icon: LayoutGrid, label: 'Dashboard' },
    { path: '/scan', icon: ScanLine, label: 'Escaneo', isScan: true },
    { path: '/inventory', icon: Box, label: 'Inventario' },
    { path: '/trucks', icon: Truck, label: 'Camiones' },
  ],
}

const styles = {
  nav: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 'calc(var(--nav-height) + env(safe-area-inset-bottom, 0px))',
    background: 'var(--surface)',
    borderTop: '1px solid var(--border)',
    zIndex: 100,
  },
  navInner: {
    height: 'var(--nav-height)',
    display: 'flex',
    alignItems: 'center',
    maxWidth: 640,
    margin: '0 auto',
  },
  tabGroup: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '8px 12px',
    borderRadius: 12,
    transition: 'all 0.2s',
    minWidth: 56,
  },
  label: {
    fontSize: 10,
    fontWeight: 500,
    letterSpacing: '0.3px',
  },
  scanTab: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 4,
    padding: '8px 12px',
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

function RegularTab({ tab, isActive, onNavigate }) {
  const Icon = tab.icon
  return (
    <button style={styles.tab} onClick={() => onNavigate(tab.path)}>
      <Icon size={22} color={isActive ? '#fff' : 'var(--text-muted)'} />
      <span style={{ ...styles.label, color: isActive ? '#fff' : 'var(--text-muted)' }}>
        {tab.label}
      </span>
    </button>
  )
}

export default function BottomNav() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const tabs = tabsByRole[currentUser?.role] || tabsByRole.admin
  const scanIdx = tabs.findIndex(t => t.isScan)

  if (scanIdx === -1) {
    // Admin: no scan button, distribute evenly
    return (
      <nav style={styles.nav}>
        <div style={{ ...styles.navInner, justifyContent: 'space-around' }}>
          {tabs.map(tab => (
            <RegularTab
              key={tab.path}
              tab={tab}
              isActive={location.pathname === tab.path}
              onNavigate={navigate}
            />
          ))}
        </div>
      </nav>
    )
  }

  const leftTabs = tabs.slice(0, scanIdx)
  const scanTab = tabs[scanIdx]
  const rightTabs = tabs.slice(scanIdx + 1)
  const Icon = scanTab.icon
  const scanActive = location.pathname === scanTab.path

  return (
    <nav style={styles.nav}>
      <div style={styles.navInner}>
        <div style={styles.tabGroup}>
          {leftTabs.map(tab => (
            <RegularTab
              key={tab.path}
              tab={tab}
              isActive={location.pathname === tab.path}
              onNavigate={navigate}
            />
          ))}
        </div>

        <button style={styles.scanTab} onClick={() => navigate(scanTab.path)}>
          <div style={styles.scanBtn}>
            <Icon size={24} color="#fff" />
          </div>
          <span style={{ ...styles.label, color: scanActive ? '#fff' : 'var(--text-muted)' }}>
            {scanTab.label}
          </span>
        </button>

        <div style={styles.tabGroup}>
          {rightTabs.map(tab => (
            <RegularTab
              key={tab.path}
              tab={tab}
              isActive={location.pathname === tab.path}
              onNavigate={navigate}
            />
          ))}
        </div>
      </div>
    </nav>
  )
}
