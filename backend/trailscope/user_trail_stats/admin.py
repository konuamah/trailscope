# stats/admin.py
from django.contrib import admin
from .models import UserTrailStat

@admin.register(UserTrailStat)
class UserTrailStatAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'trail', 'completed_at', 'duration_minutes')
    search_fields = ('user__username', 'trail__name')
    list_filter = ('completed_at',)
    ordering = ('-completed_at',)
