import { useParams, Link } from 'react-router-dom'
import { Award, Infinity, PlayCircle, Lock, ChevronDown } from 'lucide-react'
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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-10 bg-surface rounded animate-pulse w-3/4" />
          <div className="h-6 bg-surface rounded animate-pulse w-1/2" />
          <div className="h-64 bg-surface rounded-2xl animate-pulse" />
        </div>
        <div className="h-96 bg-surface rounded-3xl animate-pulse" />
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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-8 animate-fade-in">
      {/* Main */}
      <div className="lg:col-span-2 space-y-12">
        <header>
          <span className="inline-block border border-primary/30 text-primary px-3 py-1.5 rounded-full text-[0.6rem] font-bold uppercase tracking-widest mb-4">
            Curso Premium
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold font-heading mb-6 tracking-tight text-white leading-tight">
            {course.title}
          </h1>
          <p className="text-lg text-muted leading-relaxed">{course.description}</p>
        </header>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-border" />
          <span className="text-[0.6rem] font-bold uppercase tracking-widest text-muted-foreground">Temario del Curso</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* Modules */}
        <div className="space-y-4">
          {course.modules?.map((mod, idx) => (
            <div key={mod.id} className="bg-surface border border-border rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenModule(openModule === idx ? null : idx)}
                className="w-full flex items-center justify-between p-5 text-left"
              >
                <div className="flex items-center gap-4">
                  <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-extrabold text-xs">
                    {mod.order}
                  </span>
                  <span className="font-bold text-white">{mod.title}</span>
                </div>
                <ChevronDown className={`w-5 h-5 text-muted-foreground transition-transform ${openModule === idx ? 'rotate-180' : ''}`} />
              </button>

              {openModule === idx && (
                <ul className="border-t border-border">
                  {mod.lessons?.map(lesson => {
                    const canAccess = isEnrolled || lesson.is_free_preview
                    return (
                      <li key={lesson.id} className="border-t border-border first:border-t-0">
                        <Link
                          to={canAccess ? `/courses/${course.slug}/lessons/${lesson.slug}` : '#'}
                          className={`flex justify-between items-center py-4 px-6 group ${
                            !canAccess ? 'opacity-50 pointer-events-none' : 'hover:bg-surface-alt'
                          } transition-colors`}
                        >
                          <span className="flex items-center gap-3 text-sm text-foreground/80 group-hover:text-primary transition-colors">
                            <PlayCircle className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                            {lesson.title}
                          </span>
                          <div className="flex items-center gap-2">
                            {lesson.is_free_preview && (
                              <span className="bg-success/10 text-success text-[0.5rem] font-bold uppercase tracking-widest px-2 py-0.5 rounded">
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
            <div className="bg-surface border border-border rounded-2xl p-6 text-center">
              <p className="text-sm text-muted">Contenido próximamente.</p>
            </div>
          )}
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-surface border border-border rounded-3xl overflow-hidden sticky top-24">
          <div className="aspect-video relative overflow-hidden">
            {course.image_url ? (
              <img src={course.image_url} alt={course.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-surface-alt flex items-center justify-center">
                <span className="text-5xl opacity-10">🎓</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-6">
              <span className="text-white text-2xl font-extrabold font-heading">
                {course.price === 0 ? 'Gratis' : `${course.price}€`}
              </span>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {isEnrolled ? (
              <>
                <div className="bg-success/5 border border-success/10 p-4 rounded-xl flex items-center gap-3">
                  <span className="text-success font-bold text-sm">✓ Ya tienes acceso</span>
                </div>
                {course.modules?.[0]?.lessons?.[0] && (
                  <Link
                    to={`/courses/${course.slug}/lessons/${course.modules[0].lessons[0].slug}`}
                    className="block bg-primary text-primary-foreground text-center py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
                  >
                    Continuar Curso
                  </Link>
                )}
              </>
            ) : (
              <button
                onClick={user ? enroll : undefined}
                className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-bold hover:opacity-90 transition-opacity"
              >
                {user ? 'Inscribirse Ahora' : 'Inicia sesión para inscribirte'}
              </button>
            )}

            <ul className="space-y-4 pt-4 border-t border-border">
              <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <Award className="w-4 h-4 text-primary" /> Certificado final
              </li>
              <li className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                <Infinity className="w-4 h-4 text-primary" /> Acceso de por vida
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}
