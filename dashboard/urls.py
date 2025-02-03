from django.urls import path
import dashboard.views as views


urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('create_chart/', views.create_chart, name='create_chart'),
    path('test/', views.test, name='test')
]
#Eliminar coin mas tarde, era solo test