import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useItems } from './ItemsContext'

const TrucksContext = createContext(null)

// Map DB row → app truck shape (assigned_to → assignedTo)
const mapTruck = (row) => ({ ...row, assignedTo: row.assigned_to })

export function TrucksProvider({ children }) {
  const [rawTrucks, setRawTrucks] = useState([])
  const { items } = useItems()

  useEffect(() => {
    supabase.from('trucks').select('*').order('id')
      .then(({ data }) => { if (data) setRawTrucks(data.map(mapTruck)) })

    const channel = supabase
      .channel('trucks-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'trucks' }, (payload) => {
        setRawTrucks(prev => prev.some(t => t.id === payload.new.id) ? prev : [...prev, mapTruck(payload.new)])
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'trucks' }, (payload) => {
        setRawTrucks(prev => prev.map(t => t.id === payload.new.id ? mapTruck(payload.new) : t))
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'trucks' }, (payload) => {
        setRawTrucks(prev => prev.filter(t => t.id !== payload.old.id))
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  // Compute loaded count and progress from items
  const trucks = rawTrucks.map(truck => {
    const truckItems = items.filter(i => i.truck === truck.id)
    const loaded = truckItems.filter(i => i.status === 'loaded').length
    const progress = truck.capacity > 0 ? Math.round((loaded / truck.capacity) * 100) : 0
    return { ...truck, loaded, progress }
  })

  const addTruck = async (truck) => {
    const dbRow = { ...truck, assigned_to: truck.assignedTo }
    delete dbRow.assignedTo
    delete dbRow.loaded
    delete dbRow.progress
    const { error } = await supabase.from('trucks').insert(dbRow)
    if (error) throw error
    // El realtime INSERT actualiza el estado — no hacer update optimista para evitar duplicados
  }

  const updateTruck = async (id, updates) => {
    setRawTrucks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    const dbUpdates = { ...updates }
    if (dbUpdates.assignedTo !== undefined) {
      dbUpdates.assigned_to = dbUpdates.assignedTo
      delete dbUpdates.assignedTo
    }
    delete dbUpdates.loaded
    delete dbUpdates.progress
    await supabase.from('trucks').update(dbUpdates).eq('id', id)
  }

  const deleteTruck = async (id) => {
    setRawTrucks(prev => prev.filter(t => t.id !== id))
    await supabase.from('trucks').delete().eq('id', id)
  }

  const resetTrucks = async () => {
    const { data } = await supabase.from('trucks').select('*').order('id')
    if (data) setRawTrucks(data.map(mapTruck))
  }

  return (
    <TrucksContext.Provider value={{ trucks, addTruck, updateTruck, deleteTruck, resetTrucks }}>
      {children}
    </TrucksContext.Provider>
  )
}

export function useTrucks() {
  const ctx = useContext(TrucksContext)
  if (!ctx) throw new Error('useTrucks must be used within TrucksProvider')
  return ctx
}
