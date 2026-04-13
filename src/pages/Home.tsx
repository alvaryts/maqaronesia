import { Link } from 'react-router-dom'
import { ArrowRight, Bot, Cog, Shield, Code2 } from 'lucide-react'
import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/blog/PostCard'

const pillars = [
  { icon: Bot, label: 'IA', desc: 'Inteligencia Artificial aplicada a testing y desarrollo' },
  { icon: Cog, label: 'Automatización', desc: 'Pipelines, CI/CD, frameworks de test automation' },
  { icon: Code2, label: 'Ingeniería', desc: 'Arquitectura, clean code, buenas prácticas' },
  { icon: Shield, label: 'Calidad', desc: 'QA strategy, testing, observabilidad' },
]

export default function Home() {
  const { posts, loading } = usePosts(6)

  return (
    <div className="space-y-24">
      {/* Hero */}
      <section className="text-center pt-16 pb-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-center gap-3 mb-6">
          {['IA', 'Automatización', 'Ingeniería', 'Calidad'].map((t, i) => (
            <span key={t}>
              {i > 0 && <span className="text-muted-foreground mx-1">·</span>}
              <span className="text-xs font-bold uppercase tracking-widest text-primary">{t}</span>
            </span>
          ))}
        </div>
        <h1 className="text-5xl md:text-7xl font-heading font-extrabold text-white mb-6 tracking-tight leading-tight">
          Ma<span className="text-primary">QA</span>ronesia
        </h1>
        <p className="text-lg md:text-xl text-muted max-w-2xl mx-auto leading-relaxed">
          Un espacio de exploración técnica donde convergen la inteligencia artificial,
          la automatización, la ingeniería de software y la cultura de calidad.
        </p>
        <div className="flex items-center justify-center gap-4 mt-10">
          <Link
            to="/blog"
            className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            Explorar Blog <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/courses"
            className="border border-border hover:border-primary px-8 py-3 rounded-xl font-bold text-foreground hover:text-primary transition-all"
          >
            Academy
          </Link>
        </div>
      </section>

      {/* Pillars */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map(({ icon: Icon, label, desc }) => (
          <div
            key={label}
            className="bg-surface border border-border rounded-2xl p-6 hover:border-primary/30 transition-all group"
          >
            <Icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-heading font-bold text-white mb-2">{label}</h3>
            <p className="text-sm text-muted leading-relaxed">{desc}</p>
          </div>
        ))}
      </section>

      {/* Latest Posts */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-white">
            Últimos artículos
          </h2>
          <Link
            to="/blog"
            className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
          >
            Ver todos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-surface border border-border rounded-2xl h-80 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
