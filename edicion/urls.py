from django.urls import path, include
import edicion.views as views


urlpatterns = [
    path('crear/', views.edicion_create, name='edicion_create'),
]