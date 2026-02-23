import { createContext, useContext, useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

const UsersContext = createContext(null)

// Cliente secundario solo para crear cuentas de auth
// sin afectar la sesión activa del admin
const authClient = createClient(
  'https://kobojmrvssqgnidmgddl.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtvYm9qbXJ2c3NxZ25pZG1nZGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE4Njc0MTksImV4cCI6MjA4NzQ0MzQxOX0.pb6uAQeRS_iWmRkyqGb-zDJ18_S1N_H26Q0RhcYNRSo',
  { auth: { persistSession: false, autoRefreshToken: false } }
)

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    supabase.from('users').select('*')
      .then(({ data }) => { if (data) setUsers(data) })
  }, [])

  const addUser = async ({ email, password, name, role, dept, avatar }) => {
    // 1. Crear cuenta de auth en cliente secundario (no afecta sesión del admin)
    const { data, error } = await authClient.auth.signUp({ email, password })
    if (error) throw error
    const newUserId = data.user.id

    // 2. Insertar perfil con el cliente principal (sesión del admin)
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .insert({ id: newUserId, name, role, dept: role === 'dept-lead' ? dept : null, avatar })
      .select()
      .single()
    if (profileError) throw profileError

    setUsers(prev => [...prev, profile])
  }

  const updateUser = async (id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
    await supabase.from('users').update(updates).eq('id', id)
  }

  const deleteUser = async (id) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    await supabase.from('users').delete().eq('id', id)
  }

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
