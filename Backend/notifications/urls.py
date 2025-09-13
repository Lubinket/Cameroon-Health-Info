

# notifications/urls.py
'''from django.urls import path
from .views import SubscribeToPostView, InAppNotificationListView, InAppNotificationMarkReadView

urlpatterns = [
    path('posts/<int:post_id>/subscribe/', SubscribeToPostView.as_view(), name='subscribe-to-post'),
    path('notifications/', InAppNotificationListView.as_view(), name='notification-list'),
    path('notifications/<int:notification_id>/read/', InAppNotificationMarkReadView.as_view(), name='notification-mark-read'),
]'''



from django.urls import path
from .views import SubscribeToPostView, InAppNotificationListView, InAppNotificationMarkReadView, MarkAllNotificationsReadView

urlpatterns = [
    path('', InAppNotificationListView.as_view(), name='notification-list'),  # Maps to /api/notifications/
    path('posts/<int:post_id>/subscribe/', SubscribeToPostView.as_view(), name='subscribe-to-post'),
    path('notifications/<int:notification_id>/read/', InAppNotificationMarkReadView.as_view(), name='notification-mark-read'),
    path('mark-all-read/', MarkAllNotificationsReadView.as_view(), name='mark-all-read'),
]
