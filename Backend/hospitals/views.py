

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Hospital
from .services import create_hospital_admin, login_hospital_admin
from .serializers import HospitalRegisterSerializer
from users.serializers import LoginSerializer  # Reuse
from rest_framework.permissions import AllowAny
from .serializers import HospitalSerializer
from django.db.models import Count
from posts.models import Post  
from posts.serializers import PostSerializer
from django.db.models import Q
from django.shortcuts import render


class HospitalRegisterView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        serializer = HospitalRegisterSerializer(data=request.data)
        if serializer.is_valid():
            try:
                hospital = create_hospital_admin(
                    serializer.validated_data['username'],
                    serializer.validated_data['email'],
                    serializer.validated_data['password'],
                    serializer.validated_data['hospital_name'],
                    serializer.validated_data['location']
                )
                return Response({"message": "Hospital admin created"}, status=status.HTTP_201_CREATED)
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class HospitalLoginView(APIView):
    permission_classes = [AllowAny] 
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            try:
                token, user = login_hospital_admin(
                    request,
                    serializer.validated_data['email'],  # Use email, not username
                    serializer.validated_data['password']
                )
                return Response({
                    "token": token,
                    "id": user.id,
                    "username": user.username,
                    "email": user.email,
                    "is_admin": True
                })
            except ValueError as e:
                return Response({"error": str(e)}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
import logging
logger = logging.getLogger(__name__)



class HospitalSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.GET.get('q', '')
        results = Hospital.objects.all()

        if query:
            results = results.filter(
                Q(name__icontains=query) |
                Q(location__icontains=query)
            )

        serializer = HospitalSerializer(results, many=True)
        return Response({
            'query': query,
            'results': serializer.data
        }, status=status.HTTP_200_OK)



class HospitalDetailView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, hospital_id):
        try:
            hospital = Hospital.objects.annotate(
                post_count=Count('posts')  # might be the issue
            ).get(id=hospital_id)
            serializer = HospitalSerializer(hospital)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Hospital.DoesNotExist:
            return Response({"error": "Hospital not found"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            import traceback
            traceback.print_exc()  # ✅ will print full error to console
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        


class HospitalPostsView(APIView):
    permission_classes = [AllowAny]
    def get(self, request, hospital_id):
        try:
            # Fetch posts for the given hospital_id
            posts = Post.objects.filter(hospital=hospital_id)
            serializer = PostSerializer(posts, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {'error': f'Failed to fetch posts: {str(e)}'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
