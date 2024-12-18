from django.db import models
import uuid
from django.contrib.auth import get_user_model
from django.contrib.gis.db import models as geomodels  # Correct import for GeoDjango fields

class Trail(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField()
    geometry = geomodels.GeometryField(srid=4326, spatial_index=True)  # For storing LINESTRING geometry
    elevation_profile = models.JSONField(blank=True, null=True)  # Stores the elevation profile
    difficulty_rating = models.SmallIntegerField(db_index=True)
    length_meters = models.FloatField(db_index=True)
    created_by = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, null=True, related_name='trails')
    created_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=50)
    metadata = models.JSONField(blank=True, null=True)  # For additional metadata
    image = models.ImageField(upload_to='trails_pics/', null=True, blank=True)  # New picture field

    def __str__(self):
        return self.name

    @property
    def username(self):
        # Access the username string from the related User model
        return self.created_by.username if self.created_by else None
