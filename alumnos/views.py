from rest_framework import status

from datetime import datetime, timedelta, date
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Alumno, Inscripcion,Asistencia
from clases.serializers import PaqueteSerializer,PaqueteClasesSerializer
from pagos.models import Pago
from clases.models import Clase
from pagos.serializers import PagoSerializer
from .serializers import AlumnoSerializer, AsistenciaSerializer, InscripcionSerializer,ListaInscripciones,AlumnoFotoSerializer
from django.contrib.auth.models import User
from CADI_BACKEND.utils import supabase

from django.core.files.base import ContentFile

class AlumnoCreate(APIView):
    def post(self, request):
        alumno_data = request.data.get('alumno')
        pago_data = request.data.get('pago')  # Datos generales del pago
        inscripciones_data = request.data.get('inscripciones')

        serializerAlumno = AlumnoSerializer(data=alumno_data)

        if serializerAlumno.is_valid():
            curp = alumno_data.get('curp')
            if Alumno.objects.filter(curp=curp).exists():
                return Response({'error': 'El alumno ya está registrado.'}, status=status.HTTP_400_BAD_REQUEST)
             # Verificar si el usuario ya existe
            username = alumno_data.get('curp')  # Debes tener el campo username en los datos del alumno
            if User.objects.filter(username=username).exists():
                return Response({'error': 'El nombre de usuario ya existe.'}, status=status.HTTP_400_BAD_REQUEST)

            # Crear el usuario con auth.User
            password = alumno_data.get('correo')  # Debes recibir la contraseña del usuario
            user = User.objects.create_user(
                username=username,
                password=password,
                first_name=alumno_data.get('nombre'),
                last_name=alumno_data.get('apellidos'),  # Debes tener este campo en los datos del alumno
                email=alumno_data.get('correo'),  # Si quieres guardar el correo del alumno
            )
            alumno = serializerAlumno.save()

            if inscripciones_data:
                id_paquete = None
                if len(inscripciones_data) > 1:
                    print("Creando paquete porque hay más de una inscripción")
                    # Si hay más de una inscripción, crear un paquete
                    paquete_data = {
                        'nombre': f'Paquete de {alumno.nombre}',
                        'curp': alumno.curp,
                        'precio_total': pago_data['monto']  # El monto del paquete completo
                    }
                    serializerPaquete = PaqueteSerializer(data=paquete_data)
                    if serializerPaquete.is_valid():
                        paquete_guardado = serializerPaquete.save()
                        id_paquete = paquete_guardado.idPaquete
                    else:
                        print("Errores en el Paquete:", serializerPaquete.errors)
                        return Response({'paquete_errors': serializerPaquete.errors}, status=status.HTTP_400_BAD_REQUEST)

                # Iterar sobre todas las inscripciones
                for inscripcion_data in inscripciones_data:
                    inscripcion_data['curp'] = alumno.curp  # Asegurarse de que la CURP se asocie con el alumno
                    serializerInscripcion = InscripcionSerializer(data=inscripcion_data)
                    
                    if serializerInscripcion.is_valid():
                        inscripcion_guardada = serializerInscripcion.save()
                        id_inscripcion = inscripcion_guardada.idInscripcion  # Obtener el ID de la inscripción guardada

                        # Obtener el costo de la clase desde el modelo Clase
                        try:
                            clase = Clase.objects.get(idClase=inscripcion_data['idClase'])
                            costo_clase = clase.costo  # Obtener el costo desde el campo 'costo' de la clase
                        except Clase.DoesNotExist:
                            return Response({'error': f'Clase con id {inscripcion_data["idClase"]} no encontrada.'}, status=status.HTTP_404_NOT_FOUND)

                        # Si se creó un paquete, guardar la clase en PaqueteClases
                        if id_paquete:
                            paquete_clase_data = {
                                'idPaquete': id_paquete,
                                'idClase': inscripcion_data['idClase'],
                                'fechaInscripcion': inscripcion_data['fechaInscripcion'],
                            }
                            serializerPaqueteClase = PaqueteClasesSerializer(data=paquete_clase_data)
                            if serializerPaqueteClase.is_valid():
                                serializerPaqueteClase.save()
                            else:
                                print("Errores en PaqueteClases:", serializerPaqueteClase.errors)
                                return Response({'paquete_clases_errors': serializerPaqueteClase.errors}, status=status.HTTP_400_BAD_REQUEST)

                        # Generar el pago para esta inscripción con el costo de la clase
                        pago_data_individual = {
                            'idInscripcion': id_inscripcion,
                            'curp': alumno.curp,
                            'monto': costo_clase,  # El monto es el costo de la clase extraído del modelo Clase
                            'fecha_pago': pago_data['fecha_pago'],  # Fecha de pago
                            'pago_realizado': pago_data['pago_realizado'],  # Indicador si el pago fue realizado
                            'estatus': pago_data['estatus'],  # Estatus del pago
                            'motivo': pago_data['motivo'],  # Motivo del pago
                            'proximo_pago': pago_data['proximo_pago'],  # Próxima fecha de pago
                        }
                        serializerPago = PagoSerializer(data=pago_data_individual)
                        if serializerPago.is_valid():
                            serializerPago.save()
                        else:
                            print("Errores en Pago:", serializerPago.errors)
                            return Response({'pago_errors': serializerPago.errors}, status=status.HTTP_400_BAD_REQUEST)

                return Response(serializerAlumno.data, status=status.HTTP_201_CREATED)
            else:
                return Response({'inscripcion_errors': 'No se proporcionaron inscripciones.'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            print("Errores en Alumno:", serializerAlumno.errors)
            return Response({'alumno_errors': serializerAlumno.errors}, status=status.HTTP_400_BAD_REQUEST)


class ListarAlumnos(APIView):
    def get(self, request, *args, **kwargs):
        try:
            alumnos = Alumno.objects.all()
            serializer = AlumnoSerializer(alumnos, many=True) 
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response("Error", status=status.HTTP_400_BAD_REQUEST)

class BuscarAlumnoPorCurp(APIView):
    def get(self, request, *args, **kwargs):
        try:
            curp=request.GET.get('curp')
            
            alumno = Alumno.objects.get(curp=curp)
            serializer = AlumnoSerializer(alumno) 
            print(serializer.data)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Alumno.DoesNotExist:
            return Response({'error': 'Alumno no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        

class RegistrarInscripcion(APIView):
    def post(self, request, *args, **kwargs):
        serializer = InscripcionSerializer(data=request.data, many=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ObtenerInscripciones(APIView):
    def get(self, request, *args, **kwargs):
        inscripciones = Inscripcion.objects.all()
        serializer = InscripcionSerializer(inscripciones, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    
class ObtenerInscripcionPorId(APIView):
    def get(self, request, *args, **kwargs):
        try:
            id=request.GET.get('id')
            inscripcion = Inscripcion.objects.get(idInscripcion=id)
        except Inscripcion.DoesNotExist:
            return Response({'error': 'Inscripción no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        serializer = InscripcionSerializer(inscripcion)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ObtenerInscripcionPorCurp(APIView):
    def get(self, request, *args, **kwargs):
        curp=request.GET.get('curp')
        inscripciones = Inscripcion.objects.filter(curp=curp)
        serializer = InscripcionSerializer(inscripciones, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class ActualizarAccesoInscripcion(APIView):
    def put(self, request, *args, **kwargs):
        try:
            curp=request.GET.get('curp')
            id_clase=request.GET.get('idClase')
            inscripcion = Inscripcion.objects.get(curp=curp, idClase=id_clase)
        except Inscripcion.DoesNotExist:
            return Response({'error': 'Inscripción no encontrada'}, status=status.HTTP_404_NOT_FOUND)

        serializer = InscripcionSerializer(inscripcion, data={'acceso': request.data['nuevoAcceso']}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class EliminarInscripcion(APIView):
    def delete(self, request, curp, id_clase, *args, **kwargs):
        try:
            inscripcion = Inscripcion.objects.get(curp=curp, idClase=id_clase)
            inscripcion.delete()
            return Response({'message': 'Inscripción eliminada con éxito'}, status=status.HTTP_204_NO_CONTENT)
        except Inscripcion.DoesNotExist:
            return Response({'error': 'Inscripción no encontrada'}, status=status.HTTP_404_NOT_FOUND)
        
        


class VerificarInscripcionAPIView(APIView):
    
    def post(self, request):
        curp = request.data.get('curp')
        ids_inscripciones = request.data.get('ids_inscripciones', [])
        """
        try:
            alumno = Alumno.objects.get(curp=curp)
        except Alumno.DoesNotExist:
            return Response({"error": "Alumno no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        inscripciones = Inscripcion.objects.filter(curp=alumno, idInscripcion__in=ids_inscripciones)
        
        if not inscripciones.exists():
            return Response({"error": "No se encontraron inscripciones para el alumno y IDs proporcionados."}, status=status.HTTP_404_NOT_FOUND)

        for inscripcion in inscripciones:
            horario_clase = inscripcion.horario
            
            if isinstance(horario_clase, list):
                horario_clase = horario_clase[0] if horario_clase else None

            if horario_clase:
                inicio_str, fin_str = horario_clase.split('-')
                hora_clase_inicio = datetime.strptime(inicio_str, "%H:%M").time()
                hora_clase_fin = datetime.strptime(fin_str, "%H:%M").time()
                
                # Obtener la hora actual
                hoy = date.today()
                hora_actual = datetime.now().time()

                # Calcular la hora de inicio menos 15 minutos
                hora_clase_inicio_con_buffer = (datetime.combine(hoy, hora_clase_inicio) - timedelta(minutes=15)).time()
                hora_clase_fin_con_buffer = (datetime.combine(hoy, hora_clase_fin) - timedelta(minutes=15)).time()
                # Compara la hora actual con el rango de la clase
                if hora_clase_inicio_con_buffer <= hora_actual <= hora_clase_fin_con_buffer:
                    # Ahora verifica si el alumno está inscrito
                    if inscripcion.acceso:
                        mensaje = f"Bienvenido, estás inscrito en la clase {inscripcion.idClase.nombre}."

                        # Verifica asistencia
                        asistencia_existente = Asistencia.objects.filter(
                            curp=alumno,
                            idClase=inscripcion.idClase,
                            fecha=hoy
                        ).exists()

                        if not asistencia_existente:
                            print("entra")
                            Asistencia.objects.create(
                                curp=alumno,
                                idClase=inscripcion.idClase,
                                fecha=hoy,
                                hora=hora_actual
                            )
                            mensaje += " Tu asistencia ha sido registrada."
                        else:
                            mensaje += " Ya has registrado tu asistencia para hoy."
                    else:
                        mensaje = f"No estás inscrito en la clase {inscripcion.idClase.nombre}."
                else:
                    mensaje = "No estás en horario para registrar asistencia."
            else:
                mensaje = "No hay horarios disponibles para esta clase."

            return Response({"idInscripcion": inscripcion.idInscripcion, "mensaje": mensaje}, status=status.HTTP_200_OK)

        return Response({"error": "No se pudo procesar la solicitud."}, status=status.HTTP_400_BAD_REQUEST)
"""
 
        # Verificar si el alumno existe
        try:
            alumno = Alumno.objects.get(curp=curp)
        except Alumno.DoesNotExist:
            return Response({"error": "Alumno no encontrado."}, status=status.HTTP_404_NOT_FOUND)

        # Obtener inscripciones del alumno
        inscripciones = Inscripcion.objects.filter(curp=alumno, idInscripcion__in=ids_inscripciones)

        if not inscripciones.exists():
            return Response({"error": "No se encontraron inscripciones para el alumno y IDs proporcionados."}, status=status.HTTP_404_NOT_FOUND)

        mensajes = []

        # Obtener la hora actual
        hoy = date.today()
        hora_actual = datetime.now().time()
        acceso=False

        for inscripcion in inscripciones:
            if not inscripcion.acceso:
                mensajes.append({
                    "idInscripcion": inscripcion.idInscripcion,
                    "mensaje": f"No tienes acceso a la clase {inscripcion.idClase.nombre}."
                })
                continue  # Omitir a la siguiente inscripción

            horario_clase = inscripcion.horario
            
            if isinstance(horario_clase, list):
                horario_clase = horario_clase[0] if horario_clase else None
            
            if horario_clase:
                inicio_str, fin_str = horario_clase.split('-')
                hora_clase_inicio = datetime.strptime(inicio_str, "%H:%M").time()
                hora_clase_fin = datetime.strptime(fin_str, "%H:%M").time()

                # Calcular los márgenes de tiempo
                hora_clase_inicio_con_buffer = (datetime.combine(hoy, hora_clase_inicio) - timedelta(minutes=20)).time()
                hora_clase_fin_con_buffer = (datetime.combine(hoy, hora_clase_fin) + timedelta(minutes=20)).time()

                # Compara la hora actual con el rango de la clase
                if hora_clase_inicio_con_buffer <= hora_actual <= hora_clase_fin_con_buffer:
                    mensaje = f"Bienvenido, a la clase {inscripcion.idClase.nombre}."

                    # Verifica asistencia
                    asistencia_existente = Asistencia.objects.filter(
                        curp=alumno,
                        idClase=inscripcion.idClase,
                        fecha=hoy
                    ).exists()

                    if not asistencia_existente:
                        Asistencia.objects.create(
                            curp=alumno,
                            idClase=inscripcion.idClase,
                            fecha=hoy,
                            hora=hora_actual
                        )
                        mensaje += " Tu asistencia ha sido registrada."
                        acceso=True
                    else:
                        mensaje += " Ya has registrado tu asistencia para hoy."
                        acceso=True
                else:
                    mensaje = "No estás en horario para registrar asistencia."
            else:
                mensaje = "No hay horarios disponibles para esta clase."

            mensajes.append({"idInscripcion": inscripcion.idInscripcion, "mensaje": mensaje})

        return Response(mensajes, status=status.HTTP_200_OK)
    
    
 

class ListaInscripcionesConAcceso(APIView):
    
    def get(self, request):
        # Filtrar las inscripciones con acceso True
        inscripciones = Inscripcion.objects.filter(acceso=True)
        
        # Serializar los datos
        serializer = ListaInscripciones(inscripciones, many=True)
        
        # Devolver la respuesta en formato JSON
        return Response(serializer.data, status=status.HTTP_200_OK)


class GuardarFotoAPIView(APIView):
    def post(self, request):
        # Obtener la CURP y la foto desde el request
        curp = request.data.get('curp')
        foto = request.FILES.get('foto')  # Archivos se envían en request.FILES
        """
        # Verificar si CURP y foto se enviaron en el request
        if not curp:
            return Response({'error': 'CURP es requerida.'}, status=status.HTTP_400_BAD_REQUEST)
        
        if not foto:
            return Response({'error': 'Foto es requerida.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Buscar al alumno por la CURP
            alumno = Alumno.objects.get(curp=curp)
        except Alumno.DoesNotExist:
            return Response({'error': 'Alumno con esta CURP no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        # Obtener la extensión del archivo (ej. .jpg, .png)
        extension = os.path.splitext(foto.name)[1]

        # Crear el nuevo nombre de archivo usando la CURP
        nuevo_nombre = f"{curp}{extension}"

        # Guardar la foto con el nuevo nombre
        path = default_storage.save(f'images/{nuevo_nombre}', ContentFile(foto.read()))

        # Actualizar el campo 'foto' del alumno
        alumno.foto = path
        alumno.save()

        return Response({'message': 'Foto actualizada exitosamente.'}, status=status.HTTP_200_OK)
        """
           # Asegúrate de que el campo de archivo se llama 'image'

        if not foto:
            return Response({"error": "No se ha proporcionado ninguna imagen."}, status=status.HTTP_400_BAD_REQUEST)

        # Define la ruta donde se almacenará la imagen en Supabase
        path_on_supastorage = f"images/{curp}.png"  # Puedes personalizar la ruta si lo deseas

        try:
            # Sube la imagen al bucket usando el contenido del archivo
            res = supabase.storage.from_('cadi').upload(
                path_on_supastorage,
                file=foto.read(),  # Lee el contenido del archivo
                file_options={"content-type": foto.content_type}  # Establece el tipo de contenido
            )

             
            # Actualiza el modelo Alumno para guardar la ruta de la imagen
            alumno = Alumno.objects.get(curp=curp)  # Asegúrate de que el CURP existe en la base de datos
            alumno.foto = path_on_supastorage  # Guarda la ruta de la imagen en el campo 'foto'
            alumno.save()  # Guarda los cambios en la base de datos

            return Response({"message": f"Imagen '{foto.name}' subida exitosamente!", "path": path_on_supastorage}, status=status.HTTP_201_CREATED)

        except Exception as e:
            # Manejo de errores si la subida falla
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)



class AlumnoFotoView(APIView):
    def get(self, request, format=None):
        """try:
            curp=request.GET.get('curp')
            # Buscar el alumno por CURP
            alumno = Alumno.objects.get(curp=curp)

            # Verificar si el alumno tiene una foto guardada
            if not alumno.foto:
                return Response({"detail": "El alumno no tiene una foto registrada."}, status=status.HTTP_404_NOT_FOUND)

            # Obtener la ruta completa de la imagen
            foto_path = alumno.foto.path
            # Verificar si la foto existe en el sistema de archivos
            if not os.path.exists(foto_path):
                return Response({"detail": "La foto no fue encontrada en el servidor."}, status=status.HTTP_404_NOT_FOUND)

            # Devolver la URL completa de la imagen
            foto_url = request.build_absolute_uri(alumno.foto.url)
            return Response({"foto_url": foto_path}, status=status.HTTP_200_OK)

        except Alumno.DoesNotExist:
            raise Http404("Alumno no encontrado.")
        except Exception as e:
            print(e)
            return Response("error")"""
        curp = request.GET.get('curp')
        if not curp:
            return Response({"error": "CURP no proporcionado."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Busca el alumno por CURP
            alumno = Alumno.objects.get(curp=curp)  # Asegúrate de que el CURP existe en la base de datos

            # Obtiene la ruta de la imagen desde el campo 'foto'
            image_path = alumno.foto

            # Define la ruta del archivo en Supabase
            source = f"https://hzgjuagwofztyqtsvrgt.supabase.co/storage/v1/object/public/cadi/{image_path}"  # Cambia esto al nombre de la imagen que deseas descargar
            print(source)
            return Response(source)
        except Alumno.DoesNotExist:
            return Response({"error": "Alumno no encontrado."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            # Manejo de errores si la descarga falla
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        
        


