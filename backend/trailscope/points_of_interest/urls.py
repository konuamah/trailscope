from django.urls import path
from .views import PointsOfInterestListCreateView, PointsOfInterestDetailView

urlpatterns = [
    path('points-of-interest/', PointsOfInterestListCreateView.as_view(), name='points_of_interest_list'),
    path('points-of-interest/<uuid:pk>/', PointsOfInterestDetailView.as_view(), name='points_of_interest_detail'),
]
