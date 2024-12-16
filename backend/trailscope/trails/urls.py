# urls.py
from django.urls import path
from .views import TrailListCreateAPIView, TrailDetailAPIView, NearbyTrailsAPIView

urlpatterns = [
    path('trails/', TrailListCreateAPIView.as_view(), name='trail-list-create'),
    path('trails/<uuid:pk>/', TrailDetailAPIView.as_view(), name='trail-detail'),
    path('trails/nearby/', NearbyTrailsAPIView.as_view(), name='nearby-trails'),
]