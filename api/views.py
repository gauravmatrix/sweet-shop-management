from rest_framework import generics, permissions, filters, status
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.viewsets import ModelViewSet
from rest_framework.pagination import PageNumberPagination
from django_filters.rest_framework import DjangoFilterBackend
from django.shortcuts import get_object_or_404
from django.db.models import Q, Sum, Avg, Count, F
from django.utils import timezone
from datetime import timedelta
import math

from .models import Sweet
from .serializers import (
    SweetSerializer, SweetListSerializer, 
    PurchaseSerializer, RestockSerializer,
    SweetSearchSerializer, SweetStatsSerializer
)

from .permissions import (
    IsAdminUser, IsAdminOrReadOnly, SweetPermission,
    PurchasePermission, RestockPermission, ActionBasedPermission
)

class IsAdminUser(permissions.BasePermission):
    """
    Permission check for admin users.
    """
    def has_permission(self, request, view):
        return request.user and request.user.is_admin


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission that allows admin users to edit, others can only read.
    """
    def has_permission(self, request, view):
        # Read permissions are allowed to any request
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions only for admin users
        return request.user and request.user.is_admin


class StandardResultsSetPagination(PageNumberPagination):
    """
    Custom pagination for sweets.
    """
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100
    
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'total_pages': math.ceil(self.page.paginator.count / self.page_size),
            'current_page': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })


class SweetViewSet(ModelViewSet):
    """
    ViewSet for Sweet CRUD operations.
    """
    queryset = Sweet.objects.all()
    permission_classes = [permissions.IsAuthenticated, ActionBasedPermission]
    pagination_class = StandardResultsSetPagination
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['category', 'is_featured']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'price', 'quantity', 'created_at', 'updated_at']
    ordering = ['-created_at']
    
    def get_serializer_class(self):
        """
        Use different serializers for different actions.
        """
        if self.action == 'list':
            return SweetListSerializer
        return SweetSerializer
    
    def get_permissions(self):
        """
        Special permissions for specific actions.
        """
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [permissions.IsAuthenticated(), IsAdminUser()]
        return [permissions.IsAuthenticated()]
    
    def get_queryset(self):
        """
        Filter queryset based on query parameters.
        """
        queryset = super().get_queryset()
        
        # Apply additional filters
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        available_only = self.request.query_params.get('available_only')
        search_query = self.request.query_params.get('search', '')
        
        if min_price:
            queryset = queryset.filter(price__gte=float(min_price))
        if max_price:
            queryset = queryset.filter(price__lte=float(max_price))
        if available_only and available_only.lower() == 'true':
            queryset = queryset.filter(quantity__gt=0)
        
        # Advanced search
        if search_query:
            queryset = queryset.filter(
                Q(name__icontains=search_query) |
                Q(description__icontains=search_query) |
                Q(category__icontains=search_query)
            )
        
        return queryset
    
    @action(detail=False, methods=['get'])
    def featured(self, request):
        """
        Get featured sweets.
        """
        featured_sweets = self.get_queryset().filter(is_featured=True, quantity__gt=0)
        page = self.paginate_queryset(featured_sweets)
        
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        
        serializer = self.get_serializer(featured_sweets, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def low_stock(self, request):
        """
        Get sweets with low stock (quantity <= 10).
        """
        low_stock_sweets = self.get_queryset().filter(quantity__lte=10).order_by('quantity')
        serializer = self.get_serializer(low_stock_sweets, many=True)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def out_of_stock(self, request):
        """
        Get out of stock sweets.
        """
        out_of_stock_sweets = self.get_queryset().filter(quantity=0)
        serializer = self.get_serializer(out_of_stock_sweets, many=True)
        return Response(serializer.data)
    
    def perform_create(self, serializer):
        """
        Set created_by user when creating a sweet.
        """
        serializer.save()
    
    def destroy(self, request, *args, **kwargs):
        """
        Soft delete or confirm before hard delete.
        """
        instance = self.get_object()
        
        # Check if sweet has stock
        if instance.quantity > 0:
            return Response({
                'error': 'Cannot delete sweet with stock. Restock to zero first.'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class PurchaseView(APIView):
    """
    Purchase a sweet (reduce quantity).
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        sweet = get_object_or_404(Sweet, pk=pk)
        
        # Check if sweet is available
        if not sweet.is_available:
            return Response(
                {'error': 'This sweet is out of stock'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = PurchaseSerializer(
            data=request.data,
            context={'sweet': sweet, 'request': request}
        )
        
        if serializer.is_valid():
            try:
                result = serializer.save()
                
                # Create purchase record (optional)
                # PurchaseRecord.objects.create(
                #     user=request.user,
                #     sweet=sweet,
                #     quantity=result['quantity'],
                #     total_price=result['total_price']
                # )
                
                return Response({
                    'message': 'Purchase successful',
                    'purchase_details': {
                        'sweet': sweet.name,
                        'quantity': result['quantity'],
                        'total_price': float(result['total_price']),
                        'remaining_stock': result['remaining_stock'],
                        'purchased_at': timezone.now().isoformat(),
                    }
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RestockView(APIView):
    """
    Restock a sweet (increase quantity).
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def post(self, request, pk):
        sweet = get_object_or_404(Sweet, pk=pk)
        
        serializer = RestockSerializer(
            data=request.data,
            context={'sweet': sweet, 'request': request}
        )
        
        if serializer.is_valid():
            try:
                result = serializer.save()
                
                # Create restock record (optional)
                # RestockRecord.objects.create(
                #     user=request.user,
                #     sweet=sweet,
                #     quantity=result['quantity'],
                #     reason=result.get('reason', '')
                # )
                
                return Response({
                    'message': 'Restock successful',
                    'restock_details': {
                        'sweet': sweet.name,
                        'quantity': result['quantity'],
                        'reason': result.get('reason', ''),
                        'new_stock': result['new_stock'],
                        'restocked_at': timezone.now().isoformat(),
                    }
                }, status=status.HTTP_200_OK)
                
            except Exception as e:
                return Response(
                    {'error': str(e)},
                    status=status.HTTP_400_BAD_REQUEST
                )
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def search_sweets(request):
    """
    Advanced search for sweets.
    """
    serializer = SweetSearchSerializer(data=request.query_params)
    
    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    data = serializer.validated_data
    
    # Start with all sweets
    queryset = Sweet.objects.all()
    
    # Apply filters
    if data.get('name'):
        queryset = queryset.filter(name__icontains=data['name'])
    
    if data.get('category'):
        queryset = queryset.filter(category=data['category'])
    
    if data.get('min_price'):
        queryset = queryset.filter(price__gte=data['min_price'])
    
    if data.get('max_price'):
        queryset = queryset.filter(price__lte=data['max_price'])
    
    if data.get('available_only'):
        queryset = queryset.filter(quantity__gt=0)
    
    if data.get('is_featured'):
        queryset = queryset.filter(is_featured=True)
    
    # Apply sorting
    sort_by = data.get('sort_by', '-created_at')
    queryset = queryset.order_by(sort_by)
    
    # Pagination
    paginator = PageNumberPagination()
    paginator.page_size = 20
    page = paginator.paginate_queryset(queryset, request)
    
    if page is not None:
        serializer = SweetListSerializer(page, many=True, context={'request': request})
        return paginator.get_paginated_response(serializer.data)
    
    serializer = SweetListSerializer(queryset, many=True, context={'request': request})
    return Response(serializer.data)


class SweetStatsView(APIView):
    """
    Get statistics about sweets.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        # Basic stats
        total_sweets = Sweet.objects.count()
        total_value = Sweet.objects.aggregate(
            total=Sum(F('price') * F('quantity'))
        )['total'] or 0
        
        average_price = Sweet.objects.aggregate(
            avg=Avg('price')
        )['avg'] or 0
        
        total_quantity = Sweet.objects.aggregate(
            total=Sum('quantity')
        )['total'] or 0
        
        # Stock status
        out_of_stock = Sweet.objects.filter(quantity=0).count()
        low_stock = Sweet.objects.filter(quantity__range=(1, 10)).count()
        in_stock = Sweet.objects.filter(quantity__gt=10).count()
        
        # By category
        by_category = Sweet.objects.values('category').annotate(
            count=Count('id'),
            total_quantity=Sum('quantity'),
            total_value=Sum(F('price') * F('quantity'))
        ).order_by('-total_value')
        
        # Recent additions (last 7 days)
        week_ago = timezone.now() - timedelta(days=7)
        recent_additions = Sweet.objects.filter(created_at__gte=week_ago).count()
        
        # Most valuable sweets
        most_valuable = Sweet.objects.annotate(
            item_value=F('price') * F('quantity')
        ).order_by('-item_value')[:5]
        
        most_valuable_data = [
            {
                'id': sweet.id,
                'name': sweet.name,
                'category': sweet.category,
                'value': float(sweet.price * sweet.quantity)
            }
            for sweet in most_valuable
        ]
        
        stats = {
            'total_sweets': total_sweets,
            'total_value': float(total_value),
            'average_price': float(average_price),
            'total_quantity': total_quantity,
            'stock_status': {
                'out_of_stock': out_of_stock,
                'low_stock': low_stock,
                'in_stock': in_stock,
            },
            'by_category': list(by_category),
            'recent_additions_7_days': recent_additions,
            'most_valuable_sweets': most_valuable_data,
        }
        
        serializer = SweetStatsSerializer(stats)
        return Response(serializer.data)


class BulkOperationsView(APIView):
    """
    Perform bulk operations on sweets (admin only).
    """
    permission_classes = [permissions.IsAuthenticated, IsAdminUser]
    
    def post(self, request):
        operation = request.data.get('operation')
        sweet_ids = request.data.get('sweet_ids', [])
        quantity = request.data.get('quantity', 0)
        
        if not operation or not sweet_ids:
            return Response(
                {'error': 'Operation and sweet_ids are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        sweets = Sweet.objects.filter(id__in=sweet_ids)
        
        if operation == 'restock':
            if quantity <= 0:
                return Response(
                    {'error': 'Quantity must be positive for restock'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            updated = sweets.update(quantity=F('quantity') + quantity)
            
            return Response({
                'message': f'Restocked {updated} sweet(s) by {quantity} units each',
                'updated_count': updated
            })
        
        elif operation == 'clear_stock':
            updated = sweets.update(quantity=0)
            
            return Response({
                'message': f'Cleared stock for {updated} sweet(s)',
                'updated_count': updated
            })
        
        elif operation == 'delete':
            # Only delete sweets with zero stock
            deletable = sweets.filter(quantity=0)
            deleted_count = deletable.count()
            deletable.delete()
            
            return Response({
                'message': f'Deleted {deleted_count} sweet(s) with zero stock',
                'deleted_count': deleted_count
            })
        
        return Response(
            {'error': 'Invalid operation'},
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def sweet_categories(request):
    """
    Get all available sweet categories.
    """
    categories = Sweet.Category.choices
    return Response([
        {'value': value, 'label': label}
        for value, label in categories
    ])


class DashboardView(APIView):
    """
    Get dashboard data for admin users.
    """
    permission_classes = [permissions.IsAuthenticated]
    
    def get(self, request):
        user = request.user
        
        if not user.is_admin:
            return Response(
                {'error': 'Admin access required'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        # Today's date
        today = timezone.now().date()
        
        # Recent purchases (if you have PurchaseRecord model)
        # recent_purchases = PurchaseRecord.objects.filter(
        #     purchased_at__date=today
        # ).count()
        
        # Recent restocks (if you have RestockRecord model)
        # recent_restocks = RestockRecord.objects.filter(
        #     restocked_at__date=today
        # ).count()
        
        # Low stock alert
        low_stock_count = Sweet.objects.filter(quantity__range=(1, 10)).count()
        out_of_stock_count = Sweet.objects.filter(quantity=0).count()
        
        # Total inventory value
        total_value = Sweet.objects.aggregate(
            total=Sum(F('price') * F('quantity'))
        )['total'] or 0
        
        # Top selling sweets (if you have sales data)
        # top_selling = Sweet.objects.annotate(
        #     total_sold=Sum('purchaserecord__quantity')
        # ).order_by('-total_sold')[:5]
        
        return Response({
            'today': today.isoformat(),
            'alerts': {
                'low_stock': low_stock_count,
                'out_of_stock': out_of_stock_count,
            },
            'inventory_value': float(total_value),
            'total_sweets': Sweet.objects.count(),
            'total_available': Sweet.objects.filter(quantity__gt=0).count(),
            # 'today_purchases': recent_purchases,
            # 'today_restocks': recent_restocks,
            # 'top_selling': top_selling_data,
        })