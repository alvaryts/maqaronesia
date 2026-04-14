import { useParams, Link } from 'react-router-dom'
import { PlayCircle, Lock, ChevronDown } from 'lucide-react'
import { useCourse } from '../hooks/useCourses'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'

export default function CourseDetail() {
  const { slug } = useParams<{ slug: string }>()
  const { course, isEnrolled, loading, enroll } = useCourse(slug ?? '')
  const { user } = useAuth()
  const [openModule, setOpenModule] = useState<number | null>(0)

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-20 px-4">
        <div className="h-10 bg-surface rounded animate-pulse w-3/4 mb-4" />
        <div className="h-6 bg-surface rounded animate-pulse w-1/2 mb-8" />
        <div className="h-64 bg-surface rounded animate-pulse" />
      </div>
    )
  }

  if (!course) {
    return (
      <div className="text-center py-20">
        <h1 className="text-3xl font-heading font-bold text-white mb-4">Curso no encontrado</h1>
      </div>
    )
  }

  return (
    <>
      {/* Masthead */}
      <header
        className="masthead"
        style={{
          backgroundImage: `url('${course.image_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1920&q=80'}')`,
        }}
      >
        <div className="masthead-content">
          <h1 className="text-4xl md:text-5xl font-heading font-extrabold mb-4">
            {course.title}
          </h1>
          <span className="text-xl text-white/80 font-body">
            {course.price === 0 ? 'Curso Gratuito' : `${course.price}€`}
          </span>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-12">
        <p className="text-lg text-muted leading-relaxed mb-8 font-body">{course.description}</p>

        {/* Enroll / Access */}
        <div className="mb-12 pb-8 border-b border-border">
          {isEnrolled ? (
            <div className="flex items-center gap-4 flex-wrap">
              <span className="text-green-400 font-bold text-sm">✓ Ya tienes acceso</span>
              {course.modules?.[0]?.lessons?.[0] && (
                <Link
                  to={`/courses/${course.slug}/lessons/${course.modules[0].lessons[0].slug}`}
                  className="btn-clean"
                >
                  Continuar Curso
                </Link>
              )}
            </div>
          ) : (
            <button
              onClick={user ? enroll : undefined}
              className="btn-clean"
            >
              {user ? 'Inscribirse Ahora' : 'Inicia sesión para inscribirte'}
            </button>
          )}
        </div>

        {/* Modules */}
        <h2 className="text-2xl font-heading font-extrabold text-white mb-6">Temario</h2>
        <div className="space-y-3">
          {course.modules?.map((mod, idx) => (
            <div key={mod.id} className="border border-border rounded overflow-hidden">
              <button
                onClick={() => setOpenModule(openModule === idx ? null : idx)}
                className="w-full flex items-center justify-between p-4 text-left hover:bg-surface transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold text-sm">{mod.order}.</span>
                  <span className="font-bold text-white text-sm">{mod.title}</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${openModule === idx ? 'rotate-180' : ''}`} />
              </button>

              {openModule === idx && (
                <ul className="border-t border-border">
                  {mod.lessons?.map(lesson => {
                    const canAccess = isEnrolled || lesson.is_free_preview
                    return (
                      <li key={lesson.id} className="border-t border-border first:border-t-0">
                        <Link
                          to={canAccess ? `/courses/${course.slug}/lessons/${lesson.slug}` : '#'}
                          className={`flex justify-between items-center py-3 px-6 group ${
                            !canAccess ? 'opacity-50 pointer-events-none' : 'hover:bg-surface'
                          } transition-colors`}
                        >
                          <span className="flex items-center gap-3 text-sm text-foreground/80 group-hover:text-primary transition-colors">
                            <PlayCircle className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                            {lesson.title}
                          </span>
                          <div className="flex items-center gap-2">
                            {lesson.is_free_preview && (
                              <span className="text-green-400 text-[0.6rem] font-bold uppercase tracking-widest">
                                Preview
                              </span>
                            )}
                            {!canAccess && <Lock className="w-3.5 h-3.5 opacity-30" />}
                          </div>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              )}
            </div>
          ))}

          {(!course.modules || course.modules.length === 0) && (
            <p className="text-sm text-muted py-8 text-center">Contenido próximamente.</p>
          )}
        </div>
      </div>
    </>
  )
}
