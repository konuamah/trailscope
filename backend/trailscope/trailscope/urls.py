
from django.contrib import admin
from django.urls import path
from django.urls import include
urlpatterns = [
    path('admin/', admin.site.urls),
    path('users/', include('users.urls')),
    path('trails/', include('trails.urls')),
    path('points-of-interest/', include('points_of_interest.urls')),
    path('trail-reviews/',include('trail_reviews.urls')),
    path('stats/', include('user_trail_stats.urls')),
]
