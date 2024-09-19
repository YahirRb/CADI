from rest_framework import serializers
from .models import Alumno, Inscripcion, Asistencia 

 
class AlumnoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alumno
        fields = ['curp', 'nombre', 'apellidos', 'tutor', 'fechaNacimiento', 'correo', 'telefono']

class InscripcionSerializer(serializers.ModelSerializer):
     # Serializador anidado para Alumno

    class Meta:
        model = Inscripcion
        fields = ['id_inscripcion', 'id_clase', 'fecha_inscripcion', 'acceso', 'curp', 'horario']

class AsistenciaSerializer(serializers.ModelSerializer):
     # Serializador anidado para Alumno

    class Meta:
        model = Asistencia
        fields = ['id_asistencia', 'id_clase', 'curp', 'fecha', 'hora']
