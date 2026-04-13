import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Post } from '../types/database'

export function usePosts(limit = 12) {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*),
          profiles(*)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(limit)

      setPosts((data as unknown as Post[]) ?? [])
      setLoading(false)
    }
    fetch()
  }, [limit])

  return { posts, loading }
}

export function usePost(slug: string) {
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('posts')
        .select(`
          *,
          category:categories(*),
          profiles(*)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single()

      const postData = data as unknown as Post | null
      if (postData) {
        // Fetch tags separately via junction table
        const { data: postTags } = await supabase
          .from('post_tags')
          .select('tag_id, tags(*)')
          .eq('post_id', postData.id)

        const rawTags = postTags as unknown as Array<{ tags: { id: number; name: string; slug: string } }> | null
        const tags = rawTags?.map(pt => pt.tags).filter(Boolean) ?? []
        setPost({ ...postData, tags })
      }
      setLoading(false)
    }
    fetch()
  }, [slug])

  return { post, loading }
}
