import { useParams } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { usePost } from '../hooks/usePosts'
import { formatDate } from '../lib/utils'
import 'highlight.js/styles/github-dark.css'

export default function PostDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { post, loading } = usePost(slug ?? '')

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto pt-8 space-y-6">
        <div className="h-8 bg-surface rounded animate-pulse w-1/4" />
        <div className="h-12 bg-surface rounded animate-pulse" />
        <div className="h-64 bg-surface rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-heading font-bold text-white mb-4">Artículo no encontrado</h1>
        <p className="text-muted">El artículo que buscas no existe o no está publicado.</p>
      </div>
    )
  }

  return (
    <article className="max-w-2xl mx-auto pt-8 animate-fade-in">
      {/* Header */}
      <header className="mb-10">
        <div className="text-[0.6rem] font-bold uppercase tracking-widest text-primary mb-2">
          {post.category?.name ?? 'General'}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold font-heading text-white mb-6 leading-tight">
          {post.title}
        </h1>
        <div className="flex items-center justify-between text-[0.6rem] font-bold text-muted-foreground uppercase tracking-widest py-4 border-y border-border">
          <span>
            {post.profiles?.username} {post.published_at && `• ${formatDate(post.published_at)}`}
          </span>
          <span>{post.read_time} MIN READ</span>
        </div>
      </header>

      {/* Image */}
      {post.image_url && (
        <div className="mb-10 rounded-xl overflow-hidden border border-border">
          <img src={post.image_url} alt={post.title} className="w-full h-auto" />
        </div>
      )}

      {/* Content */}
      <div className="prose prose-invert max-w-none mb-12">
        <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 py-8 border-y border-border">
          {post.tags.map(tag => (
            <span
              key={tag.id}
              className="bg-surface border border-border text-xs font-bold uppercase tracking-wide px-4 py-2 rounded-full"
            >
              #{tag.name}
            </span>
          ))}
        </div>
      )}

      {/* Author */}
      <div className="pt-8">
        <p className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground mb-1">Escrito por</p>
        <p className="text-base font-heading font-bold text-white">{post.profiles?.username}</p>
        <p className="text-sm text-muted mt-2">{post.profiles?.bio || 'Autor de MaQAronesia'}</p>
      </div>
    </article>
  )
}
