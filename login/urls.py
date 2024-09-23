from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import LogIn

urlpatterns = [
    # Ruta para el login (obtener tokens de acceso y refresco)
    path('login/',  LogIn.as_view(), name='token_obtain_pair'),

    # Ruta para refrescar el token de acceso utilizando el token de refresco
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
