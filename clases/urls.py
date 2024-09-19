# clases/urls.py

from django.urls import path
from .views import ObtenerClases, RegistrarClase

urlpatterns = [
    path('registrar/', RegistrarClase.as_view(), name='registrar_clase'),
    path('clases/', ObtenerClases.as_view(), name='obtener_clases'),
]
