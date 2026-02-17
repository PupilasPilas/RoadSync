import { useState } from 'react'
import { ScanLine, Check, X, Truck, ChevronDown } from 'lucide-react'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import { useAuth } from '../context/AuthContext'
import { items, trucks, scanHistory as initialHistory, users } from '../data/mockData'

const getUserName = (userId) => {
  const user = users.find(u => u.id === userId)
  return user ? user.name : userId
}

const styles = {
  scanner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 24,
  },
  viewfinder: {
    width: 260,
    height: 260,
    borderRadius: 20,
    border: '2px solid var(--border)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    background: '#111',
    marginBottom: 24,
  },
  corner: (top, left) => ({
    position: 'absolute',
    width: 30,
    height: 30,
    ...(top ? { top: -1 } : { bottom: -1 }),
    ...(left ? { left: -1 } : { right: -1 }),
    borderColor: 'var(--accent-red)',
    borderStyle: 'solid',
    borderWidth: 0,
    ...(top && left ? { borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 12 } : {}),
    ...(top && !left ? { borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 12 } : {}),
    ...(!top && left ? { borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 12 } : {}),
    ...(!top && !left ? { borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 12 } : {}),
  }),
  scanLineAnim: {
    position: 'absolute',
    left: 20,
    right: 20,
    height: 2,
    background: 'var(--accent-red)',
    boxShadow: '0 0 10px var(--accent-red)',
    animation: 'scanLine 2s ease-in-out infinite',
  },
  scanBtn: {
    width: '100%',
    maxWidth: 300,
    padding: '16px 0',
    borderRadius: 'var(--radius)',
    background: 'var(--accent-red)',
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    boxShadow: '0 4px 20px rgba(227, 6, 19, 0.4)',
    transition: 'transform 0.15s',
  },
  result: {
    textAlign: 'center',
    padding: 24,
    borderRadius: 'var(--radius)',
    marginBottom: 24,
    animation: 'checkmark 0.4s ease-out',
  },
  resultIcon: {
    width: 56,
    height: 56,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 12px',
  },
  resultTitle: {
    fontSize: 16,
    fontWeight: 700,
    marginBottom: 4,
  },
  resultMsg: {
    fontSize: 13,
    color: 'var(--text-muted)',
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    marginBottom: 12,
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 14px',
    background: 'var(--surface)',
    borderRadius: 'var(--radius-sm)',
    marginBottom: 8,
    border: '1px solid var(--border)',
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    flexShrink: 0,
  },
  truckSelector: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: '12px 16px',
    marginBottom: 20,
    border: '1px solid var(--border)',
    width: '100%',
    maxWidth: 300,
    cursor: 'pointer',
    position: 'relative',
  },
  truckDropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    marginTop: 4,
    zIndex: 10,
    overflow: 'hidden',
  },
  truckOption: {
    padding: '12px 16px',
    fontSize: 14,
    cursor: 'pointer',
    borderBottom: '1px solid var(--border)',
    transition: 'background 0.15s',
    textAlign: 'left',
    width: '100%',
    background: 'none',
    color: 'var(--text)',
  },
  disabledBtn: {
    width: '100%',
    maxWidth: 300,
    padding: '16px 0',
    borderRadius: 'var(--radius)',
    background: 'var(--border)',
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    cursor: 'not-allowed',
  },
}

export default function Scan() {
  const { currentUser } = useAuth()
  const role = currentUser?.role
  const [scanResult, setScanResult] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [history, setHistory] = useState(initialHistory)
  const [selectedTruck, setSelectedTruck] = useState(null)
  const [showTruckDropdown, setShowTruckDropdown] = useState(false)

  const isLoadLead = role === 'load-lead'
  const isDeptLead = role === 'dept-lead'

  const handleScan = () => {
    if (isLoadLead && !selectedTruck) return

    setScanning(true)
    setScanResult(null)

    setTimeout(() => {
      setScanning(false)
      let result

      if (isDeptLead) {
        // Dept-lead: marks items as ready-to-load
        const deptPendingItems = items.filter(i => i.dept === currentUser.dept && i.status === 'pending')
        const deptOtherItems = items.filter(i => i.dept !== currentUser.dept)

        const roll = Math.random()
        if (roll < 0.2 && deptOtherItems.length > 0) {
          // Error: item not from their dept
          const item = deptOtherItems[Math.floor(Math.random() * deptOtherItems.length)]
          result = {
            type: 'error',
            itemId: item.id,
            itemName: item.name,
            message: 'Error: este ítem no pertenece a tu departamento',
          }
        } else if (deptPendingItems.length > 0) {
          const item = deptPendingItems[Math.floor(Math.random() * deptPendingItems.length)]
          result = {
            type: 'success',
            itemId: item.id,
            itemName: item.name,
            message: 'Marcado como listo para cargar',
          }
        } else {
          result = {
            type: 'success',
            itemId: `${currentUser.dept.toUpperCase()}-01`,
            itemName: 'Ítem de prueba',
            message: 'Marcado como listo para cargar',
          }
        }
      } else {
        // Load-lead: marks ready-to-load items as loaded + assigns truck
        const readyItems = items.filter(i => i.status === 'ready-to-load')
        const notReadyItems = items.filter(i => i.status === 'pending')
        const truckName = trucks.find(t => t.id === selectedTruck)?.name || selectedTruck

        const roll = Math.random()
        if (roll < 0.2 && notReadyItems.length > 0) {
          const item = notReadyItems[Math.floor(Math.random() * notReadyItems.length)]
          result = {
            type: 'error',
            itemId: item.id,
            itemName: item.name,
            message: 'Error: el ítem no está listo para cargar',
          }
        } else if (readyItems.length > 0) {
          const item = readyItems[Math.floor(Math.random() * readyItems.length)]
          result = {
            type: 'success',
            itemId: item.id,
            itemName: item.name,
            message: `Cargado en ${truckName}`,
          }
        } else {
          result = {
            type: 'success',
            itemId: 'AUDIO-06',
            itemName: 'Rack Monitor',
            message: `Cargado en ${truckName}`,
          }
        }
      }

      setScanResult(result)

      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
      setHistory(prev => [
        {
          id: Date.now(),
          itemId: result.itemId,
          itemName: result.itemName,
          result: result.type === 'success' ? 'success' : 'error',
          message: result.message,
          time: timeStr,
          userId: currentUser.id,
        },
        ...prev,
      ])

      if (navigator.vibrate) {
        navigator.vibrate(result.type === 'success' ? 100 : [100, 50, 100])
      }
    }, 1500)
  }

  const canScan = isDeptLead || (isLoadLead && selectedTruck)

  return (
    <>
      <TopBar title="Escaneo" />
      <div className="page" style={{ textAlign: 'center' }}>
        {/* Load-lead truck selector */}
        {isLoadLead && (
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }} className="fade-in">
            <div style={{ position: 'relative', width: '100%', maxWidth: 300 }}>
              <div
                style={{
                  ...styles.truckSelector,
                  borderColor: selectedTruck ? 'var(--accent-red)' : 'var(--border)',
                }}
                onClick={() => setShowTruckDropdown(!showTruckDropdown)}
              >
                <Truck size={18} color={selectedTruck ? 'var(--accent-red)' : 'var(--text-muted)'} />
                <span style={{ flex: 1, fontSize: 14, textAlign: 'left', color: selectedTruck ? 'var(--text)' : 'var(--text-muted)' }}>
                  {selectedTruck ? trucks.find(t => t.id === selectedTruck)?.name : 'Seleccionar camión...'}
                </span>
                <ChevronDown size={16} color="var(--text-muted)" />
              </div>
              {showTruckDropdown && (
                <div style={styles.truckDropdown}>
                  {trucks.map(t => (
                    <button
                      key={t.id}
                      style={{
                        ...styles.truckOption,
                        background: selectedTruck === t.id ? 'var(--surface-hover)' : 'transparent',
                      }}
                      onClick={() => { setSelectedTruck(t.id); setShowTruckDropdown(false) }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--surface-hover)'}
                      onMouseLeave={e => e.currentTarget.style.background = selectedTruck === t.id ? 'var(--surface-hover)' : 'transparent'}
                    >
                      {t.name} — {t.assignedTo}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        <div style={styles.scanner} className="fade-in">
          <div style={styles.viewfinder}>
            <div style={styles.corner(true, true)} />
            <div style={styles.corner(true, false)} />
            <div style={styles.corner(false, true)} />
            <div style={styles.corner(false, false)} />
            {scanning && <div style={styles.scanLineAnim} />}
            {!scanning && !scanResult && (
              <ScanLine size={48} color="var(--text-muted)" style={{ opacity: 0.3 }} />
            )}
            {scanResult && (
              <div style={{
                ...styles.resultIcon,
                background: scanResult.type === 'success' ? 'var(--status-ok)' : 'var(--status-error)',
                width: 70,
                height: 70,
                animation: 'checkmark 0.4s ease-out',
              }}>
                {scanResult.type === 'success' ? <Check size={36} color="#fff" /> : <X size={36} color="#fff" />}
              </div>
            )}
          </div>

          {scanResult && (
            <div
              style={{
                ...styles.result,
                background: scanResult.type === 'success' ? 'rgba(0,200,83,0.1)' : 'rgba(227,6,19,0.1)',
                border: `1px solid ${scanResult.type === 'success' ? 'var(--status-ok)' : 'var(--status-error)'}33`,
              }}
              className="fade-in"
            >
              <div style={{
                ...styles.resultTitle,
                color: scanResult.type === 'success' ? 'var(--status-ok)' : 'var(--status-error)',
              }}>
                {scanResult.itemId} — {scanResult.itemName}
              </div>
              <div style={styles.resultMsg}>{scanResult.message}</div>
            </div>
          )}

          {canScan ? (
            <button
              style={{
                ...styles.scanBtn,
                opacity: scanning ? 0.7 : 1,
                transform: scanning ? 'scale(0.98)' : 'scale(1)',
              }}
              onClick={handleScan}
              disabled={scanning}
            >
              <ScanLine size={20} />
              {scanning ? 'ESCANEANDO...' : 'ESCANEAR'}
            </button>
          ) : (
            <div style={styles.disabledBtn}>
              <ScanLine size={20} />
              SELECCIONA UN CAMIÓN
            </div>
          )}
        </div>

        <div style={{ textAlign: 'left' }}>
          <div style={styles.historyTitle}>Últimos escaneos</div>
          {history.map(scan => (
            <div key={scan.id} style={styles.historyItem}>
              <div style={{
                ...styles.historyDot,
                background: scan.result === 'success' ? 'var(--status-ok)' : 'var(--status-error)',
              }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{scan.itemId} — {scan.itemName}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                  {scan.message} — Escaneado por {getUserName(scan.userId)}
                </div>
              </div>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{scan.time}</span>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </>
  )
}
