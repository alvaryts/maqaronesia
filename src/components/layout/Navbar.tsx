import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { href: '/blog', label: 'Blog' },
  { href: '/courses', label: 'Academy' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const location = useLocation()

  return (
    <header className="glass-nav sticky top-0 z-50 px-4 md:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2 group">
          <span className="font-heading font-extrabold text-xl tracking-tighter text-white uppercase">
            Ma<span className="text-primary">QA</span>ronesia
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname.startsWith(link.href)
                  ? 'text-primary'
                  : 'text-foreground/70 hover:text-primary'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="relative group">
              <button className="w-9 h-9 rounded-full bg-surface border-2 border-primary flex items-center justify-center text-white font-bold text-sm">
                {(profile?.username ?? user.email)?.[0]?.toUpperCase() ?? '?'}
              </button>
              <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 border-b border-border">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground">Sesión activa</p>
                  <p className="font-bold text-white text-sm mt-1">{profile?.username ?? user.email}</p>
                </div>
                {profile?.is_staff && (
                  <a
                    href={`${import.meta.env.VITE_SUPABASE_URL}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-2 px-4 py-3 text-sm text-foreground/70 hover:text-primary transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin Panel
                  </a>
                )}
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-4 py-3 text-sm text-error hover:bg-error/5 w-full text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Entrar
            </Link>
          )}

          {/* Mobile menu toggle */}
          <button
            className="md:hidden text-foreground/70 hover:text-white"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-border py-4 animate-fade-in">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="block px-4 py-3 text-sm font-semibold text-foreground/70 hover:text-primary transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}
