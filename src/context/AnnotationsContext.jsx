import { createContext, useContext, useState } from 'react'

const AnnotationsContext = createContext(null)

const initialAnnotations = {
  item: {
    'AUDIO-08': [
      { id: 1, text: 'Falta adaptador XLR-TRS, verificar antes de subir al camión.', authorName: 'José Romero', authorRole: 'dept-lead', timestamp: '10:15 · 23 Feb' },
    ],
    'VIDEO-03': [
      { id: 2, text: 'Case con daño en la tapa, abrir con cuidado.', authorName: 'Esteban Jiménez', authorRole: 'dept-lead', timestamp: '09:40 · 23 Feb' },
    ],
  },
  truck: {
    'truck-01': [
      { id: 3, text: 'Sin rampa hidráulica, usar plancha manual para casos pesados.', authorName: 'Serry', authorRole: 'load-lead', timestamp: '08:00 · 23 Feb' },
    ],
  },
  dept: {
    'audio': [
      { id: 4, text: 'Reunión de carga a las 15:00 hs. Confirmar disponibilidad con producción.', authorName: 'Pablo Grajales', authorRole: 'admin', timestamp: '11:30 · 23 Feb' },
    ],
  },
}

export function AnnotationsProvider({ children }) {
  const [annotations, setAnnotations] = useState(initialAnnotations)

  const addAnnotation = (type, entityId, text, user) => {
    const now = new Date()
    const time = now.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    const date = now.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
    const entry = {
      id: Date.now(),
      text,
      authorName: user.name,
      authorRole: user.role,
      timestamp: `${time} · ${date}`,
    }
    setAnnotations(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        [entityId]: [entry, ...(prev[type]?.[entityId] || [])],
      },
    }))
  }

  const getAnnotations = (type, entityId) =>
    annotations[type]?.[entityId] || []

  const resetAnnotations = () => setAnnotations(initialAnnotations)

  return (
    <AnnotationsContext.Provider value={{ addAnnotation, getAnnotations, resetAnnotations }}>
      {children}
    </AnnotationsContext.Provider>
  )
}

export function useAnnotations() {
  const ctx = useContext(AnnotationsContext)
  if (!ctx) throw new Error('useAnnotations must be used within AnnotationsProvider')
  return ctx
}
