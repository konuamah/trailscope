from django.urls import path
from .views import TrailListCreateAPIView, TrailDetailAPIView, NearbyTrailsAPIView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('trails/', TrailListCreateAPIView.as_view(), name='trail-list-create'),
    path('trails/<uuid:pk>/', TrailDetailAPIView.as_view(), name='trail-detail'),
    path('trails/nearby/', NearbyTrailsAPIView.as_view(), name='nearby-trails'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
