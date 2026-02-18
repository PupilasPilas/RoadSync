import { createContext, useContext, useState } from 'react'
import { trucks as initialTrucks } from '../data/mockData'

const TrucksContext = createContext(null)

export function TrucksProvider({ children }) {
  const [trucks, setTrucks] = useState(initialTrucks)

  const addTruck = (truck) => setTrucks(prev => [...prev, truck])

  const updateTruck = (id, updates) =>
    setTrucks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))

  const deleteTruck = (id) =>
    setTrucks(prev => prev.filter(t => t.id !== id))

  const resetTrucks = () => setTrucks(initialTrucks)

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
