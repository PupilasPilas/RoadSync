import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const PhaseContext = createContext(null)

export function PhaseProvider({ children }) {
  const [phase, setPhaseState] = useState('Carga')

  useEffect(() => {
    // Initial fetch
    supabase.from('phase').select('value').eq('id', 1).single()
      .then(({ data }) => { if (data) setPhaseState(data.value) })

    // Realtime subscription
    const channel = supabase
      .channel('phase-changes')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'phase' }, (payload) => {
        setPhaseState(payload.new.value)
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const setPhase = async (p) => {
    setPhaseState(p) // optimistic
    await supabase.from('phase').update({ value: p }).eq('id', 1)
  }

  const resetPhase = async () => {
    setPhaseState('Carga')
    await supabase.from('phase').update({ value: 'Carga' }).eq('id', 1)
  }

  return (
    <PhaseContext.Provider value={{ phase, setPhase, resetPhase }}>
      {children}
    </PhaseContext.Provider>
  )
}

export function usePhase() {
  const ctx = useContext(PhaseContext)
  if (!ctx) throw new Error('usePhase must be used within PhaseProvider')
  return ctx
}
