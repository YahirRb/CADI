# pagos/urls.py

from django.urls import path
from .views import RegistrarPago, ListarPagos, ListarPagosPorCurp, EditarPago,PagosPorVencerList,PagosPendientesList

urlpatterns = [
    path('registrar/', RegistrarPago.as_view(), name='registrar_pago'),
    path('listar/', ListarPagos.as_view(), name='listar_pagos'),
    path('curp/', ListarPagosPorCurp.as_view(), name='listar_pagos_por_curp'),
    path('editar/ ', EditarPago.as_view(), name='editar_pago'),
    path('pagos_por_vencer/', PagosPorVencerList.as_view(), name='pagos_por_vencer'),
    path('pendientes/', PagosPendientesList.as_view(), name='pagos_pendientes'), 
    
]
