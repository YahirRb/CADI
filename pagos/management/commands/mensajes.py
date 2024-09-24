import os
import django
import schedule
import time
from django.core.management.base import BaseCommand
from pagos.models import Pago
from alumnos.models import Inscripcion
from datetime import date
from django.http import HttpRequest
from pagos.views import PagosPorVencerList

# Configurar Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "CADI_BACKEND.settings")  # Cambia esto por tu configuración
django.setup()

class Command(BaseCommand):
    help = 'Consulta y actualiza los pagos y accesos de inscripciones, y envía notificaciones.'

    def handle(self, *args, **kwargs):
        # Programar las tareas con schedule
        schedule.every(10).seconds.do(self.actualizar_accesos_inscripciones)  # Cada 10 segundos
        schedule.every(10).seconds.do(self.enviar_notificaciones_pagos_por_vencer)
        # Cada día a las 9 am

        # Bucle para mantener el programa corriendo y ejecutando las tareas programadas
        while True:
            schedule.run_pending()
            time.sleep(1)

    def actualizar_accesos_inscripciones(self):
        pagos = Pago.objects.all()  # Consulta todos los pagos
        for pago in pagos:  
            # Verifica si el pago no ha sido realizado y si la fecha del próximo pago ha pasado
            if pago.pago_realizado is None and pago.proximo_pago < date.today():
                try:
                    inscripcion = Inscripcion.objects.get(idInscripcion=pago.idInscripcion.idInscripcion)
                    
                    if inscripcion.acceso:  # Cambia a False solo si el acceso es True
                        inscripcion.acceso = False
                        inscripcion.save()
                        print(f"Inscripción {inscripcion.idInscripcion} actualizada: acceso cambiado a {inscripcion.acceso}")
                    else:
                        print(f"Inscripción {inscripcion.idInscripcion} ya tiene acceso: {inscripcion.acceso}, no se hace nada.")
                except Inscripcion.DoesNotExist:
                    print(f"No se encontró la inscripción para el pago con CURP: {pago.curp}")

                print(f"CURP: {pago.curp}, Monto: {pago.monto}, Fecha de Pago: {pago.fecha_pago}, Estatus: {pago.estatus} - Pago no realizado y acceso verificado.")

    def enviar_notificaciones_pagos_por_vencer(self):
        view = PagosPorVencerList.as_view()  # Crea una instancia de la APIView
        request = self.create_request()  # Crea un objeto de solicitud
        response = view(request)  # Llama a la APIView

        if response.status_code == 200:
            for mensaje in response.data:
                print("Notificación:", mensaje)
        else:
            print("Error en la API:", response.status_code)

    def create_request(self):
        """Crea un objeto de solicitud simulado."""
        request = HttpRequest()
        request.method = 'GET'
        return request
