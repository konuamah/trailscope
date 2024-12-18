from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.contrib.gis.geos import Point
from django.contrib.gis.db.models.functions import Distance
from django.contrib.gis.measure import D
from .models import Trail
from .serializers import TrailSerializer


class TrailListCreateAPIView(APIView):
    """
    List all trails or create a new trail with dynamic filters.
    """

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAuthenticated()]  # Only authenticated users can POST
        return []  # No permissions required for GET

    def get(self, request):
        # Get query parameters for dynamic filtering
        status_filter = request.query_params.get('status')  # e.g., "open", "closed"
        difficulty = request.query_params.get('difficulty')  # e.g., "easy", "hard"
        created_by = request.query_params.get('created_by')  # Filter by user ID
        limit = request.query_params.get('limit')  # Number of results to retrieve
        order_by = request.query_params.get('order_by', 'id')  # Default order by 'id'

        # Start with all trails
        trails = Trail.objects.all()

        # Apply filters dynamically
        if status_filter:
            trails = trails.filter(status=status_filter)
        if difficulty:
            trails = trails.filter(difficulty_rating=difficulty)
        if created_by:
            trails = trails.filter(created_by__id=created_by)

        # Ordering
        if order_by:
            trails = trails.order_by(order_by)

        # Limit results
        if limit:
            try:
                limit = int(limit)
                trails = trails[:limit]
            except ValueError:
                return Response(
                    {"error": "Invalid 'limit' parameter. Must be a number."},
                    status=status.HTTP_400_BAD_REQUEST
                )

        # Serialize and return results
        serializer = TrailSerializer(trails, many=True)
        return Response(serializer.data)

    def post(self, request):
        # Serialize and validate incoming trail data
        serializer = TrailSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(created_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class NearbyTrailsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # Get coordinates and radius from query parameters
        try:
            latitude = float(request.query_params.get('lat'))
            longitude = float(request.query_params.get('lng'))
            radius = float(request.query_params.get('radius', 5000))  # Default 5km radius
        except (TypeError, ValueError):
            return Response(
                {"error": "Invalid coordinates or radius. Please provide lat, lng and optionally radius in meters."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create a point from the coordinates
        user_location = Point(longitude, latitude, srid=4326)

        # Query trails within radius, ordered by distance
        nearby_trails = Trail.objects.annotate(
            distance=Distance('geometry', user_location)
        ).filter(
            geometry__distance_lte=(user_location, D(m=radius))
        ).order_by('distance')

        # Additional filters
        status_filter = request.query_params.get('status')
        difficulty = request.query_params.get('difficulty')
        if status_filter:
            nearby_trails = nearby_trails.filter(status=status_filter)
        if difficulty:
            nearby_trails = nearby_trails.filter(difficulty_rating=difficulty)

        serializer = TrailSerializer(nearby_trails, many=True)
        return Response(serializer.data)

class TrailDetailAPIView(APIView):
    

    def get_object(self, pk):
        return get_object_or_404(Trail, pk=pk)

    def get(self, request, pk):
        trail = self.get_object(pk)
        serializer = TrailSerializer(trail)
        return Response(serializer.data)

    def put(self, request, pk):
        trail = self.get_object(pk)
        if trail.created_by != request.user:
            return Response({"error": "Not authorized to update this trail"},
                          status=status.HTTP_403_FORBIDDEN)
            
        serializer = TrailSerializer(trail, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request, pk):
        trail = self.get_object(pk)
        if trail.created_by != request.user:
            return Response({"error": "Not authorized to update this trail"},
                          status=status.HTTP_403_FORBIDDEN)
            
        serializer = TrailSerializer(trail, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        trail = self.get_object(pk)
        if trail.created_by != request.user:
            return Response({"error": "Not authorized to delete this trail"},
                          status=status.HTTP_403_FORBIDDEN)
            
        trail.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
