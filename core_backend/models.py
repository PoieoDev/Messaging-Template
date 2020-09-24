from django.contrib.auth.models import User
from django.db import models

# A sample for extending the user model
class ExtendedUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="extUser")
    date_joined=models.DateTimeField(auto_now_add=True)
    updated_on=models.DateTimeField(auto_now=True)
    user_type=models.CharField(max_length=256, blank="False")
