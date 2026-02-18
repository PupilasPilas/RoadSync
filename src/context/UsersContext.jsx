import { createContext, useContext, useState } from 'react'
import { users as initialUsers } from '../data/mockData'

const UsersContext = createContext(null)

export function UsersProvider({ children }) {
  const [users, setUsers] = useState(initialUsers)

  const addUser = (user) => setUsers(prev => [...prev, user])

  const updateUser = (id, updates) =>
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))

  const deleteUser = (id) =>
    setUsers(prev => prev.filter(u => u.id !== id))

  return (
    <UsersContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UsersContext.Provider>
  )
}

export function useUsers() {
  const ctx = useContext(UsersContext)
  if (!ctx) throw new Error('useUsers must be used within UsersProvider')
  return ctx
}
