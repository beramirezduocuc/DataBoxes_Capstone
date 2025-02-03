from django.urls import path, include
import prueba.views as views


urlpatterns = [
    path('test/', views.prueba_create, name='prueba_create'),
]