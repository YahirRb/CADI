from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Alumno
from .serializers import AlumnoSerializer

class AlumnoCreate(APIView):
    def post(self, request, format=None):
        serializer = AlumnoSerializer(data=request.data)
        if serializer.is_valid():
            try:
                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except Exception as e:
                return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListarAlumnos(APIView):
    def get(self, request, *args, **kwargs):
        alumnos = Alumno.objects.all()
        serializer = AlumnoSerializer(alumnos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class BuscarAlumnoPorCurp(APIView):
    def get(self, request, curp, *args, **kwargs):
        try:
            alumno = Alumno.objects.get(curp=curp)
            serializer = AlumnoSerializer(alumno)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Alumno.DoesNotExist:
            return Response({'error': 'Alumno no encontrado'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)