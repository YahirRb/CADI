# clases/views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Clase,Paquete,PaqueteClases
from .serializers import ClaseSerializer,PaqueteClasesSerializer,PaqueteSerializer
from alumnos.models import Inscripcion
from alumnos.serializers import InscripcionSerializer
from pagos.serializers import PagoSerializer

class RegistrarClase(APIView):
    def post(self, request, *args, **kwargs):
        datosPaquete=request.data.get('paquete')
        print("#3333333333333333333333333333333333333333333")
        print(datosPaquete)
        serializer = ClaseSerializer(data=datosPaquete)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ObtenerClases(APIView):
    def get(self, request, *args, **kwargs):
        clases = Clase.objects.all()
        serializer = ClaseSerializer(clases, many=True)
        print(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class RegistrarPaquete(APIView):
    def post(self, request, *args, **kwargs):
        paquete = request.data.get('paquete')
        clasesSeleccionadas = request.data.get('clasesSeleccionadas')
        listaPagos = request.data.get('listaPagos')
        datosInscripciones = request.data.get('datosInscripciones')

        paquete_existente = Paquete.objects.filter(curp=paquete.get('curp')).first()
        if paquete_existente:
            # 2. Si el paquete ya existe, obtener las clases ya asociadas con el paquete
            clases_existentes = PaqueteClases.objects.filter(idPaquete=paquete_existente.idPaquete).values_list('idClase', flat=True)

            # Filtrar las clases a registrar para evitar duplicados
            clases_para_registrar = []
            for clase in clasesSeleccionadas:
                clase_id = clase.get('idClase')
                if clase_id not in clases_existentes:
                    clases_para_registrar.append({
                        'idPaquete': paquete_existente.idPaquete,
                        'idClase': clase_id
                    })

                    # Imprimir los datos de la clase
                    print(f"Clase a registrar: ID={clase_id}, Nombre={clase.get('nombre')}, Precio={clase.get('precio')}, Horario={clase.get('horario')}")

            if clases_para_registrar:
                paquete_clases_serializer = PaqueteClasesSerializer(data=clases_para_registrar, many=True)
                if paquete_clases_serializer.is_valid():
                    paquete_clases_serializer.save()
                else:
                    print("Errores en el serializer de PaqueteClases:", paquete_clases_serializer.errors)

            # **VERIFICAR SI YA EXISTE LA INSCRIPCIÓN**
            inscripciones_para_registrar = []
            inscripciones_dict = {}
            for inscripcion_data in datosInscripciones:
                curp = inscripcion_data.get('curp')
                idClase = inscripcion_data.get('idClase')

                # Verificar si la inscripción ya existe
                inscripcion_existente = Inscripcion.objects.filter(curp=curp, idClase=idClase).first()

                if not inscripcion_existente:
                    # Si no existe, agregar a la lista para registrar
                    inscripciones_para_registrar.append(inscripcion_data)
                else:
                    # Si ya existe, omitir la inscripción
                    print(f"Inscripción existente para CURP {curp} y Clase {idClase}. Saltando registro.")

            # Registrar las inscripciones nuevas
            if inscripciones_para_registrar:
                inscripcion_serializer = InscripcionSerializer(data=inscripciones_para_registrar, many=True)
                if inscripcion_serializer.is_valid():
                    inscripciones_registradas = inscripcion_serializer.save()

                    # Mapear la inscripción registrada con el idClase para asociar con los pagos
                    inscripciones_dict = {inscripcion.idClase.idClase: inscripcion.idInscripcion for inscripcion in inscripciones_registradas}

                    for inscripcion in inscripciones_registradas:
                        print(f"Inscripción registrada: ID={inscripcion.idInscripcion}, Clase={inscripcion.idClase.idClase}")
                else:
                    print("Errores en el serializer de Inscripciones:", inscripcion_serializer.errors)
                    return Response(inscripcion_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # Registrar pagos SOLO para las inscripciones nuevas
            pagos_actualizados = []
            for pago in listaPagos:
                clase_id = pago.get('idClase')
                if clase_id in inscripciones_dict:  # Solo si hay una nueva inscripción para esa clase
                    pago['idInscripcion'] = inscripciones_dict[clase_id]
                    pagos_actualizados.append(pago)

            # Guardar los pagos actualizados si hay alguno
            if pagos_actualizados:
                pago_serializer = PagoSerializer(data=pagos_actualizados, many=True)
                if pago_serializer.is_valid():
                    print("Guardando pagos...")
                    pago_serializer.save()
                else:
                    print("Errores en el serializer de Pago:", pago_serializer.errors)

            return Response({'idPaquete': paquete_existente.idPaquete}, status=status.HTTP_200_OK)

        # 3. Si no existe, registrar el nuevo paquete

# 3. Si no existe, registrar el nuevo paquete

        # 3. Si no existe, registrar el nuevo paquete
        paquete_serializer = PaqueteSerializer(data=paquete)
        if paquete_serializer.is_valid():
            paqueteRegistro = paquete_serializer.save()
            print("Paquete registrado con ID:", paqueteRegistro.idPaquete)

            inscripciones_registradas = []
            inscripciones_omitidas = []

            # 1. Registrar inscripciones
            for inscripcion in datosInscripciones:
                curp = inscripcion.get('curp')
                id_clase = inscripcion.get('idClase')

                # Verificar si ya existe una inscripción con la misma CURP y idClase
                inscripcion_existente = Inscripcion.objects.filter(curp=curp, idClase=id_clase).first()

                if inscripcion_existente:
                    print(f"La CURP {curp} ya está inscrita en la clase con ID {id_clase}.")
                    inscripciones_omitidas.append(inscripcion_existente)
                else:
                    inscripcion_serializer = InscripcionSerializer(data=inscripcion)
                    if inscripcion_serializer.is_valid():
                        inscripcion_guardada = inscripcion_serializer.save()
                        inscripciones_registradas.append(inscripcion_guardada)
                    else:
                        print("Errores en el serializer de Inscripciones:", inscripcion_serializer.errors)
                        return Response(inscripcion_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 2. Verificar si se registraron inscripciones
            if not inscripciones_registradas:
                return Response({"error": "No se registraron nuevas inscripciones."}, status=status.HTTP_400_BAD_REQUEST)

            # 3. Registrar pagos con ID de inscripción
            pagos_actualizados = []
            for pago in listaPagos:
                clase_id = pago.get('idClase')

                # Buscar la inscripción correspondiente
                inscripcion_asociada = next((inscripcion for inscripcion in inscripciones_registradas if inscripcion.idClase.idClase == clase_id), None)

                if inscripcion_asociada:
                    pago['idInscripcion'] = inscripcion_asociada.idInscripcion
                    pago['monto'] = pago.get('monto')  # Asegurarse de que el monto está correctamente configurado
                    pagos_actualizados.append(pago)

            print(f"Pagos actualizados: {pagos_actualizados}")

            # Guardar los pagos
            if pagos_actualizados:
                pago_serializer = PagoSerializer(data=pagos_actualizados, many=True)
                if pago_serializer.is_valid():
                    print("Guardando pagos")
                    pago_serializer.save()
                else:
                    print("Errores en el serializer de Pago:", pago_serializer.errors)
                    return Response(pago_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

            # 4. Registrar las clases en el paquete (PaqueteClases)
            clases_para_registrar = []
            for clase in clasesSeleccionadas:
                clase_id = clase.get('idClase')
                clases_para_registrar.append({
                    'idPaquete': paqueteRegistro.idPaquete,
                    'idClase': clase_id
                })

            if clases_para_registrar:
                paquete_clases_serializer = PaqueteClasesSerializer(data=clases_para_registrar, many=True)
                if paquete_clases_serializer.is_valid():
                    paquete_clases_serializer.save()
                else:
                    print("Errores en el serializer de PaqueteClases:", paquete_clases_serializer.errors)

            return Response({'idPaquete': paqueteRegistro.idPaquete}, status=status.HTTP_201_CREATED)
        else:
            print("Errores en el serializer de Paquete:", paquete_serializer.errors)
            return Response(paquete_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegistrarPaqueteClases(APIView):
    def post(self, request , *args, **kwargs):
        paquete_id=request.data.get('paquete_id')
        clases_seleccionadas = request.data.get('clasesSeleccionadas', [])
        clases_para_registrar = []
        print(paquete_id)
        print(clases_seleccionadas)
        for clase in clases_seleccionadas:
            clase_id = clase.get('idClase')
            if not PaqueteClases.objects.filter(idPaquete=paquete_id, idClase=clase_id).exists():
                clases_para_registrar.append({'idPaquete': paquete_id, 'idClase': clase_id})

        if clases_para_registrar:
            serializer = PaqueteClasesSerializer(data=clases_para_registrar, many=True)
            if serializer.is_valid():
                serializer.save()
                return Response({'mensaje': 'Clases registradas con éxito'}, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({'mensaje': 'No hay clases para registrar'}, status=status.HTTP_204_NO_CONTENT)
    

class ListarTodosLosPaquetes(APIView):
    def get(self, request, *args, **kwargs):
        paquetes = Paquete.objects.all()
        serializer = PaqueteSerializer(paquetes, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class EliminarClaseDelPaquete(APIView):
    def delete(self, request, id_clase, curp):
        try:
            # Obtener el ID del paquete basado en el CURP
            paquete = Paquete.objects.get(curp=curp)
            id_paquete = paquete.idPaquete

            # Eliminar la clase del paquete
            PaqueteClases.objects.filter(idClase=id_clase, idPaquete=id_paquete).delete()

            return Response({"message": "Clase eliminada del paquete exitosamente"}, status=status.HTTP_204_NO_CONTENT)
        except Paquete.DoesNotExist:
            return Response({"error": "Paquete no encontrado"}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
