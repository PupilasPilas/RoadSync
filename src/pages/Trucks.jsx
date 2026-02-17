import { Plus } from 'lucide-react'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import TruckCard from '../components/TruckCard'
import { useAuth } from '../context/AuthContext'
import { trucks } from '../data/mockData'

const styles = {
  fab: {
    position: 'fixed',
    bottom: 'calc(var(--nav-height) + 16px)',
    right: 16,
    width: 52,
    height: 52,
    borderRadius: '50%',
    background: 'var(--accent-red)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 20px rgba(227, 6, 19, 0.4)',
    zIndex: 50,
  },
}

export default function Trucks() {
  const { currentUser } = useAuth()
  const isAdmin = currentUser?.role === 'admin'

  return (
    <>
      <TopBar title="Camiones" />
      <div className="page">
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>
          {trucks.length} camiones asignados
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {trucks.map(truck => (
            <div key={truck.id} className="fade-in">
              <TruckCard truck={truck} />
            </div>
          ))}
        </div>
        {isAdmin && (
          <button style={styles.fab}>
            <Plus size={24} color="#fff" />
          </button>
        )}
      </div>
      <BottomNav />
    </>
  )
}
