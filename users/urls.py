from django.urls import path
from .views import (
    RegisterView, CustomTokenObtainPairView, 
    UserProfileView, UpdateProfileView,
    ChangePasswordView, LogoutView, LogoutAllView,
    CheckAuthView, list_users, user_detail, UserStatsView
)

urlpatterns = [
    # Authentication
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('logout-all/', LogoutAllView.as_view(), name='logout-all'),
    
    # Profile
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('profile/update/', UpdateProfileView.as_view(), name='update-profile'),
    path('profile/change-password/', ChangePasswordView.as_view(), name='change-password'),
    
    # Utility
    path('check-auth/', CheckAuthView.as_view(), name='check-auth'),
    
    # Admin only
    path('users/', list_users, name='list-users'),
    path('users/<int:pk>/', user_detail, name='user-detail'),
    path('stats/', UserStatsView.as_view(), name='user-stats'),
]