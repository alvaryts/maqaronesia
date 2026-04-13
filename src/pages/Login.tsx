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
    <div className="flex items-center justify-center min-h-[60vh] animate-fade-in">
      <div className="bg-surface border border-border rounded-3xl p-10 max-w-md w-full text-center">
        <h1 className="text-3xl font-heading font-extrabold text-white mb-2">
          Bienvenido a Ma<span className="text-primary">QA</span>ronesia
        </h1>
        <p className="text-muted text-sm mb-8">
          Inicia sesión para acceder a cursos, guardar progreso y más.
        </p>

        {sent ? (
          <div className="space-y-4">
            <CheckCircle2 className="w-12 h-12 text-success mx-auto" />
            <p className="text-white font-bold">¡Revisa tu email!</p>
            <p className="text-muted text-sm">
              Hemos enviado un enlace mágico a <strong className="text-white">{email}</strong>.
              Haz click en él para iniciar sesión.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-background border border-border rounded-xl py-3 pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>
            {error && <p className="text-error text-sm">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Enviando...' : 'Enviar enlace mágico'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        <p className="text-muted-foreground text-xs mt-6">
          Recibirás un enlace por email para acceder sin contraseña.
        </p>
      </div>
    </div>
  )
}
