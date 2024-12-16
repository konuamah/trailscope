# reviews/admin.py
from django.contrib import admin
from .models import TrailReview

@admin.register(TrailReview)
class TrailReviewAdmin(admin.ModelAdmin):
    list_display = ('id', 'trail', 'user', 'rating', 'created_at')
    search_fields = ('trail__name', 'user__username', 'rating')
    list_filter = ('rating', 'created_at')
    ordering = ('-created_at',)
