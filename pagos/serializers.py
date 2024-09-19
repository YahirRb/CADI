from rest_framework import serializers
from .models import Pago   # Ajusta la importación si el modelo Alumno está en otro archivo
 
class PagoSerializer(serializers.ModelSerializer): 

    class Meta:
        model = Pago
        fields = ['id_pago', 'curp', 'fecha_pago', 'pago_realizado', 'monto', 'estatus', 'proximo_pago', 'motivo']
