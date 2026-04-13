import { Link } from 'react-router-dom'

const topics = ['IA', 'Automatización', 'QA', 'Ingeniería']

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-20 pt-16 pb-8 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Brand */}
        <div className="md:col-span-1">
          <span className="font-heading font-extrabold text-2xl tracking-tighter text-white uppercase">
            Ma<span className="text-primary">QA</span>ronesia
          </span>
          <p className="text-muted-foreground text-sm leading-relaxed mt-4">
            Divulgación sobre IA, Automatización, Ingeniería de Software y Calidad.
          </p>
        </div>

        {/* Nav */}
        <nav>
          <h6 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-6">Navegación</h6>
          <ul className="space-y-3 text-muted-foreground text-sm">
            <li><Link to="/blog" className="hover:text-primary transition-colors">Blog</Link></li>
            <li><Link to="/courses" className="hover:text-primary transition-colors">Academy</Link></li>
          </ul>
        </nav>

        {/* Topics */}
        <nav>
          <h6 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-6">Temáticas</h6>
          <ul className="space-y-3 text-muted-foreground text-sm">
            {topics.map(t => (
              <li key={t}><span className="hover:text-primary transition-colors cursor-default">{t}</span></li>
            ))}
          </ul>
        </nav>

        {/* Newsletter */}
        <div>
          <h6 className="font-heading font-bold text-white text-sm uppercase tracking-widest mb-6">Newsletter</h6>
          <p className="text-muted-foreground text-xs mb-4 leading-relaxed">
            Suscríbete para recibir contenido sobre ingeniería y calidad cada semana.
          </p>
          <div className="flex gap-2">
            <input
              type="email"
              placeholder="Email"
              className="bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground flex-1 focus:border-primary focus:outline-none"
            />
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
              OK
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-[0.65rem] font-bold uppercase tracking-widest text-muted-foreground">
        <p>© {new Date().getFullYear()} MaQAronesia. Engineering Journal.</p>
        <div className="flex gap-6">
          <a href="#" className="hover:text-white transition-colors">Privacidad</a>
          <a href="#" className="hover:text-white transition-colors">Términos</a>
        </div>
      </div>
    </footer>
  )
}
