# clases/views.py

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Clase
from .serializers import ClaseSerializer

class RegistrarClase(APIView):
    def post(self, request, *args, **kwargs):
        serializer = ClaseSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ObtenerClases(APIView):
    def get(self, request, *args, **kwargs):
        clases = Clase.objects.all()
        serializer = ClaseSerializer(clases, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
