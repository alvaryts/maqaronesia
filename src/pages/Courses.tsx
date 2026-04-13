import { useCourses } from '../hooks/useCourses'
import CourseCard from '../components/courses/CourseCard'

export default function Courses() {
  const { courses, loading } = useCourses()

  return (
    <div>
      {/* Header */}
      <div className="py-12 md:py-16 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold font-heading mb-4 tracking-tight text-white uppercase">
          Maqaronesia <span className="text-primary">Academy</span>
        </h1>
        <p className="text-lg text-muted leading-relaxed font-medium">
          Rutas de aprendizaje estructuradas para ingenieros que buscan la excelencia.
        </p>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-surface border border-border rounded-2xl h-96 animate-pulse" />
          ))}
        </div>
      ) : courses.length === 0 ? (
        <div className="text-center py-20 bg-surface rounded-2xl border border-dashed border-border">
          <p className="text-xl font-bold text-white mb-2">Próximos lanzamientos</p>
          <p className="text-muted">Estamos puliendo los mejores cursos para ti. ¡Vuelve pronto!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}
    </div>
  )
}
