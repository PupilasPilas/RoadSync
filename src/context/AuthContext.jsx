import { createContext, useContext, useState, useEffect } from 'react'
import { users } from '../data/mockData'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('roadsync_user')
    if (saved) {
      const user = users.find(u => u.id === saved)
      return user || null
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
