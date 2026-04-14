import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { Mail, ArrowRight, CheckCircle2, Lock } from 'lucide-react'

export default function Login() {
  const { user, loading, signInWithMagicLink, signInWithPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [mode, setMode] = useState<'magic' | 'password'>('password')

  if (loading) return null
  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    if (mode === 'password') {
      const { error } = await signInWithPassword(email, password)
      setSubmitting(false)
      if (error) setError(error.message)
    } else {
      const { error } = await signInWithMagicLink(email)
      setSubmitting(false)
      if (error) {
        setError(error.message)
      } else {
        setSent(true)
      }
    }
  }

  return (
    <div>
      {/* Masthead */}
      <header className="masthead" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="masthead-content max-w-4xl mx-auto px-4 lg:px-0 text-center">
          <h1>Iniciar Sesión</h1>
          <span className="subheading">Accede a tu cuenta de maqaronesia.com</span>
        </div>
      </header>

      <div className="max-w-md mx-auto px-4 py-16">
        {sent ? (
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
            <p className="text-heading font-heading font-bold text-xl">¡Revisa tu email!</p>
            <p className="text-muted">
              Hemos enviado un enlace mágico a <strong className="text-heading">{email}</strong>.
              Haz click en él para iniciar sesión.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="form-clean !pl-10"
              />
            </div>
            {mode === 'password' && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  className="form-clean !pl-10"
                />
              </div>
            )}
            {error && <p className="text-error text-sm">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="btn-clean w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : mode === 'password' ? 'Iniciar Sesión' : 'Enviar enlace mágico'}
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-muted-foreground text-sm text-center">
              <button
                type="button"
                onClick={() => setMode(mode === 'password' ? 'magic' : 'password')}
                className="text-primary hover:underline"
              >
                {mode === 'password' ? 'Usar enlace mágico' : 'Usar contraseña'}
              </button>
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
