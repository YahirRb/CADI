# pagos/views.py

from datetime import date  # Asegúrate de importar date desde datetime
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Pago
from .serializers import PagoSerializer,PagosPorVencer
from alumnos.models import Alumno
from alumnos.serializers import AlumnoSerializer
from .notificaciones.notificaciones import enviar_notificacion_a_alumno
 
from django.utils import timezone
from datetime import timedelta 

from dateutil.relativedelta import relativedelta


class RegistrarPago(APIView):
    def post(self, request, *args, **kwargs):
        # Obtener el ID del pago a realizar desde la solicitud
        id_pago = request.data.get('idPago')
        
        try:
            # Buscar el pago existente
            pago_existente = Pago.objects.get(idPago=id_pago)

            # Actualizar los campos del pago existente
            pago_existente.pago_realizado = date.today()
            pago_existente.estatus = 'pagado'  # Cambiar el estatus a 'pagado'
            pago_existente.save()   # Guardar los cambios
            nuevo_pago = Pago(
                curp=pago_existente.curp,
                idInscripcion=pago_existente.idInscripcion,
                fecha_pago=None,  # O cualquier valor que desees
                pago_realizado=None,  # El nuevo pago aún no se ha realizado
                monto=pago_existente.monto,  # O el monto que desees asignar
                estatus='pendiente',  # Nuevo estatus como pendiente
                proximo_pago=pago_existente.proximo_pago + relativedelta(months=1),  # Sumar un mes
                motivo=pago_existente.motivo  # O cualquier otro motivo que desees
            )

            nuevo_pago.save() 
            # Serializar el pago actualizado
            serializer = PagoSerializer(pago_existente)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Pago.DoesNotExist:
            return Response({'error': 'Pago no encontrado'}, status=status.HTTP_404_NOT_FOUND)

class ListarPagos(APIView):
    def get(self, request, *args, **kwargs):
        pagos = Pago.objects.all()
        serializer = PagoSerializer(pagos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ListarPagosPorCurp(APIView):
    def get(self, request, *args, **kwargs):
        try:
            curp=request.GET.get('curp')
            alumno = Alumno.objects.get(curp=curp)
            
            pagos = Pago.objects.filter(curp=curp).order_by('proximo_pago')
            alumno_serializer = AlumnoSerializer(alumno)
            pago_serializer = PagoSerializer(pagos, many=True) 
            return Response({
                'alumno': alumno_serializer.data,
                'pagos': pago_serializer.data
            }, status=status.HTTP_200_OK)
        except Alumno.DoesNotExist:
            return Response({'error': 'Alumno no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(e)
            return Response({'error': 'Alumno no encontrado'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)
        
       

class EditarPago(APIView):
    def put(self, request, id_pago, *args, **kwargs):
        try:
            pago = Pago.objects.get(id_pago=id_pago)
        except Pago.DoesNotExist:
            return Response({'error': 'Pago no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = PagoSerializer(pago, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from .models import Pago
from .serializers import PagoSerializer

class PagosPorVencerList(APIView):

    def get(self, request):
        hoy = timezone.now().date()
        fechas_vencimiento = [
            hoy,  # Incluir el mismo día
            hoy + timedelta(days=1),
            hoy + timedelta(days=3),
            hoy + timedelta(days=5),
        ]
        
        # Filtrar los pagos que están a 0, 1, 3 o 5 días de vencer
        pagos_por_vencer = Pago.objects.filter(
            proximo_pago__in=fechas_vencimiento,
            pago_realizado__isnull=True  # Filtrar pagos que no han sido realizados
        )

        mensajes = []
        for pago in pagos_por_vencer:
            # Calcular los días restantes
            dias_restantes = (pago.proximo_pago - hoy).days
            # Obtener datos del alumno
            alumno = pago.curp  # Asumiendo que curp es la relación al modelo Alumno
            clase_nombre = pago.idInscripcion.idClase.nombre  # Asegúrate de que `nombre` es el campo correcto en el modelo Clase
            if pago.pago_realizado is not None:
                continue  # Si el pago ya fue realizado, no enviar notificación
            
            if dias_restantes == 0 and pago.pago_realizado is None:
                mensaje = f"Alumno {alumno.nombre} es su último día para realizar su pago por la clase {clase_nombre}."
            else:
                mensaje = f"Alumno {alumno.nombre} le quedan {dias_restantes} días para realizar su pago por la clase {clase_nombre}."
            
            mensajes.append(mensaje)
            print(pago.estatus)
            enviar_notificacion_a_alumno(alumno.curp, mensaje)
        
        return Response(mensajes, status=status.HTTP_200_OK)

class PagosPendientesList(APIView):

    def get(self, request):
        curp=request.GET.get('curp')
        # Filtrar los pagos que no han sido realizados
        pagos_pendientes = Pago.objects.filter(estatus='pendiente',curp="2d")

        # Serializar los pagos
        serializer = PagoSerializer(pagos_pendientes, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
