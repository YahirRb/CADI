from django.db import models
from alumnos.models import Alumno,Inscripcion
from clases.models import Clase 

class Pago(models.Model):
    idPago = models.BigAutoField(primary_key=True)  # Llave primaria de tipo big integer con autoincremento
    curp = models.ForeignKey(Alumno, on_delete=models.SET_NULL, null=True, blank=True)  # Llave foránea a Alumno
    idInscripcion=models.ForeignKey(Inscripcion, on_delete=models.SET_NULL, null=True, blank=True)
    fecha_pago = models.DateField(null=True, blank=True)  # Fecha del pago (opcional)
    pago_realizado = models.DateField(null=True, blank=True)  # Fecha en que se realizó el pago (opcional)
    monto = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)  # Monto del pago (opcional)
    estatus = models.CharField(max_length=255, null=True, blank=True)  # Estatus del pago (opcional)
    proximo_pago = models.DateField(null=True, blank=True)  # Fecha del próximo pago (opcional)
    motivo = models.TextField(null=True, blank=True)  # Motivo del pago (opcional)

    class Meta:
        db_table = 'pagos'  # Nombre de la tabla en la base de datos

    def __str__(self):
        return f'Pago {self.idPago} - CURP {self.curp}'
