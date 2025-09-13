from django.urls import path
from .views import HospitalRegisterView, HospitalLoginView, HospitalDetailView, HospitalPostsView, HospitalSearchView

urlpatterns = [
    path('register/', HospitalRegisterView.as_view(), name='hospital_register'),
    path('login/', HospitalLoginView.as_view(), name='hospital_login'),
    path('<int:hospital_id>/', HospitalDetailView.as_view(), name='hospital-detail'),
    path('<int:hospital_id>/posts/', HospitalPostsView.as_view(), name='hospital-posts'),
    path('search/', HospitalSearchView.as_view(), name='hospital_search')



]


