import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import type { Course, Module, Lesson } from '../types/database'
import { useAuth } from '../context/AuthContext'

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('courses')
        .select(`*, profiles(*)`)
        .eq('is_published', true)
        .order('created_at', { ascending: false })

      const rawCourses = (data as unknown as Course[]) ?? []

      // Get enrolled counts
      const coursesWithCounts = await Promise.all(
        rawCourses.map(async (course) => {
          const { count } = await supabase
            .from('user_course_access')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id)
          return { ...course, enrolled_count: count ?? 0 }
        })
      )

      setCourses(coursesWithCounts)
      setLoading(false)
    }
    fetch()
  }, [])

  return { courses, loading }
}

export function useCourse(slug: string) {
  const [course, setCourse] = useState<Course | null>(null)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetch() {
      const { data } = await supabase
        .from('courses')
        .select(`*, profiles(*)`)
        .eq('slug', slug)
        .single()

      const courseData = data as unknown as Course | null
      if (courseData) {
        // Fetch modules with lessons
        const { data: modules } = await supabase
          .from('modules')
          .select(`*, lessons(*)`)
          .eq('course_id', courseData.id)
          .order('order')

        const rawModules = (modules as unknown as Module[]) ?? []

        // Sort lessons within modules
        const sortedModules = rawModules.map((m) => ({
          ...m,
          lessons: (m.lessons ?? []).sort((a: Lesson, b: Lesson) => a.order - b.order),
        }))

        setCourse({ ...courseData, modules: sortedModules })

        // Check enrollment
        if (user) {
          const { data: access } = await supabase
            .from('user_course_access')
            .select('*')
            .eq('user_id', user.id)
            .eq('course_id', courseData.id)
            .maybeSingle()
          setIsEnrolled(!!access)
        }
      }
      setLoading(false)
    }
    fetch()
  }, [slug, user])

  async function enroll() {
    if (!user || !course) return
    const { error } = await supabase
      .from('user_course_access')
      .insert({ user_id: user.id, course_id: course.id } as any)
    if (!error) setIsEnrolled(true)
  }

  return { course, isEnrolled, loading, enroll }
}

export function useLesson(courseSlug: string, lessonSlug: string) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [course, setCourse] = useState<Course | null>(null)
  const [allLessons, setAllLessons] = useState<Lesson[]>([])
  const [completedIds, setCompletedIds] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    async function fetch() {
      // Get course
      const { data: rawCourseData } = await supabase
        .from('courses')
        .select('*')
        .eq('slug', courseSlug)
        .single()

      const courseData = rawCourseData as unknown as Course | null
      if (!courseData) { setLoading(false); return }

      // Get modules + lessons
      const { data: rawModules } = await supabase
        .from('modules')
        .select('*, lessons(*)')
        .eq('course_id', courseData.id)
        .order('order')

      const modulesData = (rawModules as unknown as Module[]) ?? []

      const sortedModules = modulesData.map((m) => ({
        ...m,
        lessons: (m.lessons ?? []).sort((a: Lesson, b: Lesson) => a.order - b.order),
      }))

      setCourse({ ...courseData, modules: sortedModules })

      // Flatten all lessons
      const flat = sortedModules.flatMap((m) => m.lessons ?? [])
      setAllLessons(flat)

      // Find current lesson
      const current = flat.find((l) => l.slug === lessonSlug)
      setLesson(current ?? null)

      // Get progress
      if (user && flat.length > 0) {
        const { data: progress } = await supabase
          .from('user_lesson_progress')
          .select('lesson_id')
          .eq('user_id', user.id)
          .in('lesson_id', flat.map((l) => l.id))

        const progressData = (progress as unknown as Array<{ lesson_id: number }>) ?? []
        setCompletedIds(progressData.map(p => p.lesson_id))
      }

      setLoading(false)
    }
    fetch()
  }, [courseSlug, lessonSlug, user])

  const currentIndex = allLessons.findIndex(l => l.slug === lessonSlug)
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null
  const isCompleted = lesson ? completedIds.includes(lesson.id) : false
  const progressPercent = allLessons.length > 0
    ? Math.round((completedIds.length / allLessons.length) * 100)
    : 0

  async function toggleComplete() {
    if (!user || !lesson) return
    if (isCompleted) {
      await supabase
        .from('user_lesson_progress')
        .delete()
        .eq('user_id', user.id)
        .eq('lesson_id', lesson.id)
      setCompletedIds(prev => prev.filter(id => id !== lesson.id))
    } else {
      await supabase
        .from('user_lesson_progress')
        .insert({ user_id: user.id, lesson_id: lesson.id } as any)
      setCompletedIds(prev => [...prev, lesson.id])
    }
  }

  return { lesson, course, allLessons, prevLesson, nextLesson, isCompleted, progressPercent, completedIds, loading, toggleComplete }
}
