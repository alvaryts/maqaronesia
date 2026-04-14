import { useState, useEffect } from 'react'
import { useParams, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../lib/supabase'
import { Save, ArrowLeft, Eye } from 'lucide-react'
import type { Category, Tag } from '../types/database'

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 80)
}

function estimateReadTime(html: string) {
  const text = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
  const words = text.split(/\s+/).length
  return Math.max(1, Math.round(words / 200))
}

export default function AdminPostEditor() {
  const { id } = useParams()
  const isNew = id === 'new'
  const navigate = useNavigate()
  const { user, profile, loading: authLoading } = useAuth()

  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [content, setContent] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [categoryId, setCategoryId] = useState<number | null>(null)
  const [status, setStatus] = useState<'draft' | 'published'>('draft')
  const [imageUrl, setImageUrl] = useState('')
  const [selectedTags, setSelectedTags] = useState<number[]>([])

  const [categories, setCategories] = useState<Category[]>([])
  const [tags, setTags] = useState<Tag[]>([])
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(!isNew)
  const [autoSlug, setAutoSlug] = useState(true)
  const [preview, setPreview] = useState(false)

  useEffect(() => {
    fetchMeta()
    if (!isNew) fetchPost()
  }, [id])

  useEffect(() => {
    if (autoSlug && title) setSlug(slugify(title))
  }, [title, autoSlug])

  async function fetchMeta() {
    const [{ data: cats }, { data: tgs }] = await Promise.all([
      supabase.from('categories').select('*').order('name'),
      supabase.from('tags').select('*').order('name'),
    ])
    setCategories(cats ?? [])
    setTags(tgs ?? [])
  }

  async function fetchPost() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('id', Number(id))
      .single() as { data: Record<string, unknown> | null }

    if (data) {
      setTitle(data.title as string)
      setSlug(data.slug as string)
      setContent(data.content as string)
      setExcerpt((data.excerpt as string) ?? '')
      setCategoryId(data.category_id as number | null)
      setStatus(data.status as 'draft' | 'published')
      setImageUrl((data.image_url as string) ?? '')
      setAutoSlug(false)

      const { data: postTags } = await supabase
        .from('post_tags')
        .select('tag_id')
        .eq('post_id', data.id as number) as { data: { tag_id: number }[] | null }
      setSelectedTags(postTags?.map(pt => pt.tag_id) ?? [])
    }
    setLoading(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setSaving(true)

    const readTime = estimateReadTime(content)
    const postData = {
      title,
      slug,
      content,
      excerpt: excerpt || content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 200) + '…',
      category_id: categoryId,
      status,
      image_url: imageUrl || null,
      read_time: readTime,
      author_id: user.id,
      published_at: status === 'published' ? new Date().toISOString() : null,
    }

    let postId: number

    if (isNew) {
      const { data, error } = await supabase
        .from('posts')
        .insert(postData as never)
        .select('id')
        .single() as { data: { id: number } | null; error: { message: string } | null }
      if (error || !data) { alert(error?.message ?? 'Error'); setSaving(false); return }
      postId = data.id
    } else {
      postId = Number(id)
      // Preserve original published_at if already published
      const { data: existing } = await supabase
        .from('posts').select('published_at').eq('id', postId).single() as { data: { published_at: string | null } | null }
      if (existing?.published_at && status === 'published') {
        postData.published_at = existing.published_at
      }
      const { error } = await supabase
        .from('posts')
        .update(postData as never)
        .eq('id', postId)
      if (error) { alert(error.message); setSaving(false); return }
    }

    // Sync tags
    await supabase.from('post_tags').delete().eq('post_id', postId)
    if (selectedTags.length > 0) {
      await supabase.from('post_tags').insert(
        selectedTags.map(tag_id => ({ post_id: postId, tag_id })) as never
      )
    }

    setSaving(false)
    navigate('/admin')
  }

  function toggleTag(tagId: number) {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    )
  }

  if (authLoading) return null
  if (!user || !profile?.is_staff) return <Navigate to="/login" replace />
  if (loading) return <div className="max-w-4xl mx-auto px-4 py-24"><div className="shimmer h-96 rounded-lg" /></div>

  return (
    <div>
      <header className="masthead" style={{ backgroundImage: imageUrl ? `url('${imageUrl}')` : "url('https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="masthead-content max-w-4xl mx-auto px-4 lg:px-0 text-center">
          <h1>{isNew ? 'Nuevo Artículo' : 'Editar Artículo'}</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-12">
        <div className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate('/admin')} className="text-muted hover:text-primary transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-heading font-bold text-heading">
            {isNew ? 'Crear artículo' : `Editando: ${title}`}
          </h2>
        </div>

        <form onSubmit={handleSave} className="space-y-8">
          {/* Title */}
          <div>
            <label className="block text-sm font-heading font-bold text-heading uppercase tracking-wider mb-2">Título</label>
            <input
              type="text"
              required
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Título del artículo"
              className="form-clean text-2xl font-heading font-bold"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-heading font-bold text-heading uppercase tracking-wider mb-2">
              Slug
              <button
                type="button"
                onClick={() => { setAutoSlug(!autoSlug); if (!autoSlug) setSlug(slugify(title)) }}
                className="ml-2 text-xs text-primary font-normal normal-case"
              >
                {autoSlug ? '(auto — click para editar manualmente)' : '(manual — click para auto)'}
              </button>
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={e => { setAutoSlug(false); setSlug(e.target.value) }}
              placeholder="url-del-articulo"
              disabled={autoSlug}
              className="form-clean text-sm font-mono disabled:text-muted-foreground"
            />
          </div>

          {/* Category & Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-heading font-bold text-heading uppercase tracking-wider mb-2">Categoría</label>
              <select
                value={categoryId ?? ''}
                onChange={e => setCategoryId(e.target.value ? Number(e.target.value) : null)}
                className="form-clean"
              >
                <option value="">Sin categoría</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-heading font-bold text-heading uppercase tracking-wider mb-2">Estado</label>
              <select
                value={status}
                onChange={e => setStatus(e.target.value as 'draft' | 'published')}
                className="form-clean"
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-heading font-bold text-heading uppercase tracking-wider mb-2">URL de imagen destacada</label>
            <input
              type="url"
              value={imageUrl}
              onChange={e => setImageUrl(e.target.value)}
              placeholder="https://..."
              className="form-clean text-sm"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-heading font-bold text-heading uppercase tracking-wider mb-2">Tags</label>
            <div className="flex flex-wrap gap-2">
              {tags.map(tag => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`text-xs font-heading font-bold uppercase tracking-wider px-3 py-1.5 border transition-colors rounded ${
                    selectedTags.includes(tag.id)
                      ? 'bg-primary text-white border-primary'
                      : 'bg-transparent text-muted border-border hover:border-primary hover:text-primary'
                  }`}
                >
                  {tag.name}
                </button>
              ))}
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-heading font-bold text-heading uppercase tracking-wider mb-2">Extracto (opcional)</label>
            <textarea
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              placeholder="Breve descripción del artículo (se genera automáticamente si se deja vacío)"
              rows={2}
              className="form-clean resize-none text-sm"
            />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-heading font-bold text-heading uppercase tracking-wider">Contenido (HTML)</label>
              <button
                type="button"
                onClick={() => setPreview(!preview)}
                className="text-xs text-primary flex items-center gap-1 hover:underline"
              >
                <Eye className="w-3 h-3" />
                {preview ? 'Editar' : 'Previsualizar'}
              </button>
            </div>
            {preview ? (
              <div
                className="prose max-w-none min-h-[400px] p-6 border border-border rounded-lg bg-surface"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            ) : (
              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder="<p>Escribe tu artículo en HTML...</p>"
                rows={20}
                className="w-full font-mono text-sm p-4 border border-border rounded-lg bg-surface focus:outline-none focus:border-primary resize-y min-h-[400px]"
              />
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 pt-4 border-t border-border">
            <button
              type="submit"
              disabled={saving}
              className="btn-clean flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? 'Guardando...' : isNew ? 'Crear artículo' : 'Guardar cambios'}
            </button>
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="text-muted hover:text-heading transition-colors text-sm font-heading uppercase tracking-wider"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
