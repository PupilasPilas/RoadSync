import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)
const PROFILE_CACHE_KEY = 'roadsync_profile'

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userId, setUserId] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session) {
          setUserId(session.user.id)
          // Mostrar inmediatamente desde caché si existe
          const cached = localStorage.getItem(PROFILE_CACHE_KEY)
          if (cached) {
            const profile = JSON.parse(cached)
            if (profile.id === session.user.id) {
              setCurrentUser(profile)
              setLoading(false)
            }
          }
          // Actualizar desde Supabase en segundo plano
          fetchUserProfile(session.user.id)
        } else {
          setUserId(null)
          setCurrentUser(null)
          setLoading(false)
        }
      }
    )
    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (uid) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', uid)
      .single()
    if (data) {
      localStorage.setItem(PROFILE_CACHE_KEY, JSON.stringify(data))
      setCurrentUser(data)
    }
    setLoading(false)
  }

  const login = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
  }

  const logout = async () => {
    localStorage.removeItem(PROFILE_CACHE_KEY)
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ currentUser, userId, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
