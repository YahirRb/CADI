from django.urls import re_path
from pagos.notificaciones import consumers 
websocket_urlpatterns=[
    
    re_path(r'ws/notificaciones/(?P<curp>\w+)/$', consumers.NotificationConsumer.as_asgi()),
    #re_path(r'ws/notificaciones/', consumers.NotificationConsumer.as_asgi()),
]