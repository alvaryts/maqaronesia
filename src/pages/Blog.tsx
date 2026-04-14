import { Link } from 'react-router-dom'
import { usePosts } from '../hooks/usePosts'
import { formatDate } from '../lib/utils'

export default function Blog() {
  const { posts, loading } = usePosts(24)

  return (
    <div>
      {/* Masthead */}
      <header className="masthead" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="masthead-content max-w-4xl mx-auto px-4 lg:px-0 text-center">
          <h1>Blog</h1>
          <span className="subheading">Ideas que inspiran código</span>
        </div>
      </header>

      {/* Post list */}
      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-12">
        {loading ? (
          <div className="space-y-8">
            {[1, 2, 3, 4].map(i => (
              <div key={i}>
                <div className="h-8 bg-surface rounded animate-pulse w-3/4 mb-2" />
                <div className="h-5 bg-surface rounded animate-pulse w-1/2 mb-2" />
                <div className="h-4 bg-surface rounded animate-pulse w-1/3" />
                <hr className="my-8" />
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-heading font-bold text-heading mb-2">Próximamente</p>
            <p className="text-muted">Estamos preparando contenido increíble. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <div>
            {posts.map((post, i) => (
              <div key={post.id}>
                <div className="post-preview">
                  <Link to={`/blog/${post.slug}`}>
                    <h2 className="post-title font-heading font-extrabold text-heading">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <h3 className="post-subtitle">
                        {post.excerpt}
                      </h3>
                    )}
                  </Link>
                  <p className="post-meta">
                    Publicado por{' '}
                    <span className="text-foreground">{post.profiles?.username ?? 'maqaronesia.com'}</span>
                    {post.published_at && ` el ${formatDate(post.published_at)}`}
                  </p>
                </div>
                {i < posts.length - 1 && <hr className="my-8" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
