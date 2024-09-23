
from django.urls import path
from .views import AlumnoCreate, ListarAlumnos, BuscarAlumnoPorCurp,RegistrarInscripcion, ObtenerInscripciones, ObtenerInscripcionPorId, ObtenerInscripcionPorCurp, ActualizarAccesoInscripcion, EliminarInscripcion,VerificarInscripcionAPIView,ListaInscripcionesConAcceso,GuardarFotoAPIView,AlumnoFotoView

urlpatterns = [
    path('registrar/', AlumnoCreate.as_view(), name='alumno-create'),
    path('alumnos/', ListarAlumnos.as_view(), name='listar_alumnos'),
    path('buscarCurp/', BuscarAlumnoPorCurp.as_view(), name='buscar_alumno_por_curp'),
    path('inscripcion/', RegistrarInscripcion.as_view(), name='registrar-inscripcion'),
    path('listarInscripciones/', ObtenerInscripciones.as_view(), name='obtener-inscripciones'),
    path('inscripcionID/', ObtenerInscripcionPorId.as_view(), name='obtener-inscripcion-por-id'),
    path('inscripcionCurp/', ObtenerInscripcionPorCurp.as_view(), name='obtener-inscripcion-por-curp'),
    path('actualizarAcceso/', ActualizarAccesoInscripcion.as_view(), name='actualizar-acceso-inscripcion'),
    path('eliminarInscripcion/', EliminarInscripcion.as_view(), name='eliminar-inscripcion'),
    
    path('asistencia/', VerificarInscripcionAPIView.as_view(), name='asistencia'),
    
    path('inscripcionesAcceso/', ListaInscripcionesConAcceso.as_view(), name='inscripciones'),
    
    path('enviarFoto/', GuardarFotoAPIView.as_view(), name='x'), 
    
    path('foto/', AlumnoFotoView.as_view(), name='foto-alumno'), 
    

]
