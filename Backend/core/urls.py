"""

URL configuration for core project.


The `urlpatterns` list routes URLs to views. For more information please see:

    https://docs.djangoproject.com/en/5.2/topics/http/urls/

Examples:

Function views

    1. Add an import:  from my_app import views

    2. Add a URL to urlpatterns:  path('', views.home, name='home')

Class-based views

    1. Add an import:  from other_app.views import Home

    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')

Including another URLconf

    1. Import the include() function: from django.urls import include, path

    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))

"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse
from hospitals.models import Hospital
from django.contrib.auth.models import User


def collect_static(request):
    try:
        from django.core.management import execute_from_command_line
        execute_from_command_line(['manage.py', 'collectstatic', '--noinput'])
        return JsonResponse({'message': 'Static files collected!'})
    except Exception as e:
        return JsonResponse({'error': str(e)})

# Add to urlpatterns:
path('collect-static/', collect_static, name='collect_static'),










def run_migrations(request):
    try:
        from django.core.management import execute_from_command_line
        import sys
        
        # Run migrations
        execute_from_command_line(['manage.py', 'migrate'])
        
        return JsonResponse({'message': 'Migrations completed successfully!'})
    except Exception as e:
        return JsonResponse({'error': str(e)})



def api_home(request):
    return JsonResponse({
        'message': 'Hospital Backend API is running successfully!',
        'status': 'online',
        'available_endpoints': [
            '/admin/',
            '/api/users/',
            '/api/hospitals/',
            '/api/posts/',
            '/api/follows/',
            '/api/notifications/',
        ]
    })









urlpatterns = [
    path('run-migrations/', run_migrations, name='run_migrations'),
    path('', api_home, name='api_home'),
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/hospitals/', include('hospitals.urls')),
    path('api/posts/', include('posts.urls')),
    path('api/follows/', include('follows.urls')),
    path('api/notifications/', include('notifications.urls')),
    
        # Add this

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)




