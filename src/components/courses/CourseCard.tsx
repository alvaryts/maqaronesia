import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import type { Course } from '../../types/database'

interface CourseCardProps {
  course: Course
}

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="bg-surface border border-border rounded-2xl overflow-hidden card-hover flex flex-col h-full group">
      <div className="aspect-video relative overflow-hidden bg-surface-alt">
        {course.image_url ? (
          <img
            src={course.image_url}
            alt={course.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl opacity-10">📚</span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1.5 rounded-full text-[0.6rem] font-bold uppercase tracking-widest ${
            course.price === 0
              ? 'bg-success/20 text-success'
              : 'bg-primary/20 text-primary'
          }`}>
            {course.price === 0 ? 'Gratis' : `${course.price}€`}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-xl font-heading font-extrabold mb-3 text-white leading-tight group-hover:text-primary transition-colors">
          {course.title}
        </h2>
        <p className="text-muted text-sm leading-relaxed mb-6 flex-grow line-clamp-2">
          {course.description}
        </p>

        <div className="pt-4 border-t border-border flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-[0.6rem] font-bold text-muted-foreground uppercase tracking-widest">
            <Users className="w-3.5 h-3.5" />
            {course.enrolled_count ?? 0} Alumnos
          </span>
          <Link
            to={`/courses/${course.slug}`}
            className="border border-border hover:border-primary hover:text-primary px-4 py-1.5 rounded-lg text-xs font-bold transition-all"
          >
            Ver curso
          </Link>
        </div>
      </div>
    </article>
  )
}
