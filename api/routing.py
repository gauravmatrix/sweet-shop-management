"""
WebSocket routing for real-time features.
"""
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    # Real-time notifications
    re_path(r'ws/notifications/$', consumers.NotificationConsumer.as_asgi()),
    
    # Real-time inventory updates
    re_path(r'ws/inventory/$', consumers.InventoryConsumer.as_asgi()),
    
    # Real-time purchase updates
    re_path(r'ws/purchases/$', consumers.PurchaseConsumer.as_asgi()),
]