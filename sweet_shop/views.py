"""
Custom views for error handling and other purposes.
"""
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_404(request, exception=None):
    """Custom 404 error page."""
    if request.path.startswith('/api/'):
        return JsonResponse({
            'error': 'Not Found',
            'message': 'The requested API endpoint does not exist.',
            'path': request.path,
            'status_code': 404
        }, status=404)
    
    return render(request, 'errors/404.html', status=404)


def custom_500(request, exception=None):
    """Custom 500 error page."""
    logger.error(f"Server Error: {exception}", exc_info=True)
    
    if request.path.startswith('/api/'):
        return JsonResponse({
            'error': 'Internal Server Error',
            'message': 'An unexpected error occurred. Please try again later.',
            'status_code': 500,
            'request_id': request.id if hasattr(request, 'id') else None
        }, status=500)
    
    return render(request, 'errors/500.html', status=500)


def custom_403(request, exception=None):
    """Custom 403 error page."""
    if request.path.startswith('/api/'):
        return JsonResponse({
            'error': 'Forbidden',
            'message': 'You do not have permission to access this resource.',
            'status_code': 403
        }, status=403)
    
    return render(request, 'errors/403.html', status=403)


def custom_400(request, exception=None):
    """Custom 400 error page."""
    if request.path.startswith('/api/'):
        return JsonResponse({
            'error': 'Bad Request',
            'message': 'The request could not be understood or was missing required parameters.',
            'status_code': 400
        }, status=400)
    
    return render(request, 'errors/400.html', status=400)


def api_root(request):
    """API root view."""
    return JsonResponse({
        'name': 'Sweet Shop Management System API',
        'version': '1.0.0',
        'description': 'API for managing sweet shop inventory and operations',
        'documentation': '/swagger/',
        'endpoints': {
            'authentication': '/api/auth/',
            'sweets': '/api/sweets/',
            'categories': '/api/categories/',
            'stats': '/api/stats/',
            'dashboard': '/api/dashboard/'
        }
    })


def health_check(request):
    """Health check endpoint for monitoring."""
    from django.db import connection
    from django.db.utils import OperationalError
    
    # Check database connection
    try:
        connection.ensure_connection()
        db_status = 'healthy'
    except OperationalError:
        db_status = 'unhealthy'
    
    return JsonResponse({
        'status': 'ok',
        'timestamp': '2024-12-15T10:30:00Z',  # Use actual timestamp
        'service': 'sweet-shop-api',
        'version': '1.0.0',
        'checks': {
            'database': db_status,
            'api': 'healthy'
        }
    })


def custom_exception_handler(exc, context):
    """
    Custom exception handler for DRF.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)
    
    if response is not None:
        # Customize the error response
        custom_data = {
            'success': False,
            'error': {
                'code': response.status_code,
                'message': response.data.get('detail', 'An error occurred'),
                'details': response.data if isinstance(response.data, dict) else {}
            },
            'timestamp': '2024-12-15T10:30:00Z'  # Use actual timestamp
        }
        response.data = custom_data
    
    return response