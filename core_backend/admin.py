from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.contrib import admin
from .models import ExtendedUser

# This class allows us to place our extended user inlines
# with the user data in the dango admin system
class ExtUserInline(admin.StackedInline):
    model = ExtendedUser
    can_delete = True
    verbose_name_plural = 'ExtendedUsers'

class UserAdmin(BaseUserAdmin):
    inlines = (ExtUserInline,)

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
