import { useCourses } from '../hooks/useCourses'
import CourseCard from '../components/courses/CourseCard'

export default function Courses() {
  const { courses, loading } = useCourses()

  return (
    <div>
      {/* Masthead */}
      <header className="masthead" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509966756634-9c23dd6e6815?auto=format&fit=crop&w=1920&q=80')" }}>
        <div className="masthead-content max-w-4xl mx-auto px-4 lg:px-0 text-center">
          <h1>Academy</h1>
          <span className="subheading">Aprende con propósito</span>
        </div>
      </header>

      {/* Course grid */}
      <div className="max-w-4xl mx-auto px-4 lg:px-0 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="bg-surface border border-border rounded h-72 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-heading font-bold text-white mb-2">Próximos lanzamientos</p>
            <p className="text-muted">Estamos puliendo los mejores cursos para ti. ¡Vuelve pronto!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {courses.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
