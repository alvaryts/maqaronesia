import { useParams, Link } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import remarkGfm from 'remark-gfm'
import { ArrowLeft, ArrowRight, CheckCircle2, Circle, Play, List } from 'lucide-react'
import { useLesson } from '../hooks/useCourses'
import { useState } from 'react'
import 'highlight.js/styles/github.css'

export default function LessonDetail() {
  const { courseSlug, lessonSlug } = useParams<{ courseSlug: string; lessonSlug: string }>()
  const {
    lesson, course, prevLesson, nextLesson,
    isCompleted, progressPercent, completedIds,
    loading, toggleComplete,
  } = useLesson(courseSlug ?? '', lessonSlug ?? '')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto pt-8 px-4 space-y-6">
        <div className="h-8 bg-surface rounded animate-pulse w-1/3" />
        <div className="h-64 bg-surface rounded animate-pulse" />
      </div>
    )
  }

  if (!lesson || !course) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-heading font-bold text-heading mb-4">Lección no encontrada</h1>
      </div>
    )
  }

  return (
    <div className="flex min-h-[calc(100vh-64px)]">
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-16 left-0 z-40 w-72 h-[calc(100vh-64px)] bg-surface border-r border-border flex flex-col
        transform transition-transform lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Progress */}
        <div className="p-5 border-b border-border">
          <h2 className="font-heading font-extrabold text-sm text-heading leading-tight mb-2">
            {course.title}
          </h2>
          <div className="w-full h-1.5 bg-border rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[0.65rem] text-muted-foreground mt-1.5">{progressPercent}% completado</p>
        </div>

        {/* Module list */}
        <div className="flex-grow overflow-y-auto p-3 space-y-1">
          {course.modules?.map(mod => (
            <details key={mod.id} open={mod.lessons?.some(l => l.slug === lessonSlug)}>
              <summary className="flex items-center gap-2 p-2.5 text-xs font-bold text-heading cursor-pointer hover:bg-surface rounded transition-colors">
                <span className="text-primary text-[0.65rem]">{mod.order}.</span>
                {mod.title}
              </summary>
              <ul className="mt-0.5">
                {mod.lessons?.map(l => {
                  const isCurrent = l.slug === lessonSlug
                  const isDone = completedIds.includes(l.id)
                  return (
                    <li key={l.id}>
                      <Link
                        to={`/courses/${course.slug}/lessons/${l.slug}`}
                        onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-2.5 py-2 px-5 text-[0.75rem] transition-colors rounded ${
                          isCurrent
                            ? 'bg-primary/10 text-primary border-l-2 border-primary font-bold'
                            : 'text-muted-foreground hover:text-heading'
                        }`}
                      >
                        {isCurrent ? (
                          <Play className="w-3 h-3" />
                        ) : isDone ? (
                          <CheckCircle2 className="w-3 h-3 text-green-400" />
                        ) : (
                          <Circle className="w-3 h-3" />
                        )}
                        {l.title}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </details>
          ))}
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 md:p-12">
          {/* Breadcrumbs */}
          <div className="flex items-center justify-between mb-8">
            <div className="text-xs text-muted-foreground hidden md:block">
              <Link to="/courses" className="hover:text-primary transition-colors">Academia</Link>
              {' / '}
              <Link to={`/courses/${course.slug}`} className="hover:text-primary transition-colors">
                {course.title}
              </Link>
              {' / '}
              <span className="text-foreground">{lesson.title}</span>
            </div>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden border border-border hover:border-primary px-3 py-1.5 rounded text-sm flex items-center gap-2"
            >
              <List className="w-4 h-4" /> Temario
            </button>
          </div>

          <h1 className="text-2xl md:text-4xl font-extrabold font-heading mb-8 text-heading">
            {lesson.title}
          </h1>

          {/* Video */}
          {lesson.video_url && (
            <div className="aspect-video bg-surface rounded overflow-hidden border border-border mb-10">
              <iframe
                className="w-full h-full"
                src={lesson.video_url}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none mb-16">
            <ReactMarkdown rehypePlugins={[rehypeHighlight]} remarkPlugins={[remarkGfm]}>
              {lesson.content}
            </ReactMarkdown>
          </div>

          {/* Navigation */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-border">
            {prevLesson ? (
              <Link
                to={`/courses/${course.slug}/lessons/${prevLesson.slug}`}
                className="btn-clean text-sm flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" /> Anterior
              </Link>
            ) : (
              <button disabled className="border border-border px-6 py-2 rounded text-sm flex items-center gap-2 opacity-30 cursor-not-allowed">
                <ArrowLeft className="w-4 h-4" /> Anterior
              </button>
            )}

            <button
              onClick={toggleComplete}
              className={`px-8 py-2 rounded font-bold flex items-center gap-2 transition-all text-sm ${
                isCompleted
                  ? 'bg-green-500 text-white'
                  : 'btn-clean'
              }`}
            >
              {isCompleted ? 'Completada' : 'Marcar como completada'}
              <CheckCircle2 className="w-4 h-4" />
            </button>

            {nextLesson ? (
              <Link
                to={`/courses/${course.slug}/lessons/${nextLesson.slug}`}
                className="btn-clean text-sm flex items-center gap-2"
              >
                Siguiente <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <button disabled className="border border-border px-6 py-2 rounded text-sm flex items-center gap-2 opacity-30 cursor-not-allowed">
                Siguiente <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
