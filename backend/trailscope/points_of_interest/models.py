# points_of_interest/models.py
from django.db import models
import uuid
from django.contrib.auth import get_user_model
from django.contrib.gis.db import models as geomodels

class PointsOfInterest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trail = models.ForeignKey('trails.Trail', on_delete=models.CASCADE, related_name='points_of_interest')
    name = models.CharField(max_length=255)
    type = models.CharField(max_length=100)
    location = geomodels.PointField(srid=4326, spatial_index=True)
    description = models.TextField(blank=True, null=True)
    metadata = models.JSONField(blank=True, null=True)
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='points_of_interest')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name
