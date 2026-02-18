import { useState } from 'react'
import { ScanLine, Check, X, Truck, ChevronDown } from 'lucide-react'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import { useAuth } from '../context/AuthContext'
import { usePhase } from '../context/PhaseContext'
import { useItems } from '../context/ItemsContext'
import { trucks, scanHistory as initialHistory, users } from '../data/mockData'

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
  const { phase } = usePhase()
  const { items, updateItemStatus, addHistoryEntry } = useItems()
  const role = currentUser?.role
  const [scanResult, setScanResult] = useState(null)
  const [scanning, setScanning] = useState(false)
  const [history, setHistory] = useState(initialHistory)
  const [selectedTruck, setSelectedTruck] = useState(null)
  const [showTruckDropdown, setShowTruckDropdown] = useState(false)

  const isLoadLead = role === 'load-lead'
  const isDeptLead = role === 'dept-lead'
  const isDescarga = phase === 'Descarga'

  const handleScan = () => {
    // In Descarga phase, only load-lead can scan
    if (isDescarga && !isLoadLead) return
    // In Carga phase, load-lead needs a truck selected
    if (!isDescarga && isLoadLead && !selectedTruck) return

    setScanning(true)
    setScanResult(null)

    setTimeout(() => {
      setScanning(false)
      let result
      let scannedItemId = null  // id del ítem real escaneado (null en casos de error/fallback)

      if (isDescarga) {
        // Load-lead descarga: loaded → descargado
        const loadedItems = items.filter(i => i.status === 'loaded')
        const notLoadedItems = items.filter(i => i.status !== 'loaded')
        const roll = Math.random()
        if (roll < 0.2 && notLoadedItems.length > 0) {
          const item = notLoadedItems[Math.floor(Math.random() * notLoadedItems.length)]
          result = { type: 'error', itemId: item.id, itemName: item.name, message: 'Error: el ítem no está cargado en camión' }
        } else if (loadedItems.length > 0) {
          const item = loadedItems[Math.floor(Math.random() * loadedItems.length)]
          scannedItemId = item.id
          result = { type: 'success', itemId: item.id, itemName: item.name, message: 'Descargado correctamente' }
        } else {
          result = { type: 'success', itemId: '—', itemName: 'Sin ítems cargados', message: 'No hay ítems cargados para descargar' }
        }
      } else if (isDeptLead) {
        // Dept-lead carga: pending → ready-to-load
        const deptPendingItems = items.filter(i => i.dept === currentUser.dept && i.status === 'pending')
        const deptOtherItems = items.filter(i => i.dept !== currentUser.dept)
        const roll = Math.random()
        if (roll < 0.2 && deptOtherItems.length > 0) {
          const item = deptOtherItems[Math.floor(Math.random() * deptOtherItems.length)]
          result = { type: 'error', itemId: item.id, itemName: item.name, message: 'Error: este ítem no pertenece a tu departamento' }
        } else if (deptPendingItems.length > 0) {
          const item = deptPendingItems[Math.floor(Math.random() * deptPendingItems.length)]
          scannedItemId = item.id
          result = { type: 'success', itemId: item.id, itemName: item.name, message: 'Marcado como listo para cargar' }
        } else {
          result = { type: 'success', itemId: '—', itemName: 'Sin pendientes', message: 'Todos los ítems ya están listos' }
        }
      } else {
        // Load-lead carga: ready-to-load → loaded
        const readyItems = items.filter(i => i.status === 'ready-to-load')
        const notReadyItems = items.filter(i => i.status === 'pending')
        const truckName = trucks.find(t => t.id === selectedTruck)?.name || selectedTruck
        const roll = Math.random()
        if (roll < 0.2 && notReadyItems.length > 0) {
          const item = notReadyItems[Math.floor(Math.random() * notReadyItems.length)]
          result = { type: 'error', itemId: item.id, itemName: item.name, message: 'Error: el ítem no está listo para cargar' }
        } else if (readyItems.length > 0) {
          const item = readyItems[Math.floor(Math.random() * readyItems.length)]
          scannedItemId = item.id
          result = { type: 'success', itemId: item.id, itemName: item.name, message: `Cargado en ${truckName}` }
        } else {
          result = { type: 'success', itemId: '—', itemName: 'Sin listos', message: 'No hay ítems listos para cargar' }
        }
      }

      // Actualizar estado real del ítem escaneado
      const now = new Date()
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

      if (scannedItemId) {
        const newStatus = isDescarga ? 'descargado' : isDeptLead ? 'ready-to-load' : 'loaded'
        updateItemStatus(scannedItemId, newStatus)
        addHistoryEntry(scannedItemId, { action: result.message, userId: currentUser.id, time: timeStr })
      }

      setScanResult(result)
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

  // Dept-lead in Descarga phase: read-only
  if (isDescarga && isDeptLead) {
    return (
      <>
        <TopBar title="Escaneo" />
        <div className="page" style={{ textAlign: 'center' }}>
          <div style={{
            background: 'var(--surface)',
            borderRadius: 'var(--radius)',
            padding: 32,
            border: '1px solid var(--border)',
            marginTop: 24,
          }} className="fade-in">
            <ScanLine size={48} color="var(--text-muted)" style={{ opacity: 0.3, marginBottom: 16 }} />
            <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>Fase de Descarga</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>
              Solo el Jefe de Carga opera el escaneo en esta fase.
            </div>
          </div>

          <div style={{ textAlign: 'left', marginTop: 24 }}>
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

  // Determine if scan button should be active
  const canScan = isDescarga
    ? isLoadLead
    : isDeptLead || (isLoadLead && selectedTruck)

  return (
    <>
      <TopBar title="Escaneo" />
      <div className="page" style={{ textAlign: 'center' }}>
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

          {/* Truck selector — below viewfinder, above scan button */}
          {isLoadLead && !isDescarga && (
            <div style={{ position: 'relative', width: '100%', maxWidth: 300, marginBottom: 16 }}>
              <div
                style={{
                  ...styles.truckSelector,
                  marginBottom: 0,
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
                <div style={{ ...styles.truckDropdown, bottom: '100%', top: 'auto', marginTop: 0, marginBottom: 4 }}>
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
