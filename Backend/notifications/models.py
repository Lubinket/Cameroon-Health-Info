from django.db import models
from django.contrib.auth.models import User

class NotificationSubscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='subscriptions')
    post = models.ForeignKey('posts.Post', on_delete=models.CASCADE, related_name='subscribers')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')

    def __str__(self):
        return f"{self.user.username} subscribed to post {self.post.id}"

class InAppNotification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    title = models.CharField(max_length=200)
    message = models.TextField()
    post = models.ForeignKey('posts.Post', on_delete=models.CASCADE, null=True, blank=True)
    notification_type = models.CharField(max_length=50, default='post_reminder')
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        unique_together = ('user', 'post', 'notification_type', 'created_at')

    def __str__(self):
        return f"Notification for {self.user.username}: {self.title}"

    @classmethod
    def create_notification(cls, user, title, message, post=None, notification_type='post_reminder'):
        from datetime import date
        today = date.today()
        if not cls.objects.filter(
            user=user,
            post=post,
            notification_type=notification_type,
            created_at__date=today
        ).exists():
            instance = cls.objects.create(
                user=user,
                title=title,
                message=message,
                post=post,
                notification_type=notification_type
            )
            # Send real-time via Channels
            from channels.layers import get_channel_layer
            from asgiref.sync import async_to_sync
            from .serializers import InAppNotificationSerializer
            channel_layer = get_channel_layer()
            if channel_layer:
                serialized = InAppNotificationSerializer(instance).data
                async_to_sync(channel_layer.group_send)(
                    f'notifications_{user.id}',
                    {
                        'type': 'notification_message',  # Changed from 'notification.message'
                        'notification': serialized
                    }
                )
            return instance

class NotificationSettings(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification_settings')
    email_notifications = models.BooleanField(default=True)
    in_app_notifications = models.BooleanField(default=True)
    push_notifications = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Notification settings for {self.user.username}"
