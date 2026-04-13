import { usePosts } from '../hooks/usePosts'
import PostCard from '../components/blog/PostCard'

export default function Blog() {
  const { posts, loading } = usePosts(24)

  return (
    <div>
      {/* Header */}
      <div className="py-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold font-heading mb-4 text-white uppercase">
          Blog de <span className="text-primary">Maqaronesia</span>
        </h1>
        <p className="text-lg text-muted font-medium tracking-tight">
          IA, Automatización, Ingeniería y Calidad en el desarrollo de software.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-surface border border-border rounded-2xl h-80 animate-pulse" />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border">
          <p className="text-xl font-bold text-white mb-2">Próximamente</p>
          <p className="text-muted">Estamos preparando contenido increíble. ¡Vuelve pronto!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
