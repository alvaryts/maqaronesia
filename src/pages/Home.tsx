import { Link } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import { formatDate } from '../lib/utils'
import { ArrowRight } from 'lucide-react'

export default function Home() {
  const { posts, loading } = usePosts(7)
  const latest = posts[0]
  const secondary = posts.slice(1, 3)
  const rest = posts.slice(3)

  return (
    <div>
      {/* Hero — dark, brand-forward */}
      <section className="bg-dark text-white pt-28 pb-16 md:pt-36 md:pb-24">
        <div className="max-w-5xl mx-auto px-4 lg:px-0">
          <p className="font-brand text-primary text-sm tracking-wider mb-4">// maqaronesia.com</p>
          <h1 className="font-heading font-bold text-4xl md:text-6xl leading-[1.1] tracking-tight text-white mb-6">
            Ingeniería, IA<br className="hidden md:block" /> y Calidad<span className="text-primary">.</span>
          </h1>
          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl leading-relaxed mb-8">
            Artículos sobre automatización, testing, inteligencia artificial y desarrollo profesional en ingeniería de software.
          </p>
          <div className="flex gap-4">
            <Link to="/blog" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer">
              Leer el blog <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/courses" className="inline-flex items-center gap-2 border border-neutral-600 hover:border-neutral-400 text-neutral-300 hover:text-white font-heading font-semibold text-sm px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer">
              Cursos
            </Link>
          </div>
        </div>
      </section>

      {/* Articles section */}
      <section className="max-w-5xl mx-auto px-4 lg:px-0 py-14">
        <div className="flex items-center justify-between mb-8">
          <h2 className="font-heading font-bold text-2xl text-heading">Últimos artículos</h2>
          <Link to="/blog" className="text-sm font-heading font-semibold text-primary hover:text-primary-hover transition-colors cursor-pointer">
            Ver todos &rarr;
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="rounded-xl bg-surface animate-pulse h-72" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-heading font-bold text-heading mb-2">Próximamente</p>
            <p className="text-muted">Estamos preparando contenido. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <>
            {/* Hero article */}
            {latest && (
              <article className="group mb-10">
                <Link to={`/blog/${latest.slug}`} className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center cursor-pointer">
                  <div className="overflow-hidden rounded-xl">
                    <img
                      src={latest.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
                      alt={latest.title}
                      className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="inline-block text-[11px] font-heading font-semibold text-primary uppercase tracking-wider mb-3">
                      Último artículo
                    </span>
                    <h3 className="font-heading font-bold text-xl md:text-2xl text-heading group-hover:text-primary transition-colors duration-200 leading-tight mb-3">
                      {latest.title}
                    </h3>
                    {latest.excerpt && (
                      <p className="text-muted text-sm leading-relaxed line-clamp-3 mb-3">{latest.excerpt}</p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      {latest.profiles?.username ?? 'maqaronesia.com'}
                      {latest.published_at && ` · ${formatDate(latest.published_at)}`}
                    </p>
                  </div>
                </Link>
              </article>
            )}

            {/* Secondary + rest in grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...secondary, ...rest].map(post => (
                <article key={post.id} className="group">
                  <Link to={`/blog/${post.slug}`} className="block cursor-pointer">
                    <div className="overflow-hidden rounded-xl mb-3">
                      <img
                        src={post.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
                        alt={post.title}
                        className="w-full aspect-[16/10] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                    <h3 className="font-heading font-semibold text-sm text-heading group-hover:text-primary transition-colors duration-200 leading-snug line-clamp-2 mb-1">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {post.profiles?.username ?? 'maqaronesia.com'}
                    {post.published_at && ` · ${formatDate(post.published_at)}`}
                  </p>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {/* CTA section — dark */}
      <section className="bg-dark text-white py-16">
        <div className="max-w-5xl mx-auto px-4 lg:px-0 text-center">
          <h2 className="font-heading font-bold text-2xl md:text-3xl text-white mb-4">
            Próximamente: Academia
          </h2>
          <p className="text-neutral-400 max-w-xl mx-auto mb-8">
            Cursos prácticos sobre automatización, IA aplicada al testing, y cómo construir calidad desde el diseño.
          </p>
          <Link to="/courses" className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover text-white font-heading font-semibold text-sm px-6 py-3 rounded-lg transition-colors duration-200 cursor-pointer">
            Explorar cursos <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}
