import { createContext, useContext, useState } from 'react'

const PhaseContext = createContext(null)

export function PhaseProvider({ children }) {
  const [phase, setPhaseState] = useState(() => {
    return localStorage.getItem('roadsync_phase') || 'Carga'
  })

  const setPhase = (p) => {
    setPhaseState(p)
    localStorage.setItem('roadsync_phase', p)
  }

  const resetPhase = () => {
    setPhaseState('Carga')
    localStorage.setItem('roadsync_phase', 'Carga')
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
