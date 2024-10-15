from .models import *
from django.contrib import admin

admin.site.register(Pais)
admin.site.register(Ejecutivo)
admin.site.register(Cliente)
admin.site.register(ClienteUsuario)
admin.site.register(Objetivo)
admin.site.register(ObjetivoConfig)
admin.site.register(ClienteMapaClienteObjetivo)
admin.site.register(DatosBucketsOutliers)
admin.site.register(ParametrosIniciales)
admin.site.register(Procesado)

