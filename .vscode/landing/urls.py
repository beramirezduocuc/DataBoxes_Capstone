from django.urls import path, include
import landing.views as views


urlpatterns = [
    path('', views.home, name='home'),
]
