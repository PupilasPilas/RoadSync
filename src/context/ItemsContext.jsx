import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const ItemsContext = createContext(null)

// Map DB row → app item shape (truck_id → truck)
const mapItem = (row) => ({ ...row, truck: row.truck_id })

// Map DB history row → app entry shape
const mapEntry = (row) => ({
  action: row.action,
  userId: row.user_id,
  time: new Date(row.created_at).toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' }),
})

export function ItemsProvider({ children }) {
  const { currentUser } = useAuth()
  const [items, setItems] = useState([])
  const [itemHistory, setItemHistory] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!currentUser) {
      setItems([])
      setItemHistory({})
      setLoading(false)
      return
    }

    const fetchAll = async () => {
      const [{ data: itemsData }, { data: histData }] = await Promise.all([
        supabase.from('items').select('*').order('order'),
        supabase.from('item_history').select('*').order('created_at', { ascending: false }),
      ])
      if (itemsData) setItems(itemsData.map(mapItem))
      if (histData) {
        const grouped = {}
        for (const row of histData) {
          if (!grouped[row.item_id]) grouped[row.item_id] = []
          grouped[row.item_id].push(mapEntry(row))
        }
        setItemHistory(grouped)
      }
      setLoading(false)
    }
    fetchAll()

    const channel = supabase
      .channel('items-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'items' }, (payload) => {
        setItems(prev => prev.some(i => i.id === payload.new.id) ? prev : [...prev, mapItem(payload.new)])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'items' }, (payload) => {
        setItems(prev => prev.map(i => i.id === payload.new.id ? mapItem(payload.new) : i))
      })
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'item_history' }, (payload) => {
        const row = payload.new
        setItemHistory(prev => ({
          ...prev,
          [row.item_id]: [mapEntry(row), ...(prev[row.item_id] || [])],
        }))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [currentUser?.id])

  const updateItemStatus = async (itemId, newStatus, truckId = null) => {
    // Optimistic update
    setItems(prev => prev.map(i =>
      i.id === itemId
        ? { ...i, status: newStatus, ...(truckId ? { truck: truckId, truck_id: truckId } : {}) }
        : i
    ))
    const updates = { status: newStatus }
    if (truckId) updates.truck_id = truckId
    await supabase.from('items').update(updates).eq('id', itemId)
  }

  const addHistoryEntry = async (itemId, entry) => {
    // Optimistic update (realtime will also fire but deduplication is fine)
    const now = new Date()
    const timeStr = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`
    setItemHistory(prev => ({
      ...prev,
      [itemId]: [{ action: entry.action, userId: entry.userId, time: timeStr }, ...(prev[itemId] || [])],
    }))
    await supabase.from('item_history').insert({
      item_id: itemId,
      action: entry.action,
      user_id: entry.userId,
    })
  }

  const addItem = async ({ id, name, dept, type, icon }) => {
    const order = items.filter(i => i.dept === dept).length + 1
    const newItem = { id, name, dept, type, icon, order, status: 'pending', truck_id: null }
    const { error } = await supabase.from('items').insert(newItem)
    if (error) throw error
    // El realtime INSERT actualiza el estado — no hacer update optimista para evitar duplicados
  }

  const resetItems = async () => {
    const { data } = await supabase.from('items').select('*').order('order')
    if (data) setItems(data.map(mapItem))
    const { data: histData } = await supabase.from('item_history').select('*').order('created_at', { ascending: false })
    if (histData) {
      const grouped = {}
      for (const row of histData) {
        if (!grouped[row.item_id]) grouped[row.item_id] = []
        grouped[row.item_id].push(mapEntry(row))
      }
      setItemHistory(grouped)
    }
  }

  return (
    <ItemsContext.Provider value={{ items, loading, updateItemStatus, addItem, resetItems, itemHistory, addHistoryEntry }}>
      {children}
    </ItemsContext.Provider>
  )
}

export function useItems() {
  const ctx = useContext(ItemsContext)
  if (!ctx) throw new Error('useItems must be used within ItemsProvider')
  return ctx
}
