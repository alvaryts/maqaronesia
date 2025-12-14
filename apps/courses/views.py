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
        lesson = self.get_object()
        course = lesson.module.course
        
        # Check enrollment
        is_enrolled = UserCourseAccess.objects.filter(user=request.user, course=course).exists()
        
        if not is_enrolled and not lesson.is_free_preview:
            messages.error(request, "You must enroll in this course to view this lesson.")
            return redirect('courses:course_detail', slug=course.slug)
            
        # Mark progress logic could go here or in a separate API/POST
        UserLessonProgress.objects.get_or_create(user=request.user, lesson=lesson)
        
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
        course = self.object.module.course
        # Get next/prev lesson logic could be added here
        return context
