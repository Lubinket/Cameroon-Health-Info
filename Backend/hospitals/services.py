from django.contrib.auth.models import User, Group
from .models import Hospital
from django.contrib.auth import authenticate

def create_hospital_admin(username, email, password, hospital_name, location):
    user = User.objects.create_user(username=username, email=email, password=password)
    admin_group, _ = Group.objects.get_or_create(name='HospitalAdmin')
    user.groups.add(admin_group)
    hospital = Hospital.objects.create(name=hospital_name, admin_user=user, location=location)
    return hospital

def login_hospital_admin(request, username, password):
    # Reuse user login service, but check if they're admin
    from users.services import login_user
    token = login_user(request, username, password)
    user = request.user
    if not user.groups.filter(name='HospitalAdmin').exists():
        raise ValueError("Not a hospital admin")
    return token









