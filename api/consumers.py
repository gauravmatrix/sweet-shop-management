"""
WebSocket consumers for real-time features.
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.tokens import AccessToken
from .models import Sweet

User = get_user_model()

class NotificationConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Authenticate user from query parameters
        token = self.scope['query_string'].decode().split('token=')[-1]
        
        try:
            access_token = AccessToken(token)
            user_id = access_token['user_id']
            self.user = await self.get_user(user_id)
            self.group_name = f'user_{user_id}'
            
            # Join user group
            await self.channel_layer.group_add(
                self.group_name,
                self.channel_name
            )
            
            await self.accept()
            await self.send(text_data=json.dumps({
                'type': 'connection_success',
                'message': 'Connected to notifications'
            }))
            
        except Exception as e:
            await self.close()

    async def disconnect(self, close_code):
        # Leave group
        if hasattr(self, 'group_name'):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        # Handle received messages
        pass

    async def send_notification(self, event):
        # Send notification to client
        await self.send(text_data=json.dumps(event['data']))

    @database_sync_to_async
    def get_user(self, user_id):
        return User.objects.get(id=user_id)


class InventoryConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = 'inventory_updates'
        
        # Join inventory group
        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )
        
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.group_name,
            self.channel_name
        )

    async def inventory_update(self, event):
        # Send inventory update to all connected clients
        await self.send(text_data=json.dumps(event['data']))