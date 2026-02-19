import { useState } from 'react'
import { Search, Plus, Filter } from 'lucide-react'
import TopBar from '../components/Layout/TopBar'
import BottomNav from '../components/Layout/BottomNav'
import ItemCard from '../components/ItemCard'
import { useAuth } from '../context/AuthContext'
import { useItems } from '../context/ItemsContext'
import { deptNames } from '../data/mockData'

const allDeptFilters = ['Todos', ...Object.values(deptNames)]
const statusFilters = ['Todos', 'Cargado', 'Descargado', 'Listo para cargar', 'Pendiente', 'Faltante']

const statusFilterMap = {
  'Cargado': 'loaded',
  'Descargado': 'descargado',
  'Listo para cargar': 'ready-to-load',
  'Pendiente': 'pending',
  'Faltante': 'missing',
}

const deptFilterMap = Object.fromEntries(
  Object.entries(deptNames).map(([k, v]) => [v, k])
)

const styles = {
  searchBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'var(--surface)',
    borderRadius: 'var(--radius)',
    padding: '10px 14px',
    marginBottom: 12,
    border: '1px solid var(--border)',
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    background: 'none',
    color: 'var(--text)',
  },
  filters: {
    display: 'flex',
    gap: 8,
    overflowX: 'auto',
    marginBottom: 14,
    paddingBottom: 4,
  },
  filterChip: {
    padding: '6px 14px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 500,
    whiteSpace: 'nowrap',
    border: '1px solid var(--border)',
    transition: 'all 0.15s',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
  },
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
  count: {
    fontSize: 12,
    color: 'var(--text-muted)',
    marginBottom: 12,
  },
}

export default function Inventory() {
  const { currentUser } = useAuth()
  const { items } = useItems()
  const role = currentUser?.role
  const [search, setSearch] = useState('')
  const [deptFilter, setDeptFilter] = useState('Todos')
  const [statusFilter, setStatusFilter] = useState('Todos')
  const [showFilters, setShowFilters] = useState(false)

  const isDeptLead = role === 'dept-lead'
  const showFab = role === 'admin' || role === 'dept-lead'
  const showDeptFilters = role !== 'dept-lead'

  const filtered = items.filter(item => {
    if (isDeptLead && item.dept !== currentUser.dept) return false
    if (search && !item.name.toLowerCase().includes(search.toLowerCase()) && !item.id.toLowerCase().includes(search.toLowerCase())) return false
    if (deptFilter !== 'Todos' && item.dept !== deptFilterMap[deptFilter]) return false
    if (statusFilter !== 'Todos' && item.status !== statusFilterMap[statusFilter]) return false
    return true
  })

  return (
    <>
      <TopBar
        title="Inventario"
        actions={
          <button onClick={() => setShowFilters(!showFilters)}>
            <Filter size={20} color={showFilters ? 'var(--accent-red)' : 'var(--text-muted)'} />
          </button>
        }
      />
      <div className="page">
        <div style={styles.searchBar} className="fade-in">
          <Search size={18} color="var(--text-muted)" />
          <input
            style={styles.searchInput}
            placeholder="Buscar equipo o código..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {showDeptFilters && (
          <div style={styles.filters} className="fade-in">
            {allDeptFilters.map(f => (
              <button
                key={f}
                style={{
                  ...styles.filterChip,
                  background: deptFilter === f ? 'var(--accent-red)' : 'transparent',
                  color: deptFilter === f ? '#fff' : 'var(--text-muted)',
                  borderColor: deptFilter === f ? 'var(--accent-red)' : 'var(--border)',
                }}
                onClick={() => setDeptFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        {showFilters && (
          <div style={styles.filters} className="fade-in">
            {statusFilters.map(f => (
              <button
                key={f}
                style={{
                  ...styles.filterChip,
                  background: statusFilter === f ? 'var(--accent-yellow)' : 'transparent',
                  color: statusFilter === f ? '#000' : 'var(--text-muted)',
                  borderColor: statusFilter === f ? 'var(--accent-yellow)' : 'var(--border)',
                }}
                onClick={() => setStatusFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>
        )}

        <div style={styles.count}>{filtered.length} equipos</div>

        <div style={styles.list}>
          {filtered.map(item => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>

        {showFab && (
          <button style={styles.fab}>
            <Plus size={24} color="#fff" />
          </button>
        )}
      </div>
      <BottomNav />
    </>
  )
}
