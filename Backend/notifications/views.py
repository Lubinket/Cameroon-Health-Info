# notifications/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from .models import NotificationSubscription, InAppNotification, NotificationSettings
from .serializers import NotificationSubscriptionSerializer, InAppNotificationSerializer
from posts.models import Post
from datetime import date, timedelta
from channels.layers import get_channel_layer  # Add this import
from asgiref.sync import async_to_sync


# Helper function to send reminders for a user
def send_post_reminders(user):
    today = date.today()
    target_dates = [today + timedelta(days=x) for x in range(0, 4)]  # Today, D+1, D+2, D+3

    subscriptions = NotificationSubscription.objects.filter(
        user=user,
        post__date__in=target_dates
    ).select_related('post', 'post__hospital')

    if not user.notification_settings.in_app_notifications:
        return

    for subscription in subscriptions:
        days_until_event = (subscription.post.date - today).days
        days_text = "today" if days_until_event == 0 else f"in {days_until_event} day{'s' if days_until_event > 1 else ''}"
        
        InAppNotification.create_notification(
            user=user,
            title=f"Reminder: {subscription.post.title}",
            message=f"{subscription.post.title} is {days_text} on {subscription.post.date}",
            post=subscription.post,
            notification_type="post_reminder"
        )

class SubscribeToPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        # Check if event date is in the past
        today = date.today()
        if post.date < today:
            return Response({"error": "Sorry, the event date has already passed"}, status=status.HTTP_400_BAD_REQUEST)

        subscription, created = NotificationSubscription.objects.get_or_create(user=request.user, post=post)
        if not created:
            subscription.delete()
            return Response({"message": "Unsubscribed from notifications"}, status=status.HTTP_200_OK)
        
        # Send reminders for this user
        send_post_reminders(request.user)
        return Response(NotificationSubscriptionSerializer(subscription).data, status=status.HTTP_201_CREATED)

    def get(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            subscription = NotificationSubscription.objects.filter(user=request.user, post=post).first()
            # Send reminders when checking subscription status
            send_post_reminders(request.user)
            return Response(NotificationSubscriptionSerializer(subscription).data if subscription else {}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

class InAppNotificationListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = InAppNotificationSerializer

    def get_queryset(self):
        # Send reminders when fetching notifications
        send_post_reminders(self.request.user)
        return InAppNotification.objects.filter(user=self.request.user).select_related('post__hospital').order_by('-created_at')
    
class InAppNotificationMarkReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, notification_id):
        try:
            notification = InAppNotification.objects.get(id=notification_id, user=request.user)
            notification.is_read = True
            notification.save()
            return Response({"message": "Notification marked as read"}, status=status.HTTP_200_OK)
        except InAppNotification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)
        


class MarkAllNotificationsReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        updated_count = InAppNotification.objects.filter(user=request.user, is_read=False).update(is_read=True)
        channel_layer = get_channel_layer()
        if channel_layer:
            notifications = InAppNotification.objects.filter(user=request.user)
            for notification in notifications:
                serialized = InAppNotificationSerializer(notification).data
                async_to_sync(channel_layer.group_send)(
                    f'notifications_{request.user.id}',
                    {'type': 'notification_message', 'notification': serialized}
                )
        return Response({"message": f"{updated_count} notifications marked as read"}, status=status.HTTP_200_OK)









































'''from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import NotificationSubscription
from .serializers import NotificationSubscriptionSerializer
from follows.models import Follow  # Updated import
from posts.models import Post

class SubscribeToPostView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        if not Follow.objects.filter(user=request.user, hospital=post.hospital).exists():
            return Response({"error": "You must follow the hospital first"}, status=status.HTTP_400_BAD_REQUEST)

        subscription, created = NotificationSubscription.objects.get_or_create(user=request.user, post=post)
        if not created:
            subscription.delete()
            return Response({"message": "Unsubscribed from notifications"}, status=status.HTTP_200_OK)
        return Response(NotificationSubscriptionSerializer(subscription).data, status=status.HTTP_201_CREATED)

    def get(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
            subscription = NotificationSubscription.objects.filter(user=request.user, post=post).first()
            return Response(NotificationSubscriptionSerializer(subscription).data if subscription else {}, status=status.HTTP_200_OK)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)'''