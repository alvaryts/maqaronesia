export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          bio: string
          is_staff: boolean
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      categories: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
      tags: {
        Row: {
          id: number
          name: string
          slug: string
        }
        Insert: Omit<Database['public']['Tables']['tags']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['tags']['Insert']>
      }
      posts: {
        Row: {
          id: number
          title: string
          slug: string
          author_id: string
          content: string
          excerpt: string
          category_id: number | null
          status: 'draft' | 'published'
          image_url: string | null
          read_time: number
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['posts']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['posts']['Insert']>
      }
      post_tags: {
        Row: {
          post_id: number
          tag_id: number
        }
        Insert: Database['public']['Tables']['post_tags']['Row']
        Update: Partial<Database['public']['Tables']['post_tags']['Insert']>
      }
      courses: {
        Row: {
          id: number
          title: string
          slug: string
          description: string
          instructor_id: string
          price: number
          is_published: boolean
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['courses']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['courses']['Insert']>
      }
      modules: {
        Row: {
          id: number
          course_id: number
          title: string
          order: number
          description: string
        }
        Insert: Omit<Database['public']['Tables']['modules']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['modules']['Insert']>
      }
      lessons: {
        Row: {
          id: number
          module_id: number
          title: string
          slug: string
          content: string
          video_url: string
          order: number
          is_free_preview: boolean
        }
        Insert: Omit<Database['public']['Tables']['lessons']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['lessons']['Insert']>
      }
      user_course_access: {
        Row: {
          user_id: string
          course_id: number
          enrolled_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_course_access']['Row'], 'enrolled_at'>
        Update: Partial<Database['public']['Tables']['user_course_access']['Insert']>
      }
      user_lesson_progress: {
        Row: {
          user_id: string
          lesson_id: number
          completed_at: string
        }
        Insert: Omit<Database['public']['Tables']['user_lesson_progress']['Row'], 'completed_at'>
        Update: Partial<Database['public']['Tables']['user_lesson_progress']['Insert']>
      }
    }
  }
}

// Convenience types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Tag = Database['public']['Tables']['tags']['Row']
export type Post = Database['public']['Tables']['posts']['Row'] & {
  category?: Category | null
  profiles?: Profile | null
  tags?: Tag[]
}
export type Course = Database['public']['Tables']['courses']['Row'] & {
  profiles?: Profile | null
  modules?: Module[]
  enrolled_count?: number
}
export type Module = Database['public']['Tables']['modules']['Row'] & {
  lessons?: Lesson[]
}
export type Lesson = Database['public']['Tables']['lessons']['Row']
