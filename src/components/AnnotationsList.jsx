import { useState } from 'react'
import { MessageSquare, Send, Trash2 } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useAnnotations } from '../context/AnnotationsContext'

const roleLabels = {
  admin: 'Admin',
  'dept-lead': 'Dept Lead',
  'load-lead': 'Load Lead',
}

const roleColors = {
  admin: 'var(--accent-red)',
  'dept-lead': 'var(--accent-yellow)',
  'load-lead': '#4A9EFF',
}

const styles = {
  sectionTitle: {
    fontSize: 13,
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    color: 'var(--text-muted)',
    marginBottom: 12,
  },
  noteCard: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 14px',
    marginBottom: 8,
  },
  noteHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
    flexWrap: 'wrap',
  },
  authorName: {
    fontSize: 13,
    fontWeight: 600,
  },
  roleBadge: {
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  timestamp: {
    fontSize: 11,
    color: 'var(--text-muted)',
    marginLeft: 'auto',
  },
  noteText: {
    fontSize: 14,
    lineHeight: 1.5,
  },
  inputArea: {
    display: 'flex',
    gap: 8,
    marginTop: 12,
    alignItems: 'flex-end',
  },
  textarea: {
    flex: 1,
    background: 'var(--bg)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius-sm)',
    padding: '10px 12px',
    fontSize: 14,
    color: 'var(--text)',
    resize: 'none',
    fontFamily: 'inherit',
    lineHeight: 1.4,
    outline: 'none',
  },
  sendBtn: {
    width: 42,
    height: 42,
    borderRadius: 'var(--radius-sm)',
    background: 'var(--accent-red)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    transition: 'opacity 0.15s',
  },
  empty: {
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: 16,
    textAlign: 'center',
    color: 'var(--text-muted)',
    fontSize: 13,
    marginBottom: 8,
  },
}

export default function AnnotationsList({ type, entityId }) {
  const { currentUser } = useAuth()
  const { addAnnotation, deleteAnnotation, getAnnotations } = useAnnotations()
  const [text, setText] = useState('')

  const notes = getAnnotations(type, entityId)

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    addAnnotation(type, entityId, trimmed, currentUser)
    setText('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={{ marginBottom: 20 }} className="fade-in">
      <div style={styles.sectionTitle}>
        <MessageSquare size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
        Anotaciones{notes.length > 0 ? ` (${notes.length})` : ''}
      </div>

      {notes.length === 0 ? (
        <div style={styles.empty}>Sin anotaciones aún</div>
      ) : (
        notes.map(note => (
          <div key={note.id} style={styles.noteCard}>
            <div style={styles.noteHeader}>
              <span style={styles.authorName}>{note.authorName}</span>
              <span style={{
                ...styles.roleBadge,
                background: `${roleColors[note.authorRole]}22`,
                color: roleColors[note.authorRole],
              }}>
                {roleLabels[note.authorRole]}
              </span>
              <span style={styles.timestamp}>{note.timestamp}</span>
              {(currentUser?.role === 'admin' || note.authorId === currentUser?.id) && (
                <button
                  onClick={() => deleteAnnotation(note.id)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px 4px', marginLeft: 4, color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
            <div style={styles.noteText}>{note.text}</div>
          </div>
        ))
      )}

      <div style={styles.inputArea}>
        <textarea
          style={styles.textarea}
          placeholder="Agregar anotación... (Enter para enviar)"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
        />
        <button
          style={{ ...styles.sendBtn, opacity: text.trim() ? 1 : 0.35 }}
          onClick={handleSend}
          disabled={!text.trim()}
        >
          <Send size={16} color="#fff" />
        </button>
      </div>
    </div>
  )
}
