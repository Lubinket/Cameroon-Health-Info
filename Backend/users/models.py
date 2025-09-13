from django.db import models
from django.contrib.auth.models import User  # Built-in User for auth

# Extend User if needed
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Add extra fields later
