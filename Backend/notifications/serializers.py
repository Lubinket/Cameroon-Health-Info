# notifications/serializers.py
from rest_framework import serializers
from .models import NotificationSubscription, InAppNotification
from posts.serializers import PostSerializer

class NotificationSubscriptionSerializer(serializers.ModelSerializer):
    post_title = serializers.CharField(source='post.title', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = NotificationSubscription
        fields = ['id', 'user', 'post', 'post_title', 'username', 'created_at']
        read_only_fields = ['id', 'post_title', 'username', 'created_at']

class InAppNotificationSerializer(serializers.ModelSerializer):
    post_id = serializers.IntegerField(source='post.id', read_only=True)
    hospital_name = serializers.CharField(source='post.hospital.name', read_only=True, allow_null=True)

    class Meta:
        model = InAppNotification
        fields = ['id', 'title', 'message', 'post_id', 'hospital_name', 'notification_type', 'is_read', 'created_at']
        read_only_fields = ['id', 'post_id', 'hospital_name', 'notification_type', 'created_at']
























