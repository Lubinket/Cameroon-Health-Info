from django.urls import path
from .views import PostCreateView
from .views import PostListView
from .views import PostDetailView
from .views import CommentCreateView

urlpatterns = [
    path('create/', PostCreateView.as_view(), name='post_create'),
    path('list/', PostListView.as_view(), name='post_list'),
    path('<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('<int:pk>/comments/', CommentCreateView.as_view(), name='comment_create'),
]