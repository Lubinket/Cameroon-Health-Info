from django.db import models
from django.contrib.auth.models import User

class Hospital(models.Model):
    name = models.CharField(max_length=255)
    admin_user = models.OneToOneField(User, on_delete=models.CASCADE)  # Link to User for auth
    location = models.CharField(max_length=255)  # For geolocation later
    # Add more fields like address for API integration


    @property
    def follower_count(self):
     return self.followers.count()

