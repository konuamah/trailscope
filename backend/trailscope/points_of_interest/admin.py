from django.contrib import admin
from .models import PointsOfInterest

@admin.register(PointsOfInterest)
class PointsOfInterestAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'trail', 'location')
    search_fields = ('name', 'type', 'trail__name')
