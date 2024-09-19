# pagos/views.py

from datetime import date  # Asegúrate de importar date desde datetime
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Pago
from .serializers import PagoSerializer
from alumnos.models import Alumno
from alumnos.serializers import AlumnoSerializer

class RegistrarPago(APIView):
    def post(self, request, *args, **kwargs):
        datos_pago = request.data
        datos_pago['pago_realizado'] = datos_pago.get('pago_realizado', None) or date.today().strftime('%Y-%m-%d')
        
        serializer = PagoSerializer(data=datos_pago)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ListarPagos(APIView):
    def get(self, request, *args, **kwargs):
        pagos = Pago.objects.all()
        serializer = PagoSerializer(pagos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ListarPagosPorCurp(APIView):
    def get(self, request, curp, *args, **kwargs):
        try:
            alumno = Alumno.objects.get(curp=curp)
        except Alumno.DoesNotExist:
            return Response({'error': 'Alumno no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        
        pagos = Pago.objects.filter(curp=curp).order_by('-proximo_pago')
        alumno_serializer = AlumnoSerializer(alumno)
        pago_serializer = PagoSerializer(pagos, many=True)
        
        return Response({
            'alumno': alumno_serializer.data,
            'pagos': pago_serializer.data
        }, status=status.HTTP_200_OK)

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
