"""
ASGI config for sweet_shop project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/asgi/
"""

import os
import sys
from django.core.asgi import get_asgi_application
from django.conf import settings
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from channels.security.websocket import AllowedHostsOriginValidator

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sweet_shop.settings')

# Initialize Django ASGI application early for Django models to work
django_asgi_app = get_asgi_application()

# Import WebSocket routing (optional - for real-time features)
try:
    from api.routing import websocket_urlpatterns
    from api.middleware import TokenAuthMiddleware
    
    has_websocket_support = True
    print("✅ WebSocket support enabled")
except ImportError:
    has_websocket_support = False
    websocket_urlpatterns = []
    print("ℹ️  WebSocket support disabled (install channels for real-time features)")

# Define the ASGI application with protocol routing
if has_websocket_support:
    application = ProtocolTypeRouter({
        # HTTP requests go to Django
        "http": django_asgi_app,
        
        # WebSocket requests go to Channels with authentication
        "websocket": AllowedHostsOriginValidator(
            TokenAuthMiddleware(
                URLRouter(websocket_urlpatterns)
            )
        ),
        
        # Optional: Lifespan protocol for startup/shutdown events
        "lifespan": None,
    })
else:
    # Fallback to standard ASGI without WebSocket support
    application = ProtocolTypeRouter({
        "http": django_asgi_app,
        "websocket": None,  # WebSocket not supported
    })

# Optional: Initialize Sentry for ASGI (if installed)
try:
    import sentry_sdk
    from sentry_sdk.integrations.asgi import SentryAsgiMiddleware
    from sentry_sdk.integrations.django import DjangoIntegration
    
    sentry_sdk.init(
        dsn=os.environ.get('SENTRY_DSN', ''),
        integrations=[DjangoIntegration()],
        traces_sample_rate=1.0,
        send_default_pii=True,
        environment=os.environ.get('DJANGO_ENV', 'development'),
    )
    
    # Wrap ASGI application with Sentry middleware
    application = SentryAsgiMiddleware(application)
    print("✅ Sentry ASGI middleware initialized")
except ImportError:
    pass

# Optional: Log application startup
print(f"🚀 Sweet Shop ASGI Application Started")
print(f"📁 Project Path: {BASE_DIR}")
print(f"⚙️ Settings Module: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
print(f"🌐 Debug Mode: {settings.DEBUG}")
print(f"🔌 WebSocket Support: {has_websocket_support}")
print(f"🔒 Allowed Hosts: {settings.ALLOWED_HOSTS}")