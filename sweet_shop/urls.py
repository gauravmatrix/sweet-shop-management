"""
URL configuration for sweet_shop project.
"""
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView
from rest_framework import permissions
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

# Swagger/OpenAPI Schema View
schema_view = get_schema_view(
    openapi.Info(
        title="Sweet Shop Management System API",
        default_version='v1',
        description="Sweet Shop Management System API Documentation",
        terms_of_service="https://www.sweetshop.com/terms/",
        contact=openapi.Contact(email="support@sweetshop.com"),
        license=openapi.License(name="MIT License"),
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    # ==================== ADMIN PANEL ====================
    path('admin/', admin.site.urls),
    
    # ==================== API ENDPOINTS ====================
    # Authentication API
    path('api/auth/', include('users.urls')),
    
    # JWT Token endpoints
    path('api/auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/auth/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # Sweet Shop API
    path('api/', include('api.urls')),
    
    # ==================== API DOCUMENTATION ====================
    # Swagger UI - Interactive API documentation
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), 
         name='schema-swagger-ui'),
    
    # ReDoc - Alternative API documentation
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), 
         name='schema-redoc'),
    
    # ==================== LANDING PAGE ====================
    path('', TemplateView.as_view(template_name='landing.html'), name='landing'),
    
    # ==================== HEALTH CHECK ====================
    path('health/', TemplateView.as_view(template_name='health.html'), 
         name='health-check'),
]

# ==================== STATIC & MEDIA FILES ====================
# Serve static files during development
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
    # Django REST Framework browsable API
    urlpatterns += [
        path('api-auth/', include('rest_framework.urls', namespace='rest_framework')),
    ]

# ==================== ERROR HANDLERS ====================
handler404 = 'sweet_shop.views.custom_404'
handler500 = 'sweet_shop.views.custom_500'
handler403 = 'sweet_shop.views.custom_403'
handler400 = 'sweet_shop.views.custom_400'