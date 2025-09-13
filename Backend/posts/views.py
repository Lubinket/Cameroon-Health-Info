from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from .models import Post
from .services import create_post
from .serializers import PostSerializer

from .serializers import PostSerializer, CommentSerializer
from .services import create_post, create_comment

class PostCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = PostSerializer(data=request.data)
        if serializer.is_valid():
            try:
                post = create_post(
                    user=request.user,
                    title=serializer.validated_data['title'],
                    image=serializer.validated_data.get('image'),
                    date=serializer.validated_data['date'],
                    details=serializer.validated_data['details'],
                    category=serializer.validated_data['category']
                )
                return Response(PostSerializer(post).data, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_403_FORBIDDEN)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    


  
class PostListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        category = request.query_params.get('category')  # Optional filter
        posts = Post.objects.all().order_by('-created_at')  # Newest first
        if category:
            posts = posts.filter(category=category)
        serializer = PostSerializer(posts, many=True)
        return Response(serializer.data)
    

class PostDetailView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, pk):
        try:
            post = Post.objects.get(pk=pk)
            serializer = PostSerializer(post)
            return Response(serializer.data)
        except Post.DoesNotExist:
            return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

class CommentCreateView(APIView):
    permission_classes = [IsAuthenticated]
    authentication_classes = [TokenAuthentication]

    def post(self, request, pk):

        print(f"User authenticated: {request.user.is_authenticated}")
        print(f"User: {request.user}")
        print(f"Auth header: {request.META.get('HTTP_AUTHORIZATION', 'None')}")
        
        if not request.user.is_authenticated:
            return Response({"error": "Authentication required"}, status=status.HTTP_401_UNAUTHORIZED)




        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            try:
                comment = create_comment(
                    user=request.user,
                    post_id=pk,
                    text=serializer.validated_data['text']
                )
                return Response(CommentSerializer(comment).data, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)







