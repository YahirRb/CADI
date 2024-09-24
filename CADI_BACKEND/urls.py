 
from django.contrib import admin
from django.conf import settings
from django.urls import path,include
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('alumno/', include('alumnos.urls')),
    path('clase/', include('clases.urls')),
    path('pagos/', include('pagos.urls')), 
    
    path('', include('login.urls')), 
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
