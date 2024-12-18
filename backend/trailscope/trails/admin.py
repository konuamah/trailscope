from django.contrib import admin
from .models import Trail

class TrailAdmin(admin.ModelAdmin):
    # Display relevant fields in the list view
    list_display = ['name', 'difficulty_rating', 'length_meters', 'created_by', 'status', 'created_at', 'image']
    
    # Add filtering options in the admin
    list_filter = ['status', 'difficulty_rating']
    
    # Enable search by name and description
    search_fields = ['name', 'description']
    
    # Make the created_at and created_by fields readonly
    readonly_fields = ['created_at', 'created_by', 'username']
    
    # Customize the layout of the form in the admin interface
    fieldsets = (
        (None, {
            'fields': ('name', 'description', 'geometry', 'elevation_profile', 'difficulty_rating', 'length_meters', 'status', 'metadata', 'image')
        }),
        ('User Information', {
            'fields': ('created_by', 'created_at')
        }),
    )

admin.site.register(Trail, TrailAdmin)
