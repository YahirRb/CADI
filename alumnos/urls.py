
from django.urls import path
from .views import AlumnoCreate, ListarAlumnos, BuscarAlumnoPorCurp

urlpatterns = [
    path('registrar/', AlumnoCreate.as_view(), name='alumno-create'),
    path('alumnos/', ListarAlumnos.as_view(), name='listar_alumnos'),
    path('buscarCurp/', BuscarAlumnoPorCurp.as_view(), name='buscar_alumno_por_curp'),
]
