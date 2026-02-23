import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogIn, AlertCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    background: 'var(--bg)',
  },
  logo: {
    fontSize: 42,
    fontWeight: 700,
    letterSpacing: '6px',
    textTransform: 'uppercase',
    marginBottom: 8,
    background: 'linear-gradient(135deg, #fff 0%, #888 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  redLine: {
    width: 60,
    height: 3,
    background: 'var(--accent-red)',
    borderRadius: 2,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 13,
    color: 'var(--text-muted)',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    marginBottom: 52,
  },
  form: {
    width: '100%',
    maxWidth: 340,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
  },
  label: {
    fontSize: 11,
    color: 'var(--text-muted)',
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    marginBottom: 6,
    display: 'block',
  },
  input: {
    width: '100%',
    background: 'var(--surface)',
    border: '1px solid var(--border)',
    borderRadius: 'var(--radius)',
    padding: '14px 16px',
    fontSize: 15,
    color: 'var(--text)',
    outline: 'none',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s',
    fontFamily: 'inherit',
  },
  inputFocus: {
    borderColor: 'var(--accent-red)',
  },
  btn: {
    width: '100%',
    padding: '15px 0',
    borderRadius: 'var(--radius)',
    background: 'var(--accent-red)',
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    cursor: 'pointer',
    border: 'none',
    marginTop: 6,
    transition: 'opacity 0.2s',
    boxShadow: '0 4px 20px rgba(227, 6, 19, 0.35)',
    fontFamily: 'inherit',
  },
  errorBox: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    background: 'rgba(227,6,19,0.08)',
    border: '1px solid rgba(227,6,19,0.25)',
    borderRadius: 'var(--radius-sm)',
    padding: '12px 14px',
    fontSize: 13,
    color: 'var(--status-error)',
  },
}

export default function Login() {
  const navigate = useNavigate()
  const { login, currentUser, loading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [emailFocused, setEmailFocused] = useState(false)
  const [passFocused, setPassFocused] = useState(false)

  useEffect(() => {
    if (currentUser) navigate('/dashboard', { replace: true })
  }, [currentUser, navigate])

  if (loading) {
    return (
      <div style={{ ...styles.container, gap: 16 }}>
        <div style={styles.logo}>RoadSync</div>
        <div style={styles.redLine} />
        <div style={{ fontSize: 13, color: 'var(--text-muted)', letterSpacing: '2px' }}>CARGANDO...</div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email.trim() || !password) return
    setError('')
    setSubmitting(true)
    try {
      await login(email.trim(), password)
      navigate('/dashboard', { replace: true })
    } catch {
      setError('Email o contraseña incorrectos')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.logo}>RoadSync</div>
      <div style={styles.redLine} />
      <div style={styles.subtitle}>Tour Logistics</div>

      <form style={styles.form} onSubmit={handleSubmit}>
        <div>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="usuario@email.com"
            autoComplete="email"
            required
            style={{
              ...styles.input,
              ...(emailFocused ? styles.inputFocus : {}),
            }}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
          />
        </div>

        <div>
          <label style={styles.label}>Contraseña</label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            style={{
              ...styles.input,
              ...(passFocused ? styles.inputFocus : {}),
            }}
            onFocus={() => setPassFocused(true)}
            onBlur={() => setPassFocused(false)}
          />
        </div>

        {error && (
          <div style={styles.errorBox}>
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <button
          type="submit"
          style={{ ...styles.btn, opacity: submitting ? 0.7 : 1 }}
          disabled={submitting}
        >
          <LogIn size={18} />
          {submitting ? 'INGRESANDO...' : 'INGRESAR'}
        </button>
      </form>
    </div>
  )
}
