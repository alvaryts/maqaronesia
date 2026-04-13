import { Link } from 'react-router-dom'
import { Clock } from 'lucide-react'
import type { Post } from '../../types/database'
import { formatDate } from '../../lib/utils'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="bg-surface border border-border rounded-2xl overflow-hidden card-hover flex flex-col h-full group">
      {post.image_url && (
        <Link to={`/blog/${post.slug}`} className="block aspect-video overflow-hidden">
          <img
            src={post.image_url}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </Link>
      )}

      <div className="p-6 flex flex-col flex-grow">
        {/* Meta */}
        <div className="flex items-center gap-2 mb-3 text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">
          {post.category ? (
            <span className="text-primary">{post.category.name}</span>
          ) : (
            <span>General</span>
          )}
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {post.read_time} MIN
          </span>
        </div>

        {/* Title */}
        <h2 className="text-xl font-heading font-extrabold mb-3 text-white group-hover:text-primary transition-colors leading-tight">
          <Link to={`/blog/${post.slug}`}>{post.title}</Link>
        </h2>

        {/* Excerpt */}
        <p className="text-sm text-muted leading-relaxed line-clamp-2 mb-6">
          {post.excerpt || post.content.replace(/[#*_`]/g, '').slice(0, 120) + '...'}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-border flex justify-between items-center">
          <div className="flex items-center gap-2 text-[0.6rem] font-bold text-muted-foreground uppercase tracking-widest">
            <span>{post.profiles?.username}</span>
            {post.published_at && (
              <>
                <span>•</span>
                <span>{formatDate(post.published_at)}</span>
              </>
            )}
          </div>
          <Link
            to={`/blog/${post.slug}`}
            className="border border-border hover:border-primary hover:text-primary px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
          >
            Leer más
          </Link>
        </div>
      </div>
    </article>
  )
}
