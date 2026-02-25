import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AnnotationsContext = createContext(null)

// Map DB row → app annotation shape
const mapAnnotation = (row) => ({
  id: row.id,
  text: row.text,
  authorId: row.author_id,
  authorName: row.author_name,
  authorRole: row.author_role,
  timestamp: (() => {
    const d = new Date(row.created_at)
    const time = d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })
    const date = d.toLocaleDateString('es-AR', { day: '2-digit', month: 'short' })
    return `${time} · ${date}`
  })(),
})

export function AnnotationsProvider({ children }) {
  // annotations[type][entityId] = [entries]
  const [annotations, setAnnotations] = useState({ item: {}, truck: {}, dept: {} })

  useEffect(() => {
    // Initial load of all annotations
    supabase.from('annotations').select('*').order('created_at', { ascending: false })
      .then(({ data }) => {
        if (!data) return
        const grouped = { item: {}, truck: {}, dept: {} }
        for (const row of data) {
          if (!grouped[row.type]) grouped[row.type] = {}
          if (!grouped[row.type][row.entity_id]) grouped[row.type][row.entity_id] = []
          grouped[row.type][row.entity_id].push(mapAnnotation(row))
        }
        setAnnotations(grouped)
      })

    const channel = supabase
      .channel('annotations-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'annotations' }, (payload) => {
        const row = payload.new
        setAnnotations(prev => {
          const existing = prev[row.type]?.[row.entity_id] || []
          if (existing.some(a => a.id === row.id)) return prev
          return {
            ...prev,
            [row.type]: {
              ...prev[row.type],
              [row.entity_id]: [mapAnnotation(row), ...existing],
            },
          }
        })
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'annotations' }, (payload) => {
        const { id } = payload.old
        setAnnotations(prev => {
          const next = { item: {}, truck: {}, dept: {} }
          for (const type of Object.keys(prev)) {
            next[type] = {}
            for (const entityId of Object.keys(prev[type])) {
              next[type][entityId] = prev[type][entityId].filter(a => a.id !== id)
            }
          }
          return next
        })
      })
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const addAnnotation = async (type, entityId, text, user) => {
    const { data } = await supabase.from('annotations').insert({
      type,
      entity_id: entityId,
      text,
      author_id: user.id,
      author_name: user.name,
      author_role: user.role,
    }).select().single()
    // Optimistic update so annotation appears immediately
    if (data) {
      setAnnotations(prev => {
        const existing = prev[type]?.[entityId] || []
        if (existing.some(a => a.id === data.id)) return prev
        return {
          ...prev,
          [type]: {
            ...prev[type],
            [entityId]: [mapAnnotation(data), ...existing],
          },
        }
      })
    }
  }

  const deleteAnnotation = async (id) => {
    await supabase.from('annotations').delete().eq('id', id)
    // Optimistic update
    setAnnotations(prev => {
      const next = { item: {}, truck: {}, dept: {} }
      for (const type of Object.keys(prev)) {
        next[type] = {}
        for (const entityId of Object.keys(prev[type])) {
          next[type][entityId] = prev[type][entityId].filter(a => a.id !== id)
        }
      }
      return next
    })
  }

  const getAnnotations = (type, entityId) =>
    annotations[type]?.[entityId] || []

  const resetAnnotations = () => setAnnotations({ item: {}, truck: {}, dept: {} })

  return (
    <AnnotationsContext.Provider value={{ addAnnotation, deleteAnnotation, getAnnotations, resetAnnotations }}>
      {children}
    </AnnotationsContext.Provider>
  )
}

export function useAnnotations() {
  const ctx = useContext(AnnotationsContext)
  if (!ctx) throw new Error('useAnnotations must be used within AnnotationsProvider')
  return ctx
}
