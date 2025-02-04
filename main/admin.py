from django.contrib import admin
from .models import usuario, membresia

class UsuarioAdmin(admin.ModelAdmin):
    list_display = ('usuario_id', 'nombre', 'correo', 'is_active', 'is_staff')  # Muestra estos campos en la lista
    search_fields = ('nombre', 'correo')  # Permite la búsqueda por nombre y correo
    list_filter = ('is_active', 'is_staff')  # Filtros para el estado activo y permisos de staff
    ordering = ('-usuario_id',)  # Ordenar por id de usuario de forma descendente

class MembresiaAdmin(admin.ModelAdmin):
    list_display = ('id_membresia', 'nombre_membresia', 'fecha_creacion', 'fecha_expiracion')
    search_fields = ('nombre_membresia',)  # Permite buscar por nombre de membresía
    list_filter = ('fecha_creacion', 'fecha_expiracion')  # Filtros para las fechas de creación y expiración
    ordering = ('-fecha_creacion',)  # Ordenar por fecha de creación de manera descendente

# Registrar los modelos en el panel de administración
admin.site.register(usuario, UsuarioAdmin)
admin.site.register(membresia, MembresiaAdmin)

