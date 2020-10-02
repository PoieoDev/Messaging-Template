from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User
from django.contrib import admin
from .models import ExtendedUser, Messages, Rooms

# This class allows us to place our extended user inlines
# with the user data in the dango admin system
class ExtUserInline(admin.StackedInline):
    model = ExtendedUser
    can_delete = True
    verbose_name_plural = 'ExtendedUsers'

class UserAdmin(BaseUserAdmin):
    inlines = (ExtUserInline,)

class MessagesAdmin(admin.ModelAdmin):
    model = Messages
    can_delete = True
    verbose_name_plural = 'Messages'

class RoomsAdmin(admin.ModelAdmin):
    model = Rooms
    can_delete = True
    verbose_name_plural = 'Rooms'

admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Messages, MessagesAdmin)
admin.site.register(Rooms, RoomsAdmin)
