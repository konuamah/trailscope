# reviews/views.py
from rest_framework import generics, permissions
from .models import TrailReview
from .serializers import TrailReviewSerializer

class TrailReviewCreateListView(generics.ListCreateAPIView):
    queryset = TrailReview.objects.all()
    serializer_class = TrailReviewSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
