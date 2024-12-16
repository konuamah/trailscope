# reviews/serializers.py
from rest_framework import serializers
from .models import TrailReview

class TrailReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrailReview
        fields = ['id', 'trail', 'user', 'rating', 'review_text', 'created_at']
        read_only_fields = ['id', 'created_at', 'user']
