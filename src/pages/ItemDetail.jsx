import { useState, useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { Hash, Layers, Clock, Edit2, Truck, X } from 'lucide-react'
import QRCodeLib from 'qrcode'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import StatusBadge from '../components/StatusBadge'
import AnnotationsList from '../components/AnnotationsList'
import { useAuth } from '../context/AuthContext'
import { useItems } from '../context/ItemsContext'
import { useUsers } from '../context/UsersContext'
import { useTrucks } from '../context/TrucksContext'
import { deptNames, deptColors, statusLabels, statusColors } from '../data/mockData'

const styles = {
  header: {
    textAlign: 'center',
    marginBottom: 24,
  },
  itemName: {
    fontSize: 22,
    fontWeight: 700,
    marginBottom: 8,
  },
  itemId: {
    fontSize: 13,
    color: 'var(--text-muted)',
    marginBottom: 16,
  },
  qrContainer: {
    width: 140,
    height: 140,
    margin: '0 auto 20px',
    background: '#fff',
    borderRadius: 12,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  qrGrid: {
    width: 100,
    height: 100,
    display: 'grid',
    gridTemplateColumns: 'repeat(7, 1fr)',
    gridTemplateRows: 'repeat(7, 1fr)',
    gap: 2,
  },
  infoCard: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 16,
    marginBottom: 16,
    border: '1px solid var(--border)',
  },
  infoRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '10px 0',
    borderBottom: '1px solid var(--border)',
  },
  infoLabel: {
    fontSize: 12,
    color: 'var(--text-muted)',
    width: 100,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: 500,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    marginBottom: 12,
  },
  timeline: {
    position: 'relative',
    paddingLeft: 24,
  },
  timelineItem: {
    position: 'relative',
    paddingBottom: 20,
    paddingLeft: 16,
  },
  timelineDot: {
    position: 'absolute',
    left: -6,
    top: 4,
    width: 12,
    height: 12,
    borderRadius: '50%',
    border: '2px solid var(--accent-red)',
    background: 'var(--bg)',
  },
  timelineLine: {
    position: 'absolute',
    left: 0,
    top: 16,
    bottom: 0,
    width: 1,
    background: 'var(--border)',
  },
  timeAction: {
    fontSize: 14,
    fontWeight: 500,
  },
  timeMeta: {
    fontSize: 12,
    color: 'var(--text-muted)',
    marginTop: 2,
  },
  notesPlaceholder: {
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: 20,
    border: '1px solid var(--border)',
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: 13,
    marginBottom: 16,
  },
  actionBtn: {
    width: '100%',
    padding: '13px 0',
    borderRadius: 'var(--radius)',
    fontSize: 14,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  confirmRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '12px 16px',
  },
  confirmText: {
    flex: 1,
    fontSize: 13,
    color: 'var(--text-muted)',
  },
  confirmYes: {
    padding: '8px 18px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13,
    fontWeight: 700,
    background: 'var(--accent-red)',
    color: '#fff',
  },
  confirmNo: {
    padding: '8px 18px',
    borderRadius: 'var(--radius-sm)',
    fontSize: 13,
    fontWeight: 600,
    background: 'var(--border)',
    color: 'var(--text-muted)',
  },
}

function QRCode({ value }) {
  const [dataUrl, setDataUrl] = useState(null)

  useEffect(() => {
    QRCodeLib.toDataURL(value, {
      width: 120,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    }).then(setDataUrl)
  }, [value])

  return (
    <div style={styles.qrContainer}>
      {dataUrl
        ? <img src={dataUrl} alt={`QR ${value}`} style={{ width: 120, height: 120, borderRadius: 4 }} />
        : <div style={{ width: 120, height: 120, background: '#f0f0f0', borderRadius: 4 }} />
      }
    </div>
  )
}

export default function ItemDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const { items, itemHistory, updateItemStatus, addHistoryEntry } = useItems()
  const { users } = useUsers()
  const { trucks } = useTrucks()
  const item = items.find(i => i.id === id)
  const role = currentUser?.role
  const [showEdit, setShowEdit] = useState(false)

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId)
    return user ? user.name : userId
  }

  if (!item) {
    return (
      <>
        <TopBar title="Detalle" showBack />
        <div className="page" style={{ textAlign: 'center', paddingTop: 100 }}>
          <p style={{ color: 'var(--text-muted)' }}>Ítem no encontrado</p>
        </div>
        <BottomNav />
      </>
    )
  }

  const canEdit = role === 'admin' || role === 'load-lead'
  const history = itemHistory[item.id] || []

  const now = () => {
    const d = new Date()
    return `${String(d.getHours()).padStart(2,'0')}:${String(d.getMinutes()).padStart(2,'0')}`
  }

  return (
    <>
      <TopBar
        title={item.id}
        showBack
        onBack={() => {
          const from = location.state?.from
          if (from === '/inventory') {
            navigate('/inventory', { state: { dept: location.state.dept } })
          } else {
            navigate(-1)
          }
        }}
        actions={canEdit ? (
          <button onClick={() => setShowEdit(true)}>
            <Edit2 size={18} color="var(--text-muted)" />
          </button>
        ) : undefined}
      />
      <div className="page">
        <div style={styles.header} className="fade-in">
          <div style={styles.itemName}>{item.name}</div>
          <div style={styles.itemId}>{item.id}</div>
          <StatusBadge status={item.status} large />
        </div>

        <QRCode value={item.id} />

        <div style={styles.infoCard} className="fade-in">
          <div style={styles.infoRow}>
            <Layers size={16} color="var(--text-muted)" />
            <span style={styles.infoLabel}>Departamento</span>
            <span style={{ ...styles.infoValue, color: deptColors[item.dept] }}>{deptNames[item.dept]}</span>
          </div>
          <div style={styles.infoRow}>
            <Hash size={16} color="var(--text-muted)" />
            <span style={styles.infoLabel}>Tipo</span>
            <span style={styles.infoValue}>{item.type}</span>
          </div>
          <div style={{ ...styles.infoRow, borderBottom: 'none' }}>
            <Truck size={16} color="var(--text-muted)" />
            <span style={styles.infoLabel}>Camión</span>
            <span style={{
              ...styles.infoValue,
              color: item.status === 'loaded' && item.truck
                ? 'var(--status-ok)'
                : 'var(--text-muted)',
            }}>
              {item.status === 'loaded' && item.truck
                ? (trucks.find(t => t.id === item.truck)?.name ?? item.truck)
                : '—'}
            </span>
          </div>
        </div>


        <AnnotationsList type="item" entityId={item.id} />

        <div className="fade-in">
          <div style={styles.sectionTitle}>
            <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
            Historial de Movimientos
          </div>
          {history.length === 0 ? (
            <div style={styles.notesPlaceholder}>
              Sin movimientos registrados aún
            </div>
          ) : (
            <div style={styles.timeline}>
              {history.map((entry, i) => (
                <div key={i} style={styles.timelineItem}>
                  <div style={styles.timelineDot} />
                  {i < history.length - 1 && <div style={styles.timelineLine} />}
                  <div style={styles.timeAction}>{entry.action}</div>
                  <div style={styles.timeMeta}>{getUserName(entry.userId)} — {entry.time}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {showEdit && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setShowEdit(false)}
        >
          <div
            style={{ background: 'var(--surface)', borderRadius: '20px 20px 0 0', border: '1px solid var(--border)', borderBottom: 'none', width: '100%', maxWidth: 640, padding: '24px 24px 40px', animation: 'fadeIn 0.2s ease-out' }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <span style={{ fontSize: 17, fontWeight: 700 }}>Cambiar estado</span>
              <button onClick={() => setShowEdit(false)}><X size={22} color="var(--text-muted)" /></button>
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Estado actual: <span style={{ color: statusColors[item.status] }}>{statusLabels[item.status]}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {Object.entries(statusLabels).map(([key, label]) => {
                const color = statusColors[key]
                const isActive = item.status === key
                return (
                  <button
                    key={key}
                    disabled={isActive}
                    style={{
                      padding: '13px 16px', borderRadius: 'var(--radius)', fontSize: 14, fontWeight: 600,
                      textAlign: 'left', border: `1.5px solid ${isActive ? color : 'var(--border)'}`,
                      background: isActive ? `${color}22` : 'transparent',
                      color: isActive ? color : 'var(--text-muted)',
                      cursor: isActive ? 'default' : 'pointer',
                      opacity: isActive ? 1 : 0.85,
                    }}
                    onClick={() => {
                      if (isActive) return
                      updateItemStatus(item.id, key)
                      addHistoryEntry(item.id, { action: `Estado cambiado a: ${label}`, userId: currentUser.id, time: now() })
                      setShowEdit(false)
                    }}
                  >
                    {label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </>
  )
}
