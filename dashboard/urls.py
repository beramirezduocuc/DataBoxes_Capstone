from django.urls import path
import dashboard.views as views


urlpatterns = [
    path('', views.dashboard, name='dashboard'),
<<<<<<< HEAD
    path('line_chart/', views.line_chart, name='line_chart'),
    path('get_chart/', views.get_chart, name='get_chart'),
    path('create_chart/', views.create_chart, name='create_chart'),
    path('temp_csv/', views.upload_csv, name="upload_csv"),                                                    
    path('coin/', views.get_coin_data, name='coin'),
    path('filtrar_data', views.filtrar_datos, name='filtrar_datos')
=======
    path('create_chart/', views.create_chart, name='create_chart'),
    path('test/', views.test, name='test')
>>>>>>> desarrollo_2
]
#Eliminar coin mas tarde, era solo test