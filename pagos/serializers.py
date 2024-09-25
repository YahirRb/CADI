from rest_framework import serializers
from .models import Pago
from alumnos.serializers import AlumnoSerializer,InscripcionSerializer,AlumnoNombreSerializer,InscripcionClaseSerializer# Ajusta la importación si el modelo Alumno está en 
from clases.serializers import DatoClaseSerializer
 
class PagoSerializer(serializers.ModelSerializer): 

    class Meta:
        model = Pago
        fields = '__all__'
class PagosPorVencer(serializers.ModelSerializer):
    alumno = AlumnoSerializer(source='curp')
    inscripcion = InscripcionSerializer(source='idInscripcion')

    class Meta:
        model = Pago
        fields = ['idPago', 'monto', 'estatus', 'fecha_pago', 'pago_realizado', 'proximo_pago', 'alumno', 'inscripcion']

class PagosConDetallesSerializer(serializers.ModelSerializer):
    alumno = AlumnoNombreSerializer(source='idInscripcion.curp')  # Detalles del alumno a través de la inscripción
    inscripcion = InscripcionClaseSerializer(source='idInscripcion')  # Detalles de la inscripción
    clase = DatoClaseSerializer(source='idInscripcion.idClase')  # Accede a la clase a través de la inscripción

    class Meta:
        model = Pago
        fields = ['idPago', 'monto', 'estatus', 'fecha_pago', 'pago_realizado', 'proximo_pago', 'alumno', 'inscripcion', 'clase']