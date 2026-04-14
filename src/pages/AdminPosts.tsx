import { useState, useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Plus, Edit, Trash2, Eye, FileText } from 'lucide-react'
import type { Post } from '../types/database'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export default function AdminPosts() {
  const { user, profile, loading: authLoading } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<number | null>(null)

  useEffect(() => {
    if (!profile?.is_staff) return
    fetchPosts()
  }, [profile])

  async function fetchPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*, category:categories(*), profiles(*)')
      .order('created_at', { ascending: false })

    setPosts((data as unknown as Post[]) ?? [])
    setLoading(false)
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Seguro que quieres eliminar este post?')) return
    setDeleting(id)
    await supabase.from('post_tags').delete().eq('post_id', id)
    await supabase.from('posts').delete().eq('id', id)
    setPosts(posts.filter(p => p.id !== id))
    setDeleting(null)
  }

  if (authLoading) return null
  if (!user || !profile?.is_staff) return <Navigate to="/login" replace />

  return (
    <div>
      <header className="masthead" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="masthead-content max-w-4xl mx-auto px-4 lg:px-0 text-center">
          <h1>Admin Panel</h1>
          <span className="subheading">Gestión de artículos del blog</span>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-12">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-heading font-bold text-heading">
            <FileText className="inline w-6 h-6 mr-2 -mt-1" />
            Artículos ({posts.length})
          </h2>
          <Link to="/admin/posts/new" className="btn-clean flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nuevo Post
          </Link>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="shimmer h-20 rounded-lg" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <p className="text-muted text-center py-12">No hay artículos todavía.</p>
        ) : (
          <div className="space-y-0 divide-y divide-border">
            {posts.map(post => (
              <div key={post.id} className="flex items-start justify-between py-5 gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`inline-block text-xs font-heading font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      post.status === 'published'
                        ? 'bg-success/10 text-success'
                        : 'bg-muted/10 text-muted'
                    }`}>
                      {post.status === 'published' ? 'Publicado' : 'Borrador'}
                    </span>
                    {post.category && (
                      <span className="text-xs text-muted-foreground">{post.category.name}</span>
                    )}
                  </div>
                  <h3 className="font-heading font-bold text-heading text-lg truncate">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {post.published_at
                      ? format(new Date(post.published_at), "d 'de' MMMM, yyyy", { locale: es })
                      : 'Sin fecha de publicación'}
                    {' · '}{post.read_time} min lectura
                  </p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  {post.status === 'published' && (
                    <Link
                      to={`/blog/${post.slug}`}
                      className="p-2 text-muted hover:text-primary transition-colors"
                      title="Ver"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}
                  <Link
                    to={`/admin/posts/${post.id}`}
                    className="p-2 text-muted hover:text-primary transition-colors"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(post.id)}
                    disabled={deleting === post.id}
                    className="p-2 text-muted hover:text-error transition-colors disabled:opacity-50"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
