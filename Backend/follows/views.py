from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .models import Follow
from .serializers import FollowSerializer
from hospitals.models import Hospital

class FollowHospitalView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, hospital_id):
        try:
            hospital = Hospital.objects.get(id=hospital_id)
        except Hospital.DoesNotExist:
            return Response({"error": "Hospital not found"}, status=status.HTTP_404_NOT_FOUND)

        follow, created = Follow.objects.get_or_create(user=request.user, hospital=hospital)
        if not created:
            follow.delete()
            return Response({"message": "Unfollowed hospital"}, status=status.HTTP_200_OK)
        return Response(FollowSerializer(follow).data, status=status.HTTP_201_CREATED)

    def get(self, request, hospital_id):
        try:
            hospital = Hospital.objects.get(id=hospital_id)
            follow = Follow.objects.filter(user=request.user, hospital=hospital).first()
            return Response(FollowSerializer(follow).data if follow else {}, status=status.HTTP_200_OK)
        except Hospital.DoesNotExist:
            return Response({"error": "Hospital not found"}, status=status.HTTP_404_NOT_FOUND)