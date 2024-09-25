# clases/urls.py

from django.urls import path
from .views import ObtenerClases, RegistrarClase, RegistrarPaquete, RegistrarPaqueteClases, ListarTodosLosPaquetes, EliminarClaseDelPaquete,ObtenerClasesPorCurp

urlpatterns = [
    # URLs para clases
    path('registrar/', RegistrarClase.as_view(), name='registrar_clase'),
    path('listarClases/', ObtenerClases.as_view(), name='obtener_clases'),

    # URLs para paquetes
    path('registrarPaquete/', RegistrarPaquete.as_view(), name='registrar_paquete'),
    path('registrar-clases-paquete/', RegistrarPaqueteClases.as_view(), name='registrar_paquete_clases'),
    path('listarPaquetes/', ListarTodosLosPaquetes.as_view(), name='listar_todos_los_paquetes'),
    path('eliminarClasePaquete/', EliminarClaseDelPaquete.as_view(), name='eliminar_clase_del_paquete'),
    path('clasesAlumno/', ObtenerClasesPorCurp.as_view(), name='eliminar_clase_del_paquete'),
]
