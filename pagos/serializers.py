from rest_framework import serializers
from .models import Pago
from alumnos.serializers import AlumnoSerializer,InscripcionSerializer# Ajusta la importación si el modelo Alumno está en otro archivo
 
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