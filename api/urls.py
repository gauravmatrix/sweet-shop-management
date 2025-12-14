from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    SweetViewSet, PurchaseView, RestockView,
    search_sweets, SweetStatsView, BulkOperationsView,
    sweet_categories, DashboardView
)

router = DefaultRouter()
router.register(r'sweets', SweetViewSet, basename='sweet')

urlpatterns = [
    path('', include(router.urls)),
    
    # Specific operations
    path('sweets/<int:pk>/purchase/', PurchaseView.as_view(), name='purchase'),
    path('sweets/<int:pk>/restock/', RestockView.as_view(), name='restock'),
    
    # Search and categories
    path('sweets/search/advanced/', search_sweets, name='advanced-search'),
    path('categories/', sweet_categories, name='categories'),
    
    # Statistics and dashboard
    path('stats/', SweetStatsView.as_view(), name='sweet-stats'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    
    # Bulk operations (admin)
    path('bulk-operations/', BulkOperationsView.as_view(), name='bulk-operations'),
]