from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.csrf import csrf_protect
from api.permissions import IsAdminUser, IsStaffOrAdmin

from .serializers import (
    UserSerializer, UserProfileSerializer, 
    ChangePasswordSerializer, CustomTokenObtainPairSerializer,
    UserUpdateSerializer
)

# Add at the top
from .permissions import (
    IsUserOwnerOrAdmin, CanViewUserList, CanUpdateUser,
    CanDeleteUser, CanChangePassword, UserActionPermission,
    UserPermissionMixin
)

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    """
    Register a new user.
    """
    queryset = User.objects.all()
    permission_classes = [permissions.AllowAny]
    serializer_class = UserSerializer
    
    @method_decorator(csrf_protect)
    @method_decorator(never_cache)
    def create(self, request, *args, **kwargs):
        """
        Override create to customize response.
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        try:
            user = serializer.save()
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Generate tokens for auto-login after registration
        refresh = RefreshToken.for_user(user)
        
        response_data = {
            'message': 'User registered successfully',
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'is_admin': user.is_admin,
                'is_active': user.is_active
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)


class CustomTokenObtainPairView(TokenObtainPairView):
    """
    Custom login view using email instead of username.
    Returns JWT tokens with user data.
    """
    serializer_class = CustomTokenObtainPairSerializer
    
    @method_decorator(csrf_protect)
    @method_decorator(never_cache)
    def post(self, request, *args, **kwargs):
        """
        Override post to customize response.
        """
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            # Add user data to response
            user = User.objects.get(email=request.data.get('email'))
            response.data.update({
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_admin': user.is_admin,
                    'is_staff': user.is_staff,
                    'is_active': user.is_active,
                }
            })
        
        return response


class UserProfileView(generics.RetrieveAPIView):
    """
    Get current user profile.
    """
    serializer_class = UserProfileSerializer
    permission_classes = [permissions.IsAuthenticated, IsUserOwnerOrAdmin]
    
    def get_object(self):
        return self.request.user
    
    @method_decorator(never_cache)
    def get(self, request, *args, **kwargs):
        """
        Get user profile with additional data.
        """
        user = self.get_object()
        serializer = self.get_serializer(user)
        
        # Add additional data
        data = serializer.data
        data['permissions'] = {
            'can_add_sweets': user.is_admin,
            'can_edit_sweets': user.is_admin,
            'can_delete_sweets': user.is_admin,
            'can_restock': user.is_admin,
        }
        
        return Response(data)


class UpdateProfileView(generics.UpdateAPIView):
    """
    Update user profile.
    """
    serializer_class = UserUpdateSerializer
    permission_classes = [permissions.IsAuthenticated, CanUpdateUser]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        """
        Override update to customize response.
        """
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        self.perform_update(serializer)
        
        if getattr(instance, '_prefetched_objects_cache', None):
            instance._prefetched_objects_cache = {}
        
        # Return updated profile
        profile_serializer = UserProfileSerializer(instance)
        return Response({
            'message': 'Profile updated successfully',
            'user': profile_serializer.data
        })


class ChangePasswordView(generics.UpdateAPIView):
    """
    Change user password.
    """
    serializer_class = ChangePasswordSerializer
    permission_classes = [permissions.IsAuthenticated, CanChangePassword]
    
    def get_object(self):
        return self.request.user
    
    def update(self, request, *args, **kwargs):
        """
        Change password with validation.
        """
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)
        
        if serializer.is_valid():
            # Check old password
            if not user.check_password(serializer.validated_data['old_password']):
                return Response(
                    {'old_password': 'Wrong password.'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Set new password
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            
            # Generate new tokens (optional - log out all sessions)
            refresh = RefreshToken.for_user(user)
            
            return Response({
                'message': 'Password changed successfully',
                'tokens': {
                    'refresh': str(refresh),
                    'access': str(refresh.access_token),
                }
            })
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    """
    Logout user by blacklisting refresh token.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            refresh_token = request.data.get("refresh")
            if not refresh_token:
                return Response(
                    {'error': 'Refresh token is required'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            token = RefreshToken(refresh_token)
            token.blacklist()
            
            return Response(
                {'message': 'Successfully logged out'},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class LogoutAllView(APIView):
    """
    Logout from all devices by blacklisting all tokens.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            user = request.user
            # Invalidate all refresh tokens for this user
            tokens = RefreshToken.objects.filter(user=user)
            for token in tokens:
                token.blacklist()
            
            # Alternative: Create a token_version field in User model
            # and increment it on logout_all
            
            return Response(
                {'message': 'Successfully logged out from all devices'},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )


class CheckAuthView(APIView):
    """
    Check if user is authenticated and get basic info.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        return Response({
            'authenticated': True,
            'user': {
                'id': user.id,
                'email': user.email,
                'username': user.username,
                'is_admin': user.is_admin,
            }
        })


@api_view(['GET'])
@permission_classes([permissions.IsAdminUser, CanViewUserList])
def list_users(request):
    """
    List all users (admin only).
    """
    users = User.objects.all().order_by('-date_joined')
    serializer = UserProfileSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['GET', 'DELETE'])
@permission_classes([permissions.IsAdminUser, CanViewUserList])
def user_detail(request, pk):
    """
    Get or delete a specific user (admin only).
    """
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response(
            {'error': 'User not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
    if request.method == 'GET':
        serializer = UserProfileSerializer(user)
        return Response(serializer.data)
    
    elif request.method == 'DELETE':
        # Prevent self-deletion
        if user == request.user:
            return Response(
                {'error': 'You cannot delete your own account'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        user.delete()
        return Response(
            {'message': 'User deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


class UserStatsView(APIView):
    """
    Get user statistics (admin only).
    """
    permission_classes = [permissions.IsAdminUser]
    
    def get(self, request):
        total_users = User.objects.count()
        active_users = User.objects.filter(is_active=True).count()
        admin_users = User.objects.filter(is_admin=True).count()
        staff_users = User.objects.filter(is_staff=True).count()
        
        # Recent users (last 7 days)
        from django.utils import timezone
        from django.db.models import Count
        from datetime import timedelta
        
        week_ago = timezone.now() - timedelta(days=7)
        recent_users = User.objects.filter(date_joined__gte=week_ago).count()
        
        # Users by month (for chart)
        users_by_month = User.objects.extra(
            select={'month': "strftime('%%Y-%%m', date_joined)"}
        ).values('month').annotate(count=Count('id')).order_by('month')
        
        return Response({
            'total_users': total_users,
            'active_users': active_users,
            'inactive_users': total_users - active_users,
            'admin_users': admin_users,
            'staff_users': staff_users,
            'regular_users': total_users - admin_users - staff_users,
            'recent_users_7_days': recent_users,
            'users_by_month': list(users_by_month),
        })