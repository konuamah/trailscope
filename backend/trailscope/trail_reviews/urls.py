# reviews/urls.py
from django.urls import path
from .views import TrailReviewCreateListView

urlpatterns = [
    path('trail-reviews/', TrailReviewCreateListView.as_view(), name='trail-review-list-create'),
]
