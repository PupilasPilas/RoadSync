import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const UsersContext = createContext(null)

export function UsersProvider({ children }) {
  const [users, setUsers] = useState([])

  useEffect(() => {
    supabase.from('users').select('*')
      .then(({ data }) => { if (data) setUsers(data) })
  }, [])

  const updateUser = async (id, updates) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u))
    await supabase.from('users').update(updates).eq('id', id)
  }

  // Creating and deleting auth users requires a backend/Edge Function with service role key.
  // These operations are disabled client-side; manage users from the Supabase Dashboard.
  const addUser = async () => {
    console.warn('addUser: user creation requires Supabase Auth admin API. Create users from the Supabase Dashboard.')
  }

  const deleteUser = async () => {
    console.warn('deleteUser: user deletion requires Supabase Auth admin API. Delete users from the Supabase Dashboard.')
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
