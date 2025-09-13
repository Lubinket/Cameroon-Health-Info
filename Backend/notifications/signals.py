from django.db.models.signals import post_save
from django.contrib.auth.signals import user_logged_in
from django.dispatch import receiver
from django.contrib.auth.models import User
from notifications.models import NotificationSettings
from posts.models import Post
from follows.models import Follow
from notifications.models import InAppNotification


@receiver(post_save, sender=User)
def create_notification_settings(sender, instance, created, **kwargs):
    if created:
        NotificationSettings.objects.create(
            user=instance,
            email_notifications=True,
            in_app_notifications=True,
            push_notifications=False
        )

@receiver(user_logged_in, sender=User)
def ensure_notification_settings(sender, user, request, **kwargs):
    NotificationSettings.objects.get_or_create(
        user=user,
        defaults={
            'email_notifications': True,
            'in_app_notifications': True,
            'push_notifications': False
        }
    )

@receiver(post_save, sender=Post)
def notify_followers_on_new_post(sender, instance, created, **kwargs):
    if created:
        followers = Follow.objects.filter(hospital=instance.hospital)
        for follow in followers:
            try:
                if follow.user.notification_settings.in_app_notifications:
                    InAppNotification.create_notification(
                        user=follow.user,
                        title=f"New update from {instance.hospital.name}",
                        message=f"{instance.hospital.name} posted: {instance.title}",
                        post=instance,
                        notification_type="new_post"
                    )
            except NotificationSettings.DoesNotExist:
                continue