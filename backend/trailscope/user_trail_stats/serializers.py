# stats/serializers.py
from rest_framework import serializers
from .models import UserTrailStat

class UserTrailStatSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserTrailStat
        fields = '__all__'
