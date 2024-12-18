from django.urls import path, include
from rest_framework.routers import DefaultRouter  
from .views import (
    UserListCreateView,
    UserDetailView,
    UserViewSet,
    RegisterView,
    LoginView,
    LogoutView
)

# Create router for ViewSet
router = DefaultRouter()
router.register('users-viewset', UserViewSet, basename='user-viewset')

urlpatterns = [
    # User management endpoints
    path('users/', UserListCreateView.as_view(), name='user-list-create'),
    # Use 'username' in the URL
    path('users/<str:username>/', UserDetailView.as_view(), name='user-detail'),
    
    # Authentication endpoints
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    
    # ViewSet URLs
    path('', include(router.urls)),
]
