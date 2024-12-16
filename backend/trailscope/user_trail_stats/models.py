# stats/models.py
from django.db import models
from django.contrib.auth import get_user_model
from django.contrib.gis.db import models as geomodels
import uuid

class UserTrailStat(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='trail_stats')
    trail = models.ForeignKey('trails.Trail', on_delete=models.CASCADE, related_name='user_stats')
    completed_at = models.DateTimeField()
    duration_minutes = models.IntegerField()
    recorded_path = geomodels.LineStringField(srid=4326)

    def __str__(self):
        return f"{self.user.username} - {self.trail.name} ({self.completed_at})"
