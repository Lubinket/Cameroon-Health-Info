from rest_framework import serializers
from .models import Hospital


class HospitalRegisterSerializer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    hospital_name = serializers.CharField()
    location = serializers.CharField()


class HospitalSerializer(serializers.ModelSerializer):
    post_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Hospital
        fields = ['id', 'name', 'location', 'post_count', ]






