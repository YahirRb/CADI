from django.core.management.base import BaseCommand
from clases.models import Clase

class Command(BaseCommand):
    help = 'Inserta datos en la tabla Clase'

    def handle(self, *args, **kwargs):
        clases_data = [
            {
                'nombre': 'Inglés Sabatino',
                'descripcion': 'Clases de inglés para adolescentes y adultos en horario sabatino.',
                'costo': None,
                'dias': [None],
                'horario': ['09:00-13:00']
            },
            {
                'nombre': 'Inglés Dominical',
                'descripcion': 'Clases de inglés para adolescentes y adultos en horario dominical.',
                'costo': None,
                'dias': [None],
                'horario': ['09:00-13:00']
            },
            {
                'nombre': 'Inglés para Niños (Vespertino)',
                'descripcion': 'Clases de inglés para niños en horario vespertino.',
                'costo': None,
                'dias': ['Lunes', 'Miércoles', 'Viernes', 'Martes', 'Jueves'],
                'horario': ['16:00-17:00', '16:00-17:30']
            },
            {
                'nombre': 'Música Vespertina',
                'descripcion': 'Clases de música en horario vespertino.',
                'costo': None,
                'dias': ['Lunes', 'Miércoles', 'Viernes'],
                'horario': ['17:00-18:00', '18:00-19:00']
            },
            {
                'nombre': 'Música Sabatina',
                'descripcion': 'Clases de música en horario sabatino.',
                'costo': None,
                'dias': [None],
                'horario': ['13:00-16:00']
            },
            {
                'nombre': 'Belly Dance Vespertino',
                'descripcion': 'Clases de Belly Dance en horario vespertino.',
                'costo': None,
                'dias': ['Lunes', 'Viernes'],
                'horario': ['17:00-18:00', '18:00-19:00']
            },
            {
                'nombre': 'Kung-fu Vespertino',
                'descripcion': 'Clases de Kung-fu en horario vespertino.',
                'costo': None,
                'dias': ['Martes', 'Jueves'],
                'horario': ['16:00-17:00', '17:00-18:00']
            },
            {
                'nombre': 'Club de Tareas Vespertino',
                'descripcion': 'Clases de apoyo escolar en horario vespertino.',
                'costo': None,
                'dias': ['Martes', 'Jueves'],
                'horario': ['16:00-17:00', '17:00-18:00', '18:00-19:00']
            },
            {
                'nombre': 'Área de Exactas Vespertinas',
                'descripcion': 'Clases de materias exactas en horario vespertino.',
                'costo': None,
                'dias': ['Martes', 'Jueves'],
                'horario': ['16:00-18:00', '17:00-19:00']
            },
            {
                'nombre': 'Dibujo y Pintura (Sábado)',
                'descripcion': 'Clases de dibujo y pintura para niños en horario matutino.',
                'costo': None,
                'dias': ['Sábado'],
                'horario': ['11:00-13:00']
            },
            {
                'nombre': 'Francés Matutino',
                'descripcion': 'Clases de francés en horario matutino.',
                'costo': None,
                'dias': ['Martes', 'Jueves'],
                'horario': ['09:30-11:30']
            }
        ]

        # Insertar los datos en la tabla Clase
        for clase in clases_data:
            Clase.objects.create(**clase)
            self.stdout.write(self.style.SUCCESS(f'Se ha creado la clase: {clase["nombre"]}'))
