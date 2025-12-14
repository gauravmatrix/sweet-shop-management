from rest_framework import permissions
from rest_framework.permissions import BasePermission, SAFE_METHODS
from django.contrib.auth import get_user_model
from django.http import Http404
from api.permissions import IsAdminUser 
User = get_user_model()


class IsUserOwnerOrAdmin(BasePermission):
    """
    Permission that allows users to access their own profile,
    and admin users to access any user profile.
    """
    
    def has_permission(self, request, view):
        # Allow all authenticated users to access their own profile
        if request.user and request.user.is_authenticated:
            return True
        return False
    
    def has_object_permission(self, request, view, obj):
        # Admin can access any user
        if request.user and request.user.is_admin:
            return True
        
        # Users can only access their own profile
        return obj == request.user


class CanRegisterUser(BasePermission):
    """
    Permission for user registration.
    Allows anyone to register, but only admin can create admin users.
    """
    
    def has_permission(self, request, view):
        # Anyone can register (register endpoint should use AllowAny)
        if view.action == 'register':
            return True
        
        # Check if trying to create admin user
        if request.method == 'POST' and request.data.get('is_admin'):
            # Only admin can create admin users
            return bool(
                request.user and 
                request.user.is_authenticated and 
                request.user.is_admin
            )
        
        return bool(request.user and request.user.is_authenticated)


class CanViewUserList(BasePermission):
    """
    Permission for viewing user list.
    Only admin can view list of all users.
    """
    
    def has_permission(self, request, view):
        # Only admin can view user list
        if view.action == 'list':
            return bool(
                request.user and 
                request.user.is_authenticated and 
                request.user.is_admin
            )
        
        # Individual user can view their own profile
        if view.action in ['retrieve', 'update', 'partial_update']:
            return bool(request.user and request.user.is_authenticated)
        
        return False
    
    def has_object_permission(self, request, view, obj):
        # Admin can view any user
        if request.user and request.user.is_admin:
            return True
        
        # Users can only view their own profile
        return obj == request.user


class CanUpdateUser(BasePermission):
    """
    Permission for updating user information.
    Users can update their own profile, admin can update any profile.
    """
    
    def has_permission(self, request, view):
        # Only authenticated users can update
        return bool(request.user and request.user.is_authenticated)
    
    def has_object_permission(self, request, view, obj):
        # Admin can update any user
        if request.user and request.user.is_admin:
            return True
        
        # Check if user is updating themselves
        if obj == request.user:
            # Users cannot change their own admin status
            if 'is_admin' in request.data and request.data['is_admin'] != obj.is_admin:
                return False
            
            # Users cannot change their own superuser status
            if 'is_superuser' in request.data and request.data['is_superuser'] != obj.is_superuser:
                return False
            
            # Users cannot change their own staff status
            if 'is_staff' in request.data and request.data['is_staff'] != obj.is_staff:
                return False
            
            return True
        
        return False


class CanDeleteUser(BasePermission):
    """
    Permission for deleting users.
    Admin can delete any user (except themselves).
    Users cannot delete any account.
    """
    
    def has_permission(self, request, view):
        # Only admin can delete users
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin
        )
    
    def has_object_permission(self, request, view, obj):
        # Admin cannot delete themselves
        if obj == request.user:
            return False
        
        # Admin can delete any other user
        return bool(request.user and request.user.is_admin)


class CanChangePassword(BasePermission):
    """
    Permission for changing password.
    Users can change their own password.
    Admin can change any user's password (with restrictions).
    """
    
    def has_permission(self, request, view):
        # Only authenticated users can change password
        return bool(request.user and request.user.is_authenticated)
    
    def has_object_permission(self, request, view, obj):
        # Users can change their own password
        if obj == request.user:
            return True
        
        # Admin can change any user's password
        if request.user and request.user.is_admin:
            return True
        
        return False


class CanDeactivateUser(BasePermission):
    """
    Permission for deactivating users.
    Admin can deactivate any user (except themselves).
    """
    
    def has_permission(self, request, view):
        # Only admin can deactivate users
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin
        )
    
    def has_object_permission(self, request, view, obj):
        # Cannot deactivate yourself
        if obj == request.user:
            return False
        
        # Admin can deactivate any other user
        return True


class CanActivateUser(BasePermission):
    """
    Permission for activating users.
    Admin can activate any user.
    """
    
    def has_permission(self, request, view):
        # Only admin can activate users
        return bool(
            request.user and 
            request.user.is_authenticated and 
            request.user.is_admin
        )
    
    def has_object_permission(self, request, view, obj):
        return self.has_permission(request, view)


class UserActionPermission(BasePermission):
    """
    Comprehensive permission class for User ViewSet actions.
    Maps each action to specific permission requirements.
    """
    
    # Define which actions are allowed for different user types
    action_permissions = {
        'list': {'admin': True, 'staff': False, 'user': False},
        'retrieve': {'admin': True, 'staff': False, 'user': True},  # Only own profile
        'create': {'admin': True, 'staff': False, 'user': False},   # Admin creates users
        'update': {'admin': True, 'staff': False, 'user': True},    # Only own profile
        'partial_update': {'admin': True, 'staff': False, 'user': True},
        'destroy': {'admin': True, 'staff': False, 'user': False},
        'change_password': {'admin': True, 'staff': False, 'user': True},
        'deactivate': {'admin': True, 'staff': False, 'user': False},
        'activate': {'admin': True, 'staff': False, 'user': False},
    }
    
    def has_permission(self, request, view):
        action = getattr(view, 'action', None)
        
        if not action:
            # Default to authenticated
            return bool(request.user and request.user.is_authenticated)
        
        # Get permission requirements for this action
        if action not in self.action_permissions:
            return False
        
        requirements = self.action_permissions[action]
        
        # Check admin permission
        if request.user and request.user.is_admin:
            return requirements['admin']
        
        # Check staff permission
        if request.user and request.user.is_staff:
            return requirements['staff']
        
        # Check regular user permission
        if request.user and request.user.is_authenticated:
            return requirements['user']
        
        return False
    
    def has_object_permission(self, request, view, obj):
        action = getattr(view, 'action', None)
        
        # Admin has full access to all objects
        if request.user and request.user.is_admin:
            # But admin cannot delete themselves
            if action == 'destroy' and obj == request.user:
                return False
            return True
        
        # Regular users can only access their own objects
        if action in ['retrieve', 'update', 'partial_update', 'change_password']:
            return obj == request.user
        
        return False


class RegistrationPermission(BasePermission):
    """
    Special permission for registration endpoint.
    Allows anyone to register, but with restrictions.
    """
    
    def has_permission(self, request, view):
        # Allow anyone to access register endpoint
        if view.action == 'register':
            return True
        
        # For other actions, require authentication
        return bool(request.user and request.user.is_authenticated)
    
    def has_object_permission(self, request, view, obj):
        # No object permission needed for registration
        return True


class ProfileAccessPermission(BasePermission):
    """
    Permission for profile-related endpoints.
    """
    
    def has_permission(self, request, view):
        # All profile endpoints require authentication
        return bool(request.user and request.user.is_authenticated)
    
    def has_object_permission(self, request, view, obj):
        # Users can access their own profile
        if obj == request.user:
            return True
        
        # Admin can access any profile
        if request.user and request.user.is_admin:
            return True
        
        return False


# Utility functions for user permissions
def can_view_user(request_user, target_user):
    """Check if request_user can view target_user."""
    if not request_user or not request_user.is_authenticated:
        return False
    
    if request_user.is_admin:
        return True
    
    return request_user == target_user


def can_edit_user(request_user, target_user):
    """Check if request_user can edit target_user."""
    if not request_user or not request_user.is_authenticated:
        return False
    
    if request_user.is_admin:
        # Admin cannot edit their own admin status
        if target_user == request_user:
            return True  # But with field restrictions in serializer
        return True
    
    return request_user == target_user


def can_delete_user(request_user, target_user):
    """Check if request_user can delete target_user."""
    if not request_user or not request_user.is_authenticated:
        return False
    
    if not request_user.is_admin:
        return False
    
    # Cannot delete yourself
    if request_user == target_user:
        return False
    
    return True


def can_change_user_status(request_user, target_user):
    """Check if request_user can change target_user's active status."""
    if not request_user or not request_user.is_authenticated:
        return False
    
    if not request_user.is_admin:
        return False
    
    # Cannot change your own status
    if request_user == target_user:
        return False
    
    return True


def can_create_admin_user(request_user):
    """Check if request_user can create an admin user."""
    if not request_user or not request_user.is_authenticated:
        return False
    
    return request_user.is_admin


# Decorators for function-based views
def user_owner_required(view_func):
    """Decorator that allows only the user owner or admin."""
    from functools import wraps
    from django.http import Http404
    
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        user_id = kwargs.get('pk') or kwargs.get('user_id')
        
        if not request.user.is_authenticated:
            raise Http404
        
        # Admin can access any user
        if request.user.is_admin:
            return view_func(request, *args, **kwargs)
        
        # Regular users can only access their own data
        try:
            user_id_int = int(user_id)
            if request.user.id != user_id_int:
                raise Http404
        except (ValueError, TypeError):
            raise Http404
        
        return view_func(request, *args, **kwargs)
    
    return _wrapped_view


def admin_or_self_required(view_func):
    """Decorator for admin or self access."""
    from functools import wraps
    from django.http import HttpResponseForbidden
    
    @wraps(view_func)
    def _wrapped_view(request, *args, **kwargs):
        if not request.user.is_authenticated:
            return HttpResponseForbidden("Authentication required")
        
        # Allow if admin
        if request.user.is_admin:
            return view_func(request, *args, **kwargs)
        
        # Allow if accessing own profile
        user_id = kwargs.get('pk') or kwargs.get('user_id')
        try:
            if request.user.id == int(user_id):
                return view_func(request, *args, **kwargs)
        except (ValueError, TypeError):
            pass
        
        return HttpResponseForbidden("Admin or owner access required")
    
    return _wrapped_view


# Permission mixin for User ViewSets
class UserPermissionMixin:
    """
    Mixin to add user-specific permission logic to views.
    """
    
    def get_permissions(self):
        """
        Return appropriate permissions based on action.
        """
        if self.action == 'register':
            return [permissions.AllowAny()]
        
        elif self.action == 'list':
            return [permissions.IsAuthenticated(), IsAdminUser()]
        
        elif self.action in ['retrieve', 'update', 'partial_update']:
            return [permissions.IsAuthenticated(), IsUserOwnerOrAdmin()]
        
        elif self.action == 'destroy':
            return [permissions.IsAuthenticated(), CanDeleteUser()]
        
        elif self.action == 'change_password':
            return [permissions.IsAuthenticated(), CanChangePassword()]
        
        elif self.action in ['deactivate', 'activate']:
            return [permissions.IsAuthenticated(), CanDeactivateUser()]
        
        else:
            return [permissions.IsAuthenticated()]


# Export all permissions
__all__ = [
    'IsUserOwnerOrAdmin',
    'CanRegisterUser',
    'CanViewUserList',
    'CanUpdateUser',
    'CanDeleteUser',
    'CanChangePassword',
    'CanDeactivateUser',
    'CanActivateUser',
    'UserActionPermission',
    'RegistrationPermission',
    'ProfileAccessPermission',
    'UserPermissionMixin',
    'can_view_user',
    'can_edit_user',
    'can_delete_user',
    'can_change_user_status',
    'can_create_admin_user',
    'user_owner_required',
    'admin_or_self_required',
]