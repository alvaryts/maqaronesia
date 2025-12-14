from django.contrib import admin
from .models import Course, Module, Lesson, UserCourseAccess, UserLessonProgress

class LessonInline(admin.StackedInline):
    model = Lesson
    extra = 1
    prepopulated_fields = {'slug': ('title',)}

class ModuleInline(admin.StackedInline):
    model = Module
    extra = 1

@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('title', 'instructor', 'price', 'is_published', 'created_at')
    list_filter = ('is_published', 'created_at')
    search_fields = ('title', 'description')
    prepopulated_fields = {'slug': ('title',)}
    inlines = [ModuleInline]

@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    list_display = ('title', 'course', 'order')
    list_filter = ('course',)
    inlines = [LessonInline]

@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'module', 'order', 'is_free_preview')
    list_filter = ('module__course', 'module')
    prepopulated_fields = {'slug': ('title',)}

admin.site.register(UserCourseAccess)
admin.site.register(UserLessonProgress)
