from rest_framework import serializers
from .models import Clase, Paquete, PaqueteClases

class ClaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Clase
        fields = '__all__'

class PaqueteSerializer(serializers.ModelSerializer): # Serializador anidado para Alumno

    class Meta:
        model = Paquete
        fields = '__all__'

class PaqueteClasesSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = PaqueteClases
        fields = '__all__'
        
class DatoClaseSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Clase
        fields = ['idClase','nombre']
        
