from django.urls import path
from .views import CourseListView, CourseDetailView, EnrollCourseView, LessonDetailView, ToggleLessonCompleteView

app_name = 'courses'

urlpatterns = [
    path('', CourseListView.as_view(), name='course_list'),
    path('<slug:slug>/', CourseDetailView.as_view(), name='course_detail'),
    path('<slug:slug>/enroll/', EnrollCourseView.as_view(), name='enroll_course'),
    path('<slug:course_slug>/lessons/<slug:lesson_slug>/', LessonDetailView.as_view(), name='lesson_detail'),
    path('<slug:course_slug>/lessons/<slug:lesson_slug>/complete/', ToggleLessonCompleteView.as_view(), name='toggle_complete'),
]
