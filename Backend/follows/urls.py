from django.urls import path
from .views import FollowHospitalView

urlpatterns = [
    path('hospitals/<int:hospital_id>/follow/', FollowHospitalView.as_view(), name='follow-hospital'),
    
]