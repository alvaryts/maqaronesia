from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User

class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Perfil', {'fields': ('bio',)}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Perfil', {'fields': ('bio',)}),
    )

admin.site.register(User, UserAdmin)
