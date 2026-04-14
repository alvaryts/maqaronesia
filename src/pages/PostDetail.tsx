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
      <div>
        <header className="masthead">
          <div className="masthead-content max-w-4xl mx-auto px-4 lg:px-0 text-center">
            <div className="h-10 bg-white/10 rounded animate-pulse w-3/4 mx-auto mb-4" />
            <div className="h-6 bg-white/10 rounded animate-pulse w-1/2 mx-auto" />
          </div>
        </header>
        <div className="max-w-4xl mx-auto px-4 lg:px-0 py-12">
          <div className="h-64 bg-surface rounded animate-pulse" />
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div>
        <header className="masthead">
          <div className="masthead-content max-w-4xl mx-auto px-4 lg:px-0 text-center">
            <h1>Artículo no encontrado</h1>
            <span className="subheading">El artículo que buscas no existe o no está publicado.</span>
          </div>
        </header>
      </div>
    )
  }

  return (
    <div>
      {/* Post Masthead */}
      <header
        className="masthead"
        style={{
          backgroundImage: post.image_url
            ? `url('${post.image_url}')`
            : "url('https://images.unsplash.com/photo-1510915228340-29c85a43dcfe?auto=format&fit=crop&w=1920&q=80')"
        }}
      >
        <div className="masthead-content max-w-4xl mx-auto px-4 lg:px-0">
          <div className="text-center md:text-left">
            <h1 className="!text-3xl md:!text-4xl leading-tight">{post.title}</h1>
            {post.excerpt && (
              <span className="subheading !text-lg">{post.excerpt}</span>
            )}
            <span className="subheading !text-base !font-normal italic mt-4">
              Publicado por {post.profiles?.username ?? 'MaQAronesia'}
              {post.published_at && ` el ${formatDate(post.published_at)}`}
            </span>
          </div>
        </div>
      </header>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-4 lg:px-0 py-12">
        <div className="prose prose-invert prose-lg max-w-none">
          <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
            {post.content}
          </ReactMarkdown>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 py-8 mt-8 border-t border-border">
            {post.tags.map(tag => (
              <span
                key={tag.id}
                className="bg-surface border border-border text-xs font-heading font-bold uppercase tracking-wide px-3 py-1.5 rounded"
              >
                #{tag.name}
              </span>
            ))}
          </div>
        )}
      </article>
    </div>
  )
}
