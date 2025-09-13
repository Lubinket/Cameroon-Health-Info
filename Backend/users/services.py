from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User


def register_user(username, email, password):
    return User.objects.create_user(username=username, email=email, password=password)


def logout_user(request):
    logout(request)


def login_user(request, email, password):
    try:
        fetched_user = User.objects.get(email=email)
        user = authenticate(request, username=fetched_user.username, password=password)
        if user:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return token.key, user
        raise ValueError("Invalid credentials")
    except User.DoesNotExist:
        raise ValueError("Invalid credentials")










































'''from django.contrib.auth import authenticate, login, logout
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

def register_user(username, email, password):
    if User.objects.filter(username=username).exists():
        raise ValueError("Username already exists")
    user = User.objects.create_user(username=username, email=email, password=password)
    return user



def logout_user(request):
    logout(request)


def login_user(request, email, password):
    try:
        # Fetch user by email
        fetched_user = User.objects.get(email=email)
        # Authenticate using the fetched user's username
        user = authenticate(request, username=fetched_user.username, password=password)
        if user:
            login(request, user)
            token, _ = Token.objects.get_or_create(user=user)
            return token.key, user  # Return token and user
        raise ValueError("Invalid credentials")
    except User.DoesNotExist:
        raise ValueError("Invalid credentials") '''