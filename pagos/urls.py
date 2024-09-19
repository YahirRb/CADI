# pagos/urls.py

from django.urls import path
from .views import RegistrarPago, ListarPagos, ListarPagosPorCurp, EditarPago

urlpatterns = [
    path('registrar/', RegistrarPago.as_view(), name='registrar_pago'),
    path('list/', ListarPagos.as_view(), name='listar_pagos'),
    path('list/', ListarPagosPorCurp.as_view(), name='listar_pagos_por_curp'),
    path('editar/ ', EditarPago.as_view(), name='editar_pago'),
]
