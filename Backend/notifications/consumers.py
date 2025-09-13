from channels.generic.websocket import WebsocketConsumer
import json
from asgiref.sync import async_to_sync
from urllib.parse import parse_qs

class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        query_string = self.scope['query_string'].decode()
        query_params = parse_qs(query_string)
        token_key = query_params.get('token', [None])[0]

        if not token_key:
            self.close()
            return

        try:
            # Import Token here (Django settings are ready now)
            from rest_framework.authtoken.models import Token
            token = Token.objects.get(key=token_key)
            self.user = token.user
        except Token.DoesNotExist:
            self.close()
            return

        self.group_name = f'notifications_{self.user.id}'
        async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
        self.accept()

    def disconnect(self, close_code):
        if hasattr(self, 'group_name'):
            async_to_sync(self.channel_layer.group_discard)(self.group_name, self.channel_name)

    def notification_message(self, event):
        self.send(text_data=json.dumps(event['notification']))
