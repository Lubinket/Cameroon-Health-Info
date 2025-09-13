from django.contrib.auth.models import User
from .models import Post
from hospitals.models import Hospital
from .models import Post, Comment

def create_post(user, title, image, date, details, category):
    if not user.groups.filter(name='HospitalAdmin').exists():
        raise ValueError("Only hospital admins can create posts")
    try:
        hospital = Hospital.objects.get(admin_user=user)
    except Hospital.DoesNotExist:
        raise ValueError("User is not associated with a hospital")
    post = Post.objects.create(
        title=title,
        image=image,
        date=date,
        details=details,
        category=category,
        hospital=hospital
    )
    return post



def create_comment(user, post_id, text):
    try:
        post = Post.objects.get(id=post_id)
    except Post.DoesNotExist:
        raise ValueError("Post not found")
    comment = Comment.objects.create(
        user=user,
        post=post,
        text=text
    )
    return comment