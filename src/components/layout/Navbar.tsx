import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, LogOut, LayoutDashboard } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/blog', label: 'Blog' },
  { href: '/courses', label: 'Academy' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`clean-nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="max-w-5xl mx-auto flex items-center justify-between h-14 px-4 lg:px-0">
        {/* Brand */}
        <Link to="/" className="!text-white text-lg tracking-tight" style={{ fontFamily: 'var(--font-brand)', fontWeight: 700 }}>
          maqaronesia.com
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              className={`nav-link ${
                location.pathname === link.href || (link.href !== '/' && location.pathname.startsWith(link.href))
                  ? 'active !text-white'
                  : ''
              }`}
            >
              {link.label}
            </Link>
          ))}

          {user ? (
            <div className="relative group">
              <button className="nav-link flex items-center gap-1">
                {profile?.username ?? user.email?.split('@')[0]}
              </button>
              <div className="absolute right-0 top-full mt-1 w-48 bg-white border border-border rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 overflow-hidden">
                <div className="p-3 border-b border-border">
                  <p className="text-xs text-muted-foreground">Sesión activa</p>
                  <p className="font-bold text-heading text-sm mt-0.5">{profile?.username ?? user.email}</p>
                </div>
                {profile?.is_staff && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-3 py-2 text-sm text-muted hover:text-primary transition-colors"
                  >
                    <LayoutDashboard className="w-4 h-4" /> Admin
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-error hover:bg-error/5 w-full text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Cerrar Sesión
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-link">
              Entrar
            </Link>
          )}
        </nav>

        {/* Mobile menu toggle */}
        <button
          className="md:hidden text-white/70 hover:text-white transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-white/20 py-3 px-4 bg-[#212529]/95 backdrop-blur-sm animate-fade-in">
          {navLinks.map(link => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMenuOpen(false)}
              className="block py-2 nav-link"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { signOut(); setMenuOpen(false) }}
              className="block py-2 nav-link text-error"
            >
              Cerrar Sesión
            </button>
          ) : (
            <Link to="/login" onClick={() => setMenuOpen(false)} className="block py-2 nav-link">
              Entrar
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}
