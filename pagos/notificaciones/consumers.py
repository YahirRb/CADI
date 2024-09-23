import json
from channels.generic.websocket import WebsocketConsumer
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
 
class NotificationConsumer(WebsocketConsumer):
    def connect(self):
        self.curp = self.scope['url_route']['kwargs']['curp']
        self.group_name = f"grupo_{self.curp}"  # Grupo específico por CURP

        # Añadir al grupo
        async_to_sync(self.channel_layer.group_add)(
            self.group_name,
            self.channel_name
        )
        self.accept()

        # Enviar un mensaje de bienvenida
        self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Te has conectado al canal de notificaciones.'
        }))

    def disconnect(self, close_code):
        # Retirar del grupo al desconectarse
        async_to_sync(self.channel_layer.group_discard)(
            self.group_name,
            self.channel_name
        )

    def receive(self, text_data):
        # Recibir un mensaje y reenviarlo al grupo
        async_to_sync(self.channel_layer.group_send)(
            self.group_name,
            {
                "type": "notificacion_message",
                "text": text_data or "Mensaje de prueba recibido",  # Mensaje de prueba
            }
        )

    def notificacion_message(self, event):
        # Enviar el mensaje a WebSocket
        self.send(text_data=json.dumps({
            'message': event["text"]
        }))