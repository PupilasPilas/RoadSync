import { createContext, useContext, useState } from 'react'
import { items as initialItems } from '../data/mockData'

const ItemsContext = createContext(null)

export function ItemsProvider({ children }) {
  const [items, setItems] = useState(initialItems)

  const updateItemStatus = (itemId, newStatus) => {
    setItems(prev => prev.map(item =>
      item.id === itemId ? { ...item, status: newStatus } : item
    ))
  }

  return (
    <ItemsContext.Provider value={{ items, updateItemStatus }}>
      {children}
    </ItemsContext.Provider>
  )
}

export function useItems() {
  const ctx = useContext(ItemsContext)
  if (!ctx) throw new Error('useItems must be used within ItemsProvider')
  return ctx
}
