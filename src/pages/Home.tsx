import { Link } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import { formatDate } from '../lib/utils'

export default function Home() {
  const { posts, loading } = usePosts(7)
  const latest = posts[0]
  const secondary = posts.slice(1, 3)
  const rest = posts.slice(3)

  return (
    <div>
      {/* Masthead */}
      <header className="masthead" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="masthead-content max-w-4xl mx-auto px-4 lg:px-0 text-center">
          <h1 className="!text-white">maqaronesia.com</h1>
          <span className="subheading">IA · Automatización · Ingeniería · Calidad</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="md:col-span-2 h-80 bg-surface rounded-lg animate-pulse" />
            <div className="space-y-5">
              <div className="h-[152px] bg-surface rounded-lg animate-pulse" />
              <div className="h-[152px] bg-surface rounded-lg animate-pulse" />
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-heading font-bold text-heading mb-2">Próximamente</p>
            <p className="text-muted">Estamos preparando contenido increíble. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <>
            {/* Hero row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              {/* Main post */}
              {latest && (
                <article className="md:col-span-2 group">
                  <Link to={`/blog/${latest.slug}`} className="block">
                    <div className="overflow-hidden rounded-lg mb-3 relative">
                      <img
                        src={latest.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
                        alt={latest.title}
                        className="w-full aspect-[16/9] object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                      <span className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                        Último artículo
                      </span>
                    </div>
                    <h2 className="text-lg md:text-xl font-heading font-extrabold text-heading group-hover:text-primary transition-colors leading-tight mb-1">
                      {latest.title}
                    </h2>
                  </Link>
                  {latest.excerpt && (
                    <p className="text-sm text-muted leading-relaxed line-clamp-3 mb-1">{latest.excerpt}</p>
                  )}
                  <p className="text-xs italic text-muted-foreground">
                    {latest.profiles?.username ?? 'maqaronesia.com'}
                    {latest.published_at && ` · ${formatDate(latest.published_at)}`}
                  </p>
                </article>
              )}

              {/* Two secondary posts stacked */}
              {secondary.length > 0 && (
                <div className="flex flex-col gap-5">
                  {secondary.map(post => (
                    <article key={post.id} className="group flex-1">
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="overflow-hidden rounded-lg mb-2">
                          <img
                            src={post.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
                            alt={post.title}
                            className="w-full aspect-[16/9] object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                        <h3 className="text-sm font-heading font-bold text-heading group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-0.5">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-xs italic text-muted-foreground">
                        {post.profiles?.username ?? 'maqaronesia.com'}
                        {post.published_at && ` · ${formatDate(post.published_at)}`}
                      </p>
                    </article>
                  ))}
                </div>
              )}
            </div>

            {/* Remaining posts row */}
            {rest.length > 0 && (
              <>
                <hr className="mb-6 -mt-5" />
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                  {rest.map(post => (
                    <article key={post.id} className="group">
                      <Link to={`/blog/${post.slug}`} className="block">
                        <div className="overflow-hidden rounded-lg mb-2">
                          <img
                            src={post.image_url || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
                            alt={post.title}
                            className="w-full aspect-[4/3] object-cover group-hover:scale-[1.03] transition-transform duration-500"
                          />
                        </div>
                        <h3 className="text-sm font-heading font-bold text-heading group-hover:text-primary transition-colors leading-snug line-clamp-2 mb-0.5">
                          {post.title}
                        </h3>
                      </Link>
                      <p className="text-xs italic text-muted-foreground">
                        {post.profiles?.username ?? 'maqaronesia.com'}
                        {post.published_at && ` · ${formatDate(post.published_at)}`}
                      </p>
                    </article>
                  ))}
                </div>
              </>
            )}

            <hr className="my-8" />
            <div className="flex justify-center">
              <Link to="/blog" className="btn-clean">
                Ver todos los artículos &rarr;
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
