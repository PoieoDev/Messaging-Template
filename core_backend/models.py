from django.contrib.auth.models import User
from django.db import models
import uuid

# A sample for extending the user model
class ExtendedUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="extUser")
    date_joined=models.DateTimeField(auto_now_add=True)
    updated_on=models.DateTimeField(auto_now=True)
    user_type=models.CharField(max_length=256, blank="False")

class Rooms(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    member_0 = models.ForeignKey(User, on_delete=models.PROTECT, related_name="member_0")
    member_1 = models.ForeignKey(User, on_delete=models.PROTECT, related_name="member_1", blank=True, default="", null=True)
    member_2 = models.ForeignKey(User, on_delete=models.PROTECT, related_name="member_2", blank=True, default="", null=True)
    member_3 = models.ForeignKey(User, on_delete=models.PROTECT, related_name="member_3", blank=True, default="", null=True)
    member_4 = models.ForeignKey(User, on_delete=models.PROTECT, related_name="member_4", blank=True, default="", null=True)
    member_5 = models.ForeignKey(User, on_delete=models.PROTECT, related_name="member_5", blank=True, default="", null=True)
    member_6 = models.ForeignKey(User, on_delete=models.PROTECT, related_name="member_6", blank=True, default="", null=True)


class Messages(models.Model):
    room_id = models.ForeignKey(Rooms, on_delete=models.PROTECT, related_name="room_id")
    author = models.ForeignKey(User, on_delete=models.PROTECT, related_name="author_id", blank="False")
    message = models.TextField(blank="False")
    created_at = models.DateTimeField(auto_now=True)
