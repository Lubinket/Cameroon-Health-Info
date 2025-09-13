from django.db import models
from django.contrib.auth.models import User
from hospitals.models import Hospital

class Follow(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='follows')
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'hospital')

    def __str__(self):
        return f"{self.user.username} follows {self.hospital.name}"