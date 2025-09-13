from rest_framework import serializers
from .models import Follow

class FollowSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Follow
        fields = ['id', 'user', 'hospital', 'hospital_name', 'username', 'created_at']
        read_only_fields = ['id', 'hospital_name', 'username', 'created_at']