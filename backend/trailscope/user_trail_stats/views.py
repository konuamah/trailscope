# stats/views.py
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import UserTrailStat
from .serializers import UserTrailStatSerializer

class UserTrailStatListCreateView(APIView):
    def get(self, request):
        stats = UserTrailStat.objects.all()
        serializer = UserTrailStatSerializer(stats, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = UserTrailStatSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
