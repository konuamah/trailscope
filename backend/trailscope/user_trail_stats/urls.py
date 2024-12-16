# stats/urls.py
from django.urls import path
from .views import UserTrailStatListCreateView

urlpatterns = [
    path('user-trail-stats/', UserTrailStatListCreateView.as_view(), name='user_trail_stats'),
]
