import { createContext, useContext, useState } from 'react'
import { useUsers } from './UsersContext'
import { users as initialUsers } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const { users } = useUsers()

  // initialUsers para el bootstrap de localStorage (estado inicial en el mount)
  // login usa `users` reactivo para encontrar también usuarios recién creados
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('roadsync_user')
    if (saved) {
      return initialUsers.find(u => u.id === saved) || null
    }
    return null
  })

  const login = (userId) => {
    const user = users.find(u => u.id === userId)
    if (user) {
      setCurrentUser(user)
      localStorage.setItem('roadsync_user', userId)
    }
  }

  const logout = () => {
    setCurrentUser(null)
    localStorage.removeItem('roadsync_user')
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
