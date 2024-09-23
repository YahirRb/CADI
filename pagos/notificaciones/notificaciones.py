from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

def enviar_notificacion_a_alumno(curp, mensaje):
    print(f"Enviando notificación a {curp}: {mensaje}")
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        f"grupo_{curp}",  # El grupo específico del alumno basado en su CURP
        {
            "type": "notificacion_message",
            "text": mensaje,
        }
    )

    """
def enviar_notificacion_a_alumno(mensaje):
    print(f"Enviando notificación: {mensaje}")
    channel_layer = get_channel_layer()
    # Aquí puedes usar un nombre de grupo fijo o dinámico si es necesario
    group_name = "notificaciones"  # O el nombre que decidas usar

    async_to_sync(channel_layer.group_send)(
        group_name,
        {
            "type": "notificacion_message",
            "text": mensaje,
        }
    )"""