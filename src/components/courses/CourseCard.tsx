import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import type { Course } from '../../types/database'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="card-clean rounded overflow-hidden flex flex-col h-full group">
      <div className="aspect-video overflow-hidden bg-surface-alt">
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-surface-alt flex items-center justify-center">
            <span className="text-4xl opacity-20">📚</span>
          </div>
        )}
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="mb-3">
          <span className={`text-xs font-heading font-bold uppercase tracking-wider ${
            course.price === 0 ? 'text-success' : 'text-primary'
          }`}>
            {course.price === 0 ? 'Gratis' : `${course.price}€`}
          </span>
        </div>
        <h2 className="text-xl font-heading font-extrabold mb-3 text-heading leading-tight group-hover:text-primary transition-colors">
          {course.title}
        </h2>
        <p className="text-muted text-sm leading-relaxed mb-6 flex-grow line-clamp-2">
          {course.description}
        </p>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <Users className="w-4 h-4" />
            {course.enrolled_count ?? 0} alumnos
          </span>
          <Link
            to={`/courses/${course.slug}`}
            className="btn-clean !py-2 !px-4 !text-xs"
          >
            Ver curso
          </Link>
        </div>
      </div>
    </article>
  )
}
