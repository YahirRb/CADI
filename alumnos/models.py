from django.db import models 

class Alumno(models.Model):
    curp = models.CharField(max_length=18, null=False,primary_key=True)  # "character varying" se mapea a CharField
    nombre = models.CharField(max_length=255, null=True, blank=True)
    apellidos = models.CharField(max_length=255, null=False)
    tutor = models.CharField(max_length=255, null=True, blank=True)  # "YES" en "is_nullable" significa que puede ser null
    fechaNacimiento = models.DateField(null=True, blank=True)  # "date" mapeado a DateField
    correo = models.EmailField(max_length=255, null=True, blank=True)  # Correo es mejor representado con EmailField
    telefono = models.DecimalField(max_digits=10, decimal_places=0, null=True, blank=True)  # "numeric" mapeado a 

    def __str__(self):
        return f"{self.nombre} {self.apellidos}"
 

class Inscripcion(models.Model):
    id_inscripcion = models.AutoField(primary_key=True)  # Llave primaria de tipo entero con autoincremento
    id_clase = models.ForeignKey('clases.Clase', on_delete=models.SET_NULL, null=True, blank=True)  # Llave foránea a la tabla Clase
    fecha_inscripcion = models.DateField()  # Campo obligatorio de fecha
    acceso = models.BooleanField(default=True, null=True, blank=True)  # Campo booleano, con valor por defecto True
    curp = models.ForeignKey(Alumno, on_delete=models.SET_NULL, null=True, blank=True)  # Llave foránea a la tabla Alumnos
    horario = models.TextField(null=True, blank=True)  # Campo de texto opcional para el horario

    class Meta:
        db_table = 'inscripcion'  # Nombre de la tabla en la base de datos

    def __str__(self):
        return f'Inscripción {self.id_inscripcion} - Clase {self.id_clase}'

from django.db import models  # Importar el modelo Alumno
from clases.models import Clase    # Importar el modelo Clase

class Asistencia(models.Model):
    id_asistencia = models.BigAutoField(primary_key=True)  # Llave primaria de tipo big integer con autoincremento
    id_clase = models.ForeignKey('clases.Clase', on_delete=models.CASCADE)  # Llave foránea a Clase
    curp = models.ForeignKey(Alumno, on_delete=models.SET_NULL, null=True, blank=True)  # Llave foránea a Alumno
    fecha = models.DateField(null=True, blank=True)  # Fecha de la asistencia (opcional)
    hora = models.TimeField(null=True, blank=True)  # Hora de la asistencia (opcional)

    class Meta:
        db_table = 'asistencia'  # Nombre de la tabla en la base de datos

    def __str__(self):
        return f'Asistencia {self.id_asistencia} - CURP {self.curp} - Clase {self.id_clase}'
