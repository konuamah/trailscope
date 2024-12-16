from rest_framework import serializers
from .models import PointsOfInterest

class PointsOfInterestSerializer(serializers.ModelSerializer):
    class Meta:
        model = PointsOfInterest
        fields = '__all__'
        read_only_fields = ['id']
