from django.contrib import admin
from .models import User

class UserAdmin(admin.ModelAdmin):
    model = User  # Register the correct model here
    list_display = ('id', 'username', 'email', 'created_at', 'profile_data_json')  # Fields to display in the list view
    search_fields = ('username', 'email')  # Fields to search in the admin interface
    list_filter = ('created_at',)  # Fields to filter by in the admin interface
    ordering = ('-created_at',)  # Default ordering by created date (descending)

    # Optional: Allow editing profile_data in a more user-friendly way
    def profile_data_json(self, obj):
        return obj.profile_data if obj.profile_data else "No Profile Data"
    profile_data_json.short_description = 'Profile Data'

    # Hide the id field in the form
    exclude = ('id',)
    # Optionally, you can define which fields to display
    fieldsets = (
        (None, {'fields': ('username', 'email', 'profile_data')}),
        ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Important dates', {'fields': ('last_login', 'date_joined')}),
    )

admin.site.register(User, UserAdmin)
