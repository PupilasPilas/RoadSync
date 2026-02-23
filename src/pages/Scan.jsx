import { useState, useRef, useEffect } from 'react'
import { ScanLine, Check, X, Truck, ChevronDown, StopCircle, Keyboard } from 'lucide-react'
import { Html5Qrcode } from 'html5-qrcode'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import { useAuth } from '../context/AuthContext'
import { usePhase } from '../context/PhaseContext'
import { useItems } from '../context/ItemsContext'
import { useTrucks } from '../context/TrucksContext'
import { useUsers } from '../context/UsersContext'

const CAMERA_DIV_ID = 'qr-reader'

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
    fontFamily: 'inherit',
  },
  stopBtn: {
    width: '100%',
    maxWidth: 300,
    padding: '16px 0',
    borderRadius: 'var(--radius)',
    background: 'var(--surface)',
    fontSize: 16,
    fontWeight: 700,
    letterSpacing: '2px',
    textTransform: 'uppercase',
    color: 'var(--text-muted)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    border: '1px solid var(--border)',
    fontFamily: 'inherit',
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
    fontFamily: 'inherit',
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
  manualRow: {
    display: 'flex',
    gap: 8,
    width: '100%',
    maxWidth: 300,
    marginTop: 12,
  },
  manualInput: {
    flex: 1,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 12px',
    fontSize: 13,
    color: 'var(--text)',
    fontFamily: 'inherit',
    outline: 'none',
  },
  manualBtn: {
    padding: '10px 14px',
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-red)',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    fontFamily: 'inherit',
  },
}

export default function Scan() {
  const { currentUser } = useAuth()
  const { phase } = usePhase()
  const { items, updateItemStatus, addHistoryEntry } = useItems()
  const { trucks } = useTrucks()
  const { users } = useUsers()
  const role = currentUser?.role
  const [scanResult, setScanResult] = useState(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [history, setHistory] = useState([])
  const [selectedTruck, setSelectedTruck] = useState(null)
  const [showTruckDropdown, setShowTruckDropdown] = useState(false)
  const [manualCode, setManualCode] = useState('')
  const [showManual, setShowManual] = useState(false)
  const html5QrcodeRef = useRef(null)

  const isLoadLead = role === 'load-lead'
  const isDeptLead = role === 'dept-lead'
  const isDescarga = phase === 'Descarga'

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : userId
  }

  // Cleanup camera on unmount
  useEffect(() => {
    return () => { stopCamera(true) }
  }, [])

  const processScannedCode = (code) => {
    const trimmed = code.trim().toUpperCase()
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    const item = items.find(i => i.id === trimmed)
    let result

    if (!item) {
      result = { type: 'error', itemId: trimmed, itemName: '—', message: 'Ítem no encontrado en el sistema' }
    } else if (isDescarga) {
      if (item.status !== 'loaded') {
        result = { type: 'error', itemId: item.id, itemName: item.name, message: 'Error: el ítem no está cargado en camión' }
      } else {
        updateItemStatus(item.id, 'descargado')
        addHistoryEntry(item.id, { action: 'Descargado', userId: currentUser.id, time: timeStr })
        result = { type: 'success', itemId: item.id, itemName: item.name, message: 'Descargado correctamente' }
      }
    } else if (isDeptLead) {
      if (item.dept !== currentUser.dept) {
        result = { type: 'error', itemId: item.id, itemName: item.name, message: 'Error: este ítem no pertenece a tu departamento' }
      } else if (item.status !== 'pending') {
        result = { type: 'error', itemId: item.id, itemName: item.name, message: `El ítem ya está en estado: ${item.status}` }
      } else {
        updateItemStatus(item.id, 'ready-to-load')
        addHistoryEntry(item.id, { action: 'Marcado como listo para cargar', userId: currentUser.id, time: timeStr })
        result = { type: 'success', itemId: item.id, itemName: item.name, message: 'Marcado como listo para cargar' }
      }
    } else {
      // Load-lead carga
      if (item.status !== 'ready-to-load') {
        result = { type: 'error', itemId: item.id, itemName: item.name, message: 'Error: el ítem no está listo para cargar' }
      } else {
        const truckName = trucks.find(t => t.id === selectedTruck)?.name || selectedTruck
        updateItemStatus(item.id, 'loaded', selectedTruck)
        addHistoryEntry(item.id, { action: `Cargado en ${truckName}`, userId: currentUser.id, time: timeStr })
        result = { type: 'success', itemId: item.id, itemName: item.name, message: `Cargado en ${truckName}` }
      }
    }

    setScanResult(result)
    setHistory(prev => [{
      id: Date.now(),
      itemId: result.itemId,
      itemName: result.itemName,
      result: result.type,
      message: result.message,
      time: timeStr,
      userId: currentUser.id,
    }, ...prev])

    if (navigator.vibrate) {
      navigator.vibrate(result.type === 'success' ? 100 : [100, 50, 100])
    }
  }

  const startCamera = async () => {
    setScanResult(null)
    setCameraActive(true)
    // Wait for DOM to mount the div
    await new Promise(r => setTimeout(r, 100))
    const html5Qrcode = new Html5Qrcode(CAMERA_DIV_ID)
    html5QrcodeRef.current = html5Qrcode
    try {
      await html5Qrcode.start(
        { facingMode: 'environment' },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decodedText) => {
          stopCamera()
          processScannedCode(decodedText)
        },
        () => {} // ignore per-frame errors
      )
    } catch {
      setCameraActive(false)
      html5QrcodeRef.current = null
    }
  }

  const stopCamera = async (silent = false) => {
    if (html5QrcodeRef.current) {
      try { await html5QrcodeRef.current.stop() } catch { /* ignore */ }
      html5QrcodeRef.current = null
    }
    if (!silent) setCameraActive(false)
  }

  const handleManualSubmit = () => {
    if (!manualCode.trim()) return
    stopCamera()
    processScannedCode(manualCode)
    setManualCode('')
    setShowManual(false)
  }

  const canScan = isDescarga
    ? isLoadLead
    : isDeptLead || (isLoadLead && selectedTruck)

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
                <div style={{ ...styles.historyDot, background: scan.result === 'success' ? 'var(--status-ok)' : 'var(--status-error)' }} />
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

  return (
    <>
      <TopBar title="Escaneo" />
      <div className="page" style={{ textAlign: 'center' }}>
        <div style={styles.scanner} className="fade-in">
          <div style={styles.viewfinder}>
            {!cameraActive && (
              <>
                <div style={styles.corner(true, true)} />
                <div style={styles.corner(true, false)} />
                <div style={styles.corner(false, true)} />
                <div style={styles.corner(false, false)} />
              </>
            )}
            {!cameraActive && !scanResult && (
              <ScanLine size={48} color="var(--text-muted)" style={{ opacity: 0.3 }} />
            )}
            {cameraActive && (
              <div
                id={CAMERA_DIV_ID}
                style={{ width: '100%', height: '100%', borderRadius: 18, overflow: 'hidden' }}
              />
            )}
            {!cameraActive && scanResult && (
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

          {scanResult && !cameraActive && (
            <div
              style={{
                ...styles.result,
                background: scanResult.type === 'success' ? 'rgba(0,200,83,0.1)' : 'rgba(227,6,19,0.1)',
                border: `1px solid ${scanResult.type === 'success' ? 'var(--status-ok)' : 'var(--status-error)'}33`,
              }}
              className="fade-in"
            >
              <div style={{ ...styles.resultTitle, color: scanResult.type === 'success' ? 'var(--status-ok)' : 'var(--status-error)' }}>
                {scanResult.itemId} — {scanResult.itemName}
              </div>
              <div style={styles.resultMsg}>{scanResult.message}</div>
            </div>
          )}

          {/* Truck selector — load-lead carga */}
          {isLoadLead && !isDescarga && (
            <div style={{ position: 'relative', width: '100%', maxWidth: 300, marginBottom: 16 }}>
              <div
                style={{ ...styles.truckSelector, marginBottom: 0, borderColor: selectedTruck ? 'var(--accent-red)' : 'var(--border)' }}
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
                      style={{ ...styles.truckOption, background: selectedTruck === t.id ? 'var(--surface-hover)' : 'transparent' }}
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

          {/* Scan / Stop button */}
          {cameraActive ? (
            <button style={styles.stopBtn} onClick={() => stopCamera()}>
              <StopCircle size={20} />
              DETENER CÁMARA
            </button>
          ) : canScan ? (
            <button style={styles.scanBtn} onClick={startCamera}>
              <ScanLine size={20} />
              ESCANEAR
            </button>
          ) : (
            <div style={styles.disabledBtn}>
              <ScanLine size={20} />
              SELECCIONA UN CAMIÓN
            </div>
          )}

          {/* Manual input fallback */}
          {canScan && !cameraActive && (
            <div style={{ marginTop: 12 }}>
              <button
                style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: 12, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'inherit' }}
                onClick={() => setShowManual(v => !v)}
              >
                <Keyboard size={14} />
                Ingresar código manual
              </button>
              {showManual && (
                <div style={styles.manualRow}>
                  <input
                    type="text"
                    value={manualCode}
                    onChange={e => setManualCode(e.target.value)}
                    placeholder="Ej: AUDIO-08"
                    style={styles.manualInput}
                    onKeyDown={e => e.key === 'Enter' && handleManualSubmit()}
                    autoCapitalize="characters"
                  />
                  <button style={styles.manualBtn} onClick={handleManualSubmit}>OK</button>
                </div>
              )}
            </div>
          )}
        </div>

        <div style={{ textAlign: 'left' }}>
          <div style={styles.historyTitle}>Últimos escaneos</div>
          {history.length === 0 && (
            <div style={{ fontSize: 13, color: 'var(--text-muted)', textAlign: 'center', paddingTop: 16 }}>
              Sin escaneos en esta sesión
            </div>
          )}
          {history.map(scan => (
            <div key={scan.id} style={styles.historyItem}>
              <div style={{ ...styles.historyDot, background: scan.result === 'success' ? 'var(--status-ok)' : 'var(--status-error)' }} />
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
