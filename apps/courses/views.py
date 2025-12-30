from django.views.generic import ListView, DetailView, View
from django.contrib.auth.mixins import LoginRequiredMixin
from django.shortcuts import get_object_or_404, redirect, render
from django.contrib import messages
from .models import Course, Lesson, UserCourseAccess, UserLessonProgress

class CourseListView(ListView):
    model = Course
    template_name = 'courses/course_list.html'
    context_object_name = 'courses'

    def get_queryset(self):
        return Course.objects.filter(is_published=True)

class CourseDetailView(DetailView):
    model = Course
    template_name = 'courses/course_detail.html'
    context_object_name = 'course'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        if self.request.user.is_authenticated:
            context['is_enrolled'] = UserCourseAccess.objects.filter(
                user=self.request.user, 
                course=self.object
            ).exists()
        else:
            context['is_enrolled'] = False
        return context

class EnrollCourseView(LoginRequiredMixin, View):
    def post(self, request, slug):
        course = get_object_or_404(Course, slug=slug)
        # Simple Logic: If price is 0 or we just allow anyone to enroll for now
        # Ideally check payment if price > 0
        
        obj, created = UserCourseAccess.objects.get_or_create(user=request.user, course=course)
        
        if created:
            messages.success(request, f"You have enrolled in {course.title}")
        else:
            messages.info(request, f"You are already enrolled in {course.title}")
            
        return redirect('courses:course_detail', slug=course.slug)

class LessonDetailView(LoginRequiredMixin, DetailView):
    model = Lesson
    template_name = 'courses/lesson_detail.html'
    context_object_name = 'lesson'
    slug_url_kwarg = 'slug'

    def dispatch(self, request, *args, **kwargs):
        if not request.user.is_authenticated:
            return super().dispatch(request, *args, **kwargs)
            
        lesson = self.get_object()
        course = lesson.module.course
        
        # Check enrollment
        is_enrolled = UserCourseAccess.objects.filter(user=request.user, course=course).exists()
        
        if not is_enrolled and not lesson.is_free_preview:
            messages.error(request, "You must enroll in this course to view this lesson.")
            return redirect('courses:course_detail', slug=course.slug)
            
        # We don't mark progress automatically anymore, we'll use the button.
        
        return super().dispatch(request, *args, **kwargs)

    def get_object(self, queryset=None):
        # We need to fetch lesson by course slug and lesson slug to be safe/clean URLs?
        # Or just lesson slug if unique?
        # Lesson has unique_together = ['module', 'slug'], but modules belong to courses.
        # It's better to rely on URL structure courses/<course_slug>/lessons/<lesson_slug>/
        
        course_slug = self.kwargs.get('course_slug')
        lesson_slug = self.kwargs.get('lesson_slug')
        
        return get_object_or_404(Lesson, module__course__slug=course_slug, slug=lesson_slug)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        lesson = self.object
        course = lesson.module.course
        user = self.request.user
        
        # Get all lessons of the course ordered by module then lesson order
        all_lessons = list(Lesson.objects.filter(module__course=course).order_by('module__order', 'order'))
        total_lessons = len(all_lessons)
        
        # Get completed lessons for this user in this course
        completed_lessons_ids = UserLessonProgress.objects.filter(
            user=user, 
            lesson__module__course=course
        ).values_list('lesson_id', flat=True)
        
        completed_count = len(completed_lessons_ids)
        
        # Calculate progress
        progress_percent = int((completed_count / total_lessons) * 100) if total_lessons > 0 else 0
        
        try:
            current_index = all_lessons.index(lesson)
            context['prev_lesson'] = all_lessons[current_index - 1] if current_index > 0 else None
            context['next_lesson'] = all_lessons[current_index + 1] if current_index < len(all_lessons) - 1 else None
        except ValueError:
            context['prev_lesson'] = None
            context['next_lesson'] = None
            
        context['progress_percent'] = progress_percent
        context['completed_lessons_ids'] = completed_lessons_ids
        context['is_completed'] = lesson.id in completed_lessons_ids
        
        return context

class ToggleLessonCompleteView(LoginRequiredMixin, View):
    def post(self, request, course_slug, lesson_slug):
        lesson = get_object_or_404(Lesson, module__course__slug=course_slug, slug=lesson_slug)
        
        # Enrollment check
        is_enrolled = UserCourseAccess.objects.filter(user=request.user, course=lesson.module.course).exists()
        if not is_enrolled and not lesson.is_free_preview:
            return redirect('courses:course_detail', slug=lesson.module.course.slug)

        progress, created = UserLessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
        
        if not created:
            # If it already existed, we "uncomplete" it (toggle behavior)
            progress.delete()
            messages.info(request, f"Lección '{lesson.title}' marcada como no completada.")
        else:
            messages.success(request, f"¡Lección '{lesson.title}' completada!")
            
        return redirect('courses:lesson_detail', course_slug=course_slug, lesson_slug=lesson_slug)
