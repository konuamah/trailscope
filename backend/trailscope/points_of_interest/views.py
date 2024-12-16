from rest_framework import generics
from .models import PointsOfInterest
from .serializers import PointsOfInterestSerializer

# List/Create API View
class PointsOfInterestListCreateView(generics.ListCreateAPIView):
    queryset = PointsOfInterest.objects.all()
    serializer_class = PointsOfInterestSerializer


# Retrieve/Update/Delete API View
class PointsOfInterestDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = PointsOfInterest.objects.all()
    serializer_class = PointsOfInterestSerializer
