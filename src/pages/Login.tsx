import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'
import { Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function Login() {
  const { user, loading, signInWithMagicLink } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (loading) return null
  if (user) return <Navigate to="/" replace />

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await signInWithMagicLink(email)
    setSubmitting(false)
    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
  }

  return (
    <div>
      {/* Masthead */}
      <header className="masthead" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="masthead-content max-w-4xl mx-auto px-4 lg:px-0 text-center">
          <h1>Iniciar Sesión</h1>
          <span className="subheading">Accede a tu cuenta de MaQAronesia</span>
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
              <Mail className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="form-clean pl-8"
              />
            </div>
            {error && <p className="text-error text-sm">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="btn-clean w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : 'Enviar enlace mágico'}
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-muted-foreground text-sm text-center">
              Recibirás un enlace por email para acceder sin contraseña.
            </p>
          </form>
        )}
      </div>
    </div>
  )
}
