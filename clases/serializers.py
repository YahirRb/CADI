from rest_framework import serializers
from .models import Clase, Paquete, PaqueteClases

class ClaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clase
        fields = ['idClase', 'nombre', 'descripcion', 'cupo', 'costo', 'dias', 'horario', 'turno']

class PaqueteSerializer(serializers.ModelSerializer): # Serializador anidado para Alumno

    class Meta:
        model = Paquete
        fields = ['id_paquete', 'nombre', 'precio_total', 'curp']

class PaqueteClasesSerializer(serializers.ModelSerializer):
    id_paquete = PaqueteSerializer()  # Serializador anidado para Paquete
    id_clase = ClaseSerializer()      # Serializador anidado para Clase

    class Meta:
        model = PaqueteClases
        fields = ['id', 'id_paquete', 'id_clase', 'fecha_inscripcion']