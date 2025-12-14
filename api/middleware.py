"""
Custom middleware for WebSocket authentication.
"""
from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.tokens import AccessToken
from urllib.parse import parse_qs

User = get_user_model()

class TokenAuthMiddleware:
    """
    Custom middleware for JWT token authentication in WebSockets.
    """
    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        # Parse query string for token
        query_string = parse_qs(scope['query_string'].decode())
        token = query_string.get('token', [None])[0]
        
        if token:
            try:
                access_token = AccessToken(token)
                scope['user'] = await self.get_user(access_token['user_id'])
            except:
                scope['user'] = AnonymousUser()
        else:
            scope['user'] = AnonymousUser()
        
        return await self.app(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        try:
            return User.objects.get(id=user_id)
        except User.DoesNotExist:
            return AnonymousUser()


def TokenAuthMiddlewareStack(app):
    return TokenAuthMiddleware(AuthMiddlewareStack(app))