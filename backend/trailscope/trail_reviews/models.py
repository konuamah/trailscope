# reviews/models.py
from django.db import models
import uuid
from django.contrib.auth import get_user_model
from django.contrib.gis.db import models as geomodels

class TrailReview(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    trail = models.ForeignKey('trails.Trail', on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE, related_name='reviews')
    rating = models.SmallIntegerField()
    review_text = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.user} - Rating: {self.rating}"
