import { createContext, useContext, useState } from 'react'
import { items as initialItems, movementHistory as initialHistory } from '../data/mockData'

const ItemsContext = createContext(null)

export function ItemsProvider({ children }) {
  const [items, setItems] = useState(initialItems)
  const [itemHistory, setItemHistory] = useState(initialHistory)

  const updateItemStatus = (itemId, newStatus) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, status: newStatus } : item
    ))
  }

  const addHistoryEntry = (itemId, entry) => {
    setItemHistory(prev => ({
      ...prev,
      [itemId]: [entry, ...(prev[itemId] || [])],
    }))
  }

  const resetItems = () => {
    setItems(initialItems)
    setItemHistory(initialHistory)
  }

  return (
    <ItemsContext.Provider value={{ items, updateItemStatus, resetItems, itemHistory, addHistoryEntry }}>
      {children}
    </ItemsContext.Provider>
  )
}

export function useItems() {
  const ctx = useContext(ItemsContext)
  if (!ctx) throw new Error('useItems must be used within ItemsProvider')
  return ctx
}
