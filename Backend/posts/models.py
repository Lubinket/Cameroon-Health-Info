



from django.db import models
from hospitals.models import Hospital
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField






class Post(models.Model):
    CATEGORY_CHOICES = [
        ('screenings', 'Screenings'),
        ('vaccinations', 'Vaccinations'),
        ('donations', 'Donations'),
        ('events', 'Events'),
    ]
    title = models.CharField(max_length=255)
    image = CloudinaryField('images', null=True, blank=True)  #models.Imagefield
    date = models.DateField()
    details = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title



class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"




























'''from django.db import models
from hospitals.models import Hospital
from django.contrib.auth.models import User
from cloudinary.models import CloudinaryField






class Post(models.Model):
    CATEGORY_CHOICES = [
        ('screenings', 'Screenings'),
        ('vaccinations', 'Vaccinations'),
        ('donations', 'Donations'),
        ('events', 'Events'),
    ]
    title = models.CharField(max_length=255)
    image = CloudinaryField(upload_to='posts/images/', null=True, blank=True)  #models.Imagefield
    date = models.DateField()
    details = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    hospital = models.ForeignKey(Hospital, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title



class Comment(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='comments')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comment by {self.user.username} on {self.post.title}"'''