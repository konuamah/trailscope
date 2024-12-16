# admin.py
from django.contrib import admin
from .models import Trail

class TrailAdmin(admin.ModelAdmin):
    list_display = ['name', 'difficulty_rating', 'length_meters', 'created_by', 'status', 'created_at']
    list_filter = ['status', 'difficulty_rating']
    search_fields = ['name', 'description']
    readonly_fields = ['created_at', 'created_by']
    
    

    # Optional: Customize form fields or fieldsets
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'geometry', 'elevation_profile', 'difficulty_rating', 'length_meters', 'status', 'metadata')
        }),
        ('User Information', {
            'fields': ('created_by', 'created_at')
        }),
    )

admin.site.register(Trail, TrailAdmin)
