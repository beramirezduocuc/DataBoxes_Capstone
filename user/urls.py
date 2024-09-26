from django.urls import path, include
import user.views as views


urlpatterns = [
    path('login/', views.user_login, name='login'),
]
