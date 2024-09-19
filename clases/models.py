from django.db import models 
class Clase(models.Model):
    idClase = models.BigAutoField(primary_key=True)  # "bigint" mapeado a BigAutoField para ser el ID principal
    nombre = models.CharField(max_length=255, null=False)  # "character varying" se mapea a CharField
    descripcion = models.CharField(max_length=255, null=True, blank=True)
    cupo = models.IntegerField(null=True, blank=True)  # "integer" se mapea a IntegerField
    costo = models.FloatField(null=True, blank=True)  # "real" se mapea a FloatField
    dias = models.JSONField(null=True, blank=True)  # "ARRAY" se puede mapear a JSONField en Django
    horario = models.JSONField(null=True, blank=True)  # "ARRAY" se puede mapear a JSONField también
    turno = models.TextField(null=True, blank=True)  # "text" se mapea a TextField

    def __str__(self):
        return self.nombre

 

class Paquete(models.Model):
    id_paquete = models.AutoField(primary_key=True)  # Llave primaria de tipo entero con autoincremento
    nombre = models.CharField(max_length=255)  # Campo de texto requerido
    precio_total = models.DecimalField(max_digits=10, decimal_places=2)  # Campo numérico requerido con precisión
    curp = models.ForeignKey('alumnos.Alumno', on_delete=models.SET_NULL, null=True, blank=True)  # Llave foránea a la tabla Alumnos

    class Meta:
        db_table = 'paquete'  # Nombre de la tabla en la base de datos

    def __str__(self):
        return self.nombre

class PaqueteClases(models.Model):
    id = models.AutoField(primary_key=True)  # Llave primaria de tipo entero con autoincremento
    id_paquete = models.ForeignKey(Paquete, on_delete=models.CASCADE)  # Llave foránea a Paquete
    id_clase = models.ForeignKey(Clase, on_delete=models.CASCADE)  # Llave foránea a Clase
    fecha_inscripcion = models.DateField(null=True, blank=True)  # Campo opcional para la fecha de inscripción

    class Meta:
        db_table = 'paquete_clases'  # Nombre de la tabla en la base de datos

    def __str__(self):
        return f'Paquete {self.id_paquete.nombre} - Clase {self.id_clase.nombre}'