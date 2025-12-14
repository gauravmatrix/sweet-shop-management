from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.utils.html import format_html
from django.contrib.auth.models import Group
from .models import CustomUser

class UserStatusFilter(admin.SimpleListFilter):
    title = 'User Status'
    parameter_name = 'status'
    
    def lookups(self, request, model_admin):
        return (
            ('active', 'Active Users'),
            ('inactive', 'Inactive Users'),
            ('admin', 'Admin Users'),
            ('staff', 'Staff Users'),
        )
    
    def queryset(self, request, queryset):
        if self.value() == 'active':
            return queryset.filter(is_active=True)
        elif self.value() == 'inactive':
            return queryset.filter(is_active=False)
        elif self.value() == 'admin':
            return queryset.filter(is_admin=True)
        elif self.value() == 'staff':
            return queryset.filter(is_staff=True)

@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    # Display fields in list view
    list_display = ('email', 'username', 'role_badge', 'status_icon', 
                    'last_login_display', 'date_joined_display', 'actions_column')
    
    # Filters
    list_filter = (UserStatusFilter, 'is_admin', 'is_staff', 'is_active', 'date_joined')
    
    # Search
    search_fields = ('email', 'username', 'first_name', 'last_name')
    search_help_text = "Search by email, username, first name or last name"
    
    # Ordering
    ordering = ('-date_joined',)
    
    # Fieldsets for edit view
    fieldsets = (
        ('Personal Info', {
            'fields': ('email', 'username', 'first_name', 'last_name'),
            'classes': ('wide',),
        }),
        ('Permissions', {
            'fields': ('is_active', 'is_staff', 'is_admin', 'is_superuser'),
            'classes': ('wide', 'collapse'),
        }),
        ('Groups & Permissions', {
            'fields': ('groups', 'user_permissions'),
            'classes': ('wide', 'collapse'),
        }),
        ('Important Dates', {
            'fields': ('last_login', 'date_joined'),
            'classes': ('wide', 'collapse'),
        }),
    )
    
    # Add user form fields
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'username', 'password1', 'password2', 
                      'is_active', 'is_staff', 'is_admin'),
        }),
    )
    
    # Custom display methods
    def role_badge(self, obj):
        if obj.is_superuser:
            color = 'red'
            role = 'Super Admin'
        elif obj.is_admin:
            color = 'purple'
            role = 'Admin'
        elif obj.is_staff:
            color = 'blue'
            role = 'Staff'
        else:
            color = 'green'
            role = 'User'
        
        return format_html(
            '<span style="background-color: {}; color: white; padding: 3px 10px; '
            'border-radius: 15px; font-size: 12px; font-weight: bold;">{}</span>',
            color, role
        )
    role_badge.short_description = 'Role'
    
    def status_icon(self, obj):
        if obj.is_active:
            return format_html(
                '<span style="color: green; font-size: 18px;" title="Active">●</span>'
            )
        else:
            return format_html(
                '<span style="color: red; font-size: 18px;" title="Inactive">●</span>'
            )
    status_icon.short_description = 'Status'
    
    def last_login_display(self, obj):
        if obj.last_login:
            from django.utils import timezone
            now = timezone.now()
            diff = now - obj.last_login
            
            if diff.days == 0:
                return "Today"
            elif diff.days == 1:
                return "Yesterday"
            elif diff.days < 7:
                return f"{diff.days} days ago"
            else:
                return obj.last_login.strftime("%b %d, %Y")
        return "Never"
    last_login_display.short_description = 'Last Login'
    
    def date_joined_display(self, obj):
        return obj.date_joined.strftime("%b %d, %Y")
    date_joined_display.short_description = 'Joined On'
    
    def actions_column(self, obj):
        return format_html(
            '''
            <div style="display: flex; gap: 5px;">
                <a href="{}/change/" style="background: #2196F3; color: white; padding: 2px 8px; 
                   border-radius: 3px; text-decoration: none; font-size: 12px;">Edit</a>
                <a href="{}/delete/" style="background: #f44336; color: white; padding: 2px 8px; 
                   border-radius: 3px; text-decoration: none; font-size: 12px;">Delete</a>
            </div>
            ''',
            obj.id, obj.id
        )
    actions_column.short_description = 'Actions'
    
    # Custom actions
    actions = ['activate_users', 'deactivate_users', 'make_admin', 'remove_admin']
    
    def activate_users(self, request, queryset):
        updated = queryset.update(is_active=True)
        self.message_user(
            request,
            f"Activated {updated} user(s).",
            level='success'
        )
    activate_users.short_description = "✅ Activate selected users"
    
    def deactivate_users(self, request, queryset):
        updated = queryset.update(is_active=False)
        self.message_user(
            request,
            f"Deactivated {updated} user(s).",
            level='warning'
        )
    deactivate_users.short_description = "❌ Deactivate selected users"
    
    def make_admin(self, request, queryset):
        updated = queryset.update(is_admin=True)
        self.message_user(
            request,
            f"Made {updated} user(s) admin.",
            level='success'
        )
    make_admin.short_description = "👑 Make admin"
    
    def remove_admin(self, request, queryset):
        updated = queryset.update(is_admin=False)
        self.message_user(
            request,
            f"Removed admin privileges from {updated} user(s).",
            level='warning'
        )
    remove_admin.short_description = "👤 Remove admin"
    
    # Custom save method
    def save_model(self, request, obj, form, change):
        if obj.is_superuser:
            obj.is_admin = True
            obj.is_staff = True
        super().save_model(request, obj, form, change)

# Unregister default Group admin (optional)
admin.site.unregister(Group)

# Custom Group Admin if needed
@admin.register(Group)
class CustomGroupAdmin(admin.ModelAdmin):
    list_display = ('name', 'user_count')
    search_fields = ('name',)
    
    def user_count(self, obj):
        return obj.user_set.count()
    user_count.short_description = 'Users'