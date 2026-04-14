import { Link } from 'react-router-dom'
import type { Post } from '../../types/database'
import { formatDate } from '../../lib/utils'

interface PostCardProps {
  post: Post
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <article className="post-preview">
      <Link to={`/blog/${post.slug}`}>
        <h2 className="post-title font-heading font-extrabold text-white">
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
        <span className="text-foreground">{post.profiles?.username ?? 'MaQAronesia'}</span>
        {post.published_at && ` el ${formatDate(post.published_at)}`}
      </p>
    </article>
  )
}
