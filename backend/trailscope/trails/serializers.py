from rest_framework import serializers
from django.contrib.gis.geos import LineString
from .models import Trail

class TrailSerializer(serializers.ModelSerializer):
    geometry = serializers.JSONField()

    class Meta:
        model = Trail
        fields = ['id', 'name', 'description', 'geometry', 'elevation_profile',
                 'difficulty_rating', 'length_meters', 'created_by', 'created_at',
                 'status', 'metadata']
        read_only_fields = ['id', 'created_by', 'created_at']

    def validate_geometry(self, value):
        try:
            # Ensure the geometry is a valid GeoJSON LineString
            if value['type'] != 'LineString':
                raise serializers.ValidationError("Geometry must be a LineString")
            
            # Convert GeoJSON coordinates to GeoDjango LineString
            coords = [tuple(coord) for coord in value['coordinates']]
            return LineString(coords, srid=4326)
        except Exception as e:
            raise serializers.ValidationError(f"Invalid geometry format: {str(e)}")

    def create(self, validated_data):
        # Ensure the current user is set as the creator
        validated_data['created_by'] = self.context['request'].user
        return super().create(validated_data)