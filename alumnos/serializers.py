from rest_framework import serializers
from .models import Alumno, Inscripcion, Asistencia 
from clases.models import Clase

 
class AlumnoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumno
        fields = '__all__'

class InscripcionSerializer(serializers.ModelSerializer):
     # Serializador anidado para Alumno

    class Meta:
        model = Inscripcion
        fields = '__all__'

class AsistenciaSerializer(serializers.ModelSerializer):
     # Serializador anidado para Alumno

    class Meta:
        model = Asistencia
        fields = '__all__'
  # Asegúrate de que las rutas estén correctas

class ListaInscripciones(serializers.ModelSerializer):
    
    curp = serializers.CharField(source='curp.curp', read_only=True)
    nombre_alumno = serializers.CharField(source='curp.nombre', read_only=True)
    apellidos_alumno = serializers.CharField(source='curp.apellidos', read_only=True)
    nombre_clase = serializers.CharField(source='idClase.nombre', read_only=True)

    class Meta:
        model = Inscripcion
        fields = ['idInscripcion', 'nombre_alumno', 'apellidos_alumno', 'horario', 'nombre_clase','curp']
class AlumnoFotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumno
        fields = ['curp', 'foto']  # Incluye solo los campos necesarios