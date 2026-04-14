import { Link } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import { formatDate } from '../lib/utils'

export default function Home() {
  const { posts, loading } = usePosts(7)
  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div>
      {/* Masthead */}
      <header className="masthead" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="masthead-content max-w-4xl mx-auto px-4 lg:px-0 text-center">
          <h1 className="!text-white">MaQAronesia</h1>
          <span className="subheading">IA · Automatización · Ingeniería · Calidad</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-12">
        {loading ? (
          <div className="space-y-8">
            <div className="h-72 bg-surface rounded animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <div key={i} className="h-48 bg-surface rounded animate-pulse" />
              ))}
            </div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-heading font-bold text-heading mb-2">Próximamente</p>
            <p className="text-muted">Estamos preparando contenido increíble. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <article className="mb-12">
                <Link to={`/blog/${featured.slug}`} className="block group">
                  {featured.image_url && (
                    <div className="aspect-[2/1] overflow-hidden rounded-lg mb-5">
                      <img
                        src={featured.image_url}
                        alt={featured.title}
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                      />
                    </div>
                  )}
                  <h2 className="text-2xl md:text-3xl font-heading font-extrabold text-heading group-hover:text-primary transition-colors leading-tight mb-2">
                    {featured.title}
                  </h2>
                </Link>
                {featured.excerpt && (
                  <p className="text-lg text-muted leading-relaxed mb-3">{featured.excerpt}</p>
                )}
                <p className="text-sm italic text-muted-foreground">
                  Publicado por{' '}
                  <span className="text-foreground">{featured.profiles?.username ?? 'MaQAronesia'}</span>
                  {featured.published_at && ` el ${formatDate(featured.published_at)}`}
                </p>
              </article>
            )}

            {/* Divider */}
            {rest.length > 0 && <hr className="mb-10" />}

            {/* Rest of posts in a 2-column grid with images */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                {rest.map(post => (
                  <article key={post.id} className="group">
                    <Link to={`/blog/${post.slug}`} className="block">
                      {post.image_url && (
                        <div className="aspect-[16/10] overflow-hidden rounded-lg mb-4">
                          <img
                            src={post.image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          />
                        </div>
                      )}
                      <h3 className="text-lg font-heading font-extrabold text-heading group-hover:text-primary transition-colors leading-snug mb-1">
                        {post.title}
                      </h3>
                    </Link>
                    {post.excerpt && (
                      <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-2">{post.excerpt}</p>
                    )}
                    <p className="text-xs italic text-muted-foreground">
                      {post.profiles?.username ?? 'MaQAronesia'}
                      {post.published_at && ` · ${formatDate(post.published_at)}`}
                    </p>
                  </article>
                ))}
              </div>
            )}

            <hr className="my-10" />
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
