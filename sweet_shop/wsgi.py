"""
WSGI config for sweet_shop project.

It exposes the WSGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.0/howto/deployment/wsgi/
"""

import os
import sys
from django.core.wsgi import get_wsgi_application
from django.conf import settings

# Add the project directory to the Python path
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
sys.path.append(BASE_DIR)

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'sweet_shop.settings')

# Initialize Django application
application = get_wsgi_application()

# Optional: Import and initialize Sentry for error tracking (if installed)
try:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration
    
    sentry_sdk.init(
        dsn=os.environ.get('SENTRY_DSN', ''),
        integrations=[DjangoIntegration()],
        traces_sample_rate=1.0,  # Adjust in production
        send_default_pii=True,
        environment=os.environ.get('DJANGO_ENV', 'development'),
    )
    print("✅ Sentry initialized for error tracking")
except ImportError:
    pass

# Optional: Initialize New Relic (if installed)
# try:
#     import newrelic.agent
#     newrelic.agent.initialize(os.path.join(BASE_DIR, 'newrelic.ini'))
#     application = newrelic.agent.wsgi_application()(application)
#     print("✅ New Relic initialized for monitoring")
# except ImportError:
#     pass

# Optional: Initialize WhiteNoise for static files
try:
    from whitenoise import WhiteNoise
    application = WhiteNoise(
        application,
        root=os.path.join(BASE_DIR, 'staticfiles'),
        prefix='static/',
        max_age=31536000,  # 1 year cache
        autorefresh=settings.DEBUG,
    )
    print("✅ WhiteNoise initialized for static files")
except ImportError:
    pass

# Optional: Log application startup
print(f"🚀 Sweet Shop WSGI Application Started")
print(f"📁 Project Path: {BASE_DIR}")
print(f"⚙️ Settings Module: {os.environ.get('DJANGO_SETTINGS_MODULE')}")
print(f"🌐 Debug Mode: {settings.DEBUG}")
print(f"🔒 Secret Key: {'Set' if settings.SECRET_KEY and settings.SECRET_KEY != 'django-insecure-default-key-change-in-production' else 'Not Set - CHANGE IN PRODUCTION!'}")