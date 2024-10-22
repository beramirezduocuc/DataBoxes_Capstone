from django.urls import path
import dashboard.views as views


urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('line_chart/', views.line_chart, name='line_chart'),
    path('get_chart/', views.get_chart, name='get_chart'),
    path('create_chart/', views.create_chart, name='create_chart'),
    path('coin/', views.get_coin_data, name='coin'),

]
