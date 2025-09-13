from rest_framework import serializers
from .models import Post, Comment
from hospitals.models import Hospital



'''class PostSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)  
    image = serializers.SerializerMethodField()  #
    def get_image(self, obj):            #
        if obj.image:
            return obj.image.url  # This should return the clean URL
        return None     #added    # Use CommentSerializer

    class Meta:
        model = Post
        fields = ['id', 'title', 'image', 'date', 'details', 'category', 'hospital', 'hospital_name', 'created_at', 'comments']
        read_only_fields = ['id', 'hospital', 'hospital_name', 'created_at', 'comments']'''




from rest_framework import serializers
from .models import Post, Comment
from hospitals.models import Hospital

class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    class Meta:
        model = Comment
        fields = ['id', 'text', 'username', 'created_at']
        read_only_fields = ['id', 'username', 'created_at']

class PostSerializer(serializers.ModelSerializer):
    hospital_name = serializers.CharField(source='hospital.name', read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    image = serializers.ImageField(required=False)  # ADD THIS LINE
    def get_image(self, obj):
        if obj.image:                    #added this function
            url = obj.image.url
            
            return url.replace('http://', 'https://')
        return None
    
    class Meta:
        model = Post
        fields = ['id', 'title', 'image', 'date', 'details', 'category', 'hospital', 'hospital_name', 'created_at', 'comments']
        read_only_fields = ['id', 'hospital', 'hospital_name', 'created_at', 'comments']