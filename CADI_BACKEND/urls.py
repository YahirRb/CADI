 
from django.contrib import admin
from django.urls import path,include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('alumno/', include('alumnos.urls')),
    path('clase/', include('clases.urls')),
    path('pagos/', include('pagos.urls')), 
    
    path('', include('login.urls')), 
]
