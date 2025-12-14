from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.contrib.auth import get_user_model

User = get_user_model()


class IsAdminUser(BasePermission):
    """
    Permission that allows access only to admin users.
    Admin users have is_admin = True.
    """
    
    def has_permission(self, request, view):
        # Check if user is authenticated and is admin
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin
        )
    
    def has_object_permission(self, request, view, obj):
        # Admin users have full permissions on objects
        return self.has_permission(request, view)


class IsAdminOrReadOnly(BasePermission):
    """
    Permission that allows admin users to edit, 
    but allows read-only access to all authenticated users.
    """
    
    def has_permission(self, request, view):
        # Read permissions are allowed to any authenticated request
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        
        # Write permissions only for admin users
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin
        )
    
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any authenticated request
        if request.method in SAFE_METHODS:
            return bool(request.user and request.user.is_authenticated)
        
        # Write permissions only for admin users
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin
        )


class IsOwnerOrAdmin(BasePermission):
    """
    Permission that allows users to access their own objects,
    and admin users to access all objects.
    """
    
    def has_object_permission(self, request, view, obj):
        # Admin users can do anything
        if request.user and request.user.is_admin:
            return True
        
        # Check if the object has a user field
        if hasattr(obj, 'user'):
            return obj.user == request.user
        
        # Check if the object is the user itself
        if isinstance(obj, User):
            return obj == request.user
        
        # Default: allow only admin
        return False


class IsStaffOrAdmin(BasePermission):
    """
    Permission that allows both staff and admin users.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_staff or request.user.is_admin)
        )
    
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsSuperUser(BasePermission):
    """
    Permission that allows access only to superusers.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_superuser
        )
    
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class IsActiveUser(BasePermission):
    """
    Permission that allows access only to active users.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_active
        )
    
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class HasPermissionForAction(BasePermission):
    """
    Custom permission that checks specific permissions based on action.
    Useful for ViewSets.
    """
    
    # Define which actions require admin permissions
    admin_actions = ['create', 'update', 'partial_update', 'destroy', 'restock']
    
    # Define which actions require staff permissions
    staff_actions = ['list', 'retrieve']
    
    def has_permission(self, request, view):
        action = view.action if hasattr(view, 'action') else None
        
        # If no specific action, use default permission
        if not action:
            return bool(request.user and request.user.is_authenticated)
        
        # Admin actions
        if action in self.admin_actions:
            return bool(
                request.user and 
                request.user.is_authenticated and 
                request.user.is_admin
            )
        
        # Staff actions
        if action in self.staff_actions:
            return bool(
                request.user and 
                request.user.is_authenticated and 
                (request.user.is_staff or request.user.is_admin)
            )
        
        # Default: authenticated users
        return bool(request.user and request.user.is_authenticated)


class SweetPermission(BasePermission):
    """
    Specific permission class for Sweet model operations.
    """
    
    def has_permission(self, request, view):
        # Get action from view
        action = getattr(view, 'action', None)
        
        # Define allowed methods for different user types
        if request.method in SAFE_METHODS:  # GET, HEAD, OPTIONS
            # All authenticated users can read
            return bool(request.user and request.user.is_authenticated)
        
        elif request.method == 'POST':  # Create
            # Only admin can create new sweets
            return bool(
                request.user and 
                request.user.is_authenticated and 
                request.user.is_admin
            )
        
        elif request.method in ['PUT', 'PATCH']:  # Update
            # Only admin can update sweets
            return bool(
                request.user and 
                request.user.is_authenticated and 
                request.user.is_admin
            )
        
        elif request.method == 'DELETE':  # Delete
            # Only admin can delete sweets
            return bool(
                request.user and 
                request.user.is_authenticated and 
                request.user.is_admin
            )
        
        return False
    
    def has_object_permission(self, request, view, obj):
        # For object-level permissions
        
        if request.method in SAFE_METHODS:
            # All authenticated users can view any sweet
            return bool(request.user and request.user.is_authenticated)
        
        elif request.method in ['PUT', 'PATCH', 'DELETE']:
            # Only admin can modify or delete any sweet
            return bool(
                request.user and 
                request.user.is_authenticated and 
                request.user.is_admin
            )
        
        return False


class PurchasePermission(BasePermission):
    """
    Permission for purchase operations.
    All authenticated users can purchase, but with quantity limits.
    """
    
    def has_permission(self, request, view):
        # All authenticated users can make purchases
        return bool(request.user and request.user.is_authenticated)
    
    def has_object_permission(self, request, view, obj):
        # Additional object-level checks
        if request.method == 'POST':
            # Check if sweet is available
            if not obj.is_available:
                return False
            
            # Check quantity limit per user (example: max 100 per sweet per user)
            # You can implement purchase history checks here
            return True
        
        return False


class RestockPermission(BasePermission):
    """
    Permission for restock operations.
    Only admin users can restock.
    """
    
    def has_permission(self, request, view):
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin
        )
    
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class CanManageInventory(BasePermission):
    """
    Permission for inventory management operations.
    """
    
    def has_permission(self, request, view):
        # Admin and staff can manage inventory
        return bool(
            request.user and 
            request.user.is_authenticated and 
            (request.user.is_admin or request.user.is_staff)
        )
    
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class CustomPermissionMixin:
    """
    Mixin to add custom permission logic to views.
    """
    
    def get_permissions(self):
        """
        Override to use different permissions based on action.
        """
        if self.action == 'create':
            return [IsAdminUser()]
        elif self.action in ['update', 'partial_update', 'destroy']:
            return [IsAdminUser()]
        elif self.action == 'restock':
            return [IsAdminUser()]
        elif self.action == 'purchase':
            return [permissions.IsAuthenticated()]
        else:
            return [permissions.IsAuthenticated()]


# Permission utility functions
def check_admin_permission(user):
    """Check if user has admin permissions."""
    return bool(user and user.is_authenticated and user.is_admin)


def check_staff_permission(user):
    """Check if user has staff permissions."""
    return bool(user and user.is_authenticated and (user.is_staff or user.is_admin))


def check_authenticated(user):
    """Check if user is authenticated."""
    return bool(user and user.is_authenticated)


def check_object_ownership(user, obj):
    """Check if user owns the object."""
    if hasattr(obj, 'user'):
        return obj.user == user
    return False


# Permission decorators for function-based views
def admin_required(view_func):
    """Decorator for admin-only views."""
    from functools import wraps
    from django.http import HttpResponseForbidden
    
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not (request.user and request.user.is_authenticated and request.user.is_admin):
            return HttpResponseForbidden("Admin access required")
        return view_func(request, *args, **kwargs)
    
    return _wrapped_view


def staff_required(view_func):
    """Decorator for staff-only views."""
    from functools import wraps
    from django.http import HttpResponseForbidden
    
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not (request.user and request.user.is_authenticated and 
               (request.user.is_staff or request.user.is_admin)):
            return HttpResponseForbidden("Staff access required")
        return view_func(request, *args, **kwargs)
    
    return _wrapped_view


# Permission class for API views with specific action mapping
class ActionBasedPermission(BasePermission):
    """
    Permission that maps actions to specific permission requirements.
    """
    
    # Define permission mapping
    permission_map = {
        'list': 'is_authenticated',
        'retrieve': 'is_authenticated',
        'create': 'is_admin',
        'update': 'is_admin',
        'partial_update': 'is_admin',
        'destroy': 'is_admin',
        'purchase': 'is_authenticated',
        'restock': 'is_admin',
        'featured': 'is_authenticated',
        'low_stock': 'is_staff',
        'out_of_stock': 'is_staff',
    }
    
    def has_permission(self, request, view):
        action = getattr(view, 'action', None)
        
        if not action:
            # Default to authenticated
            return bool(request.user and request.user.is_authenticated)
        
        # Get permission requirement for this action
        requirement = self.permission_map.get(action, 'is_authenticated')
        
        if requirement == 'is_admin':
            return bool(request.user and request.user.is_authenticated and request.user.is_admin)
        elif requirement == 'is_staff':
            return bool(request.user and request.user.is_authenticated and 
                       (request.user.is_staff or request.user.is_admin))
        elif requirement == 'is_authenticated':
            return bool(request.user and request.user.is_authenticated)
        else:
            return False
    
    def has_object_permission(self, request, view, obj):
        # Use same logic as has_permission for object level
        return self.has_permission(request, view)


# Export all permissions
__all__ = [
    'IsAdminUser',
    'IsAdminOrReadOnly',
    'IsOwnerOrAdmin',
    'IsStaffOrAdmin',
    'IsSuperUser',
    'IsActiveUser',
    'HasPermissionForAction',
    'SweetPermission',
    'PurchasePermission',
    'RestockPermission',
    'CanManageInventory',
    'CustomPermissionMixin',
    'ActionBasedPermission',
    'check_admin_permission',
    'check_staff_permission',
    'check_authenticated',
    'check_object_ownership',
    'admin_required',
    'staff_required',
]