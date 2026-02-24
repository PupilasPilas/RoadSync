import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'

const UsersContext = createContext(null)

export function UsersProvider({ children }) {
  const { userId } = useAuth()
  const [users, setUsers] = useState([])

  useEffect(() => {
    if (!userId) {
      setUsers([])
      return
    }
    supabase.from('users').select('*')
      .then(({ data }) => { if (data) setUsers(data) })
  }, [userId])

  const addUser = async ({ email, password, name, role, dept, avatar }) => {
    // Usa función SQL con SECURITY DEFINER — crea auth user + perfil sin enviar emails
    const { data: newUserId, error } = await supabase.rpc('create_user', {
      user_email: email,
      user_password: password,
      user_name: name,
      user_role: role,
      user_dept: dept || '',
      user_avatar: avatar,
    })
    if (error) throw error

    // Refrescar lista de usuarios
    const { data: profile } = await supabase.from('users').select('*').eq('id', newUserId).single()
    if (profile) setUsers(prev => [...prev, profile])
  }

  const updateUser = async (id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
    await supabase.from('users').update(updates).eq('id', id)
  }

  const deleteUser = async (id) => {
    setUsers(prev => prev.filter(u => u.id !== id))
    await supabase.rpc('delete_user', { user_id: id })
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
