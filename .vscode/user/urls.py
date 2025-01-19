from django.urls import path, include
import user.views as views


urlpatterns = [
    path('login/', views.user_login, name='user_login'),
    path('logout/', views.user_logout, name='logout'),
    path('register/', views.user_register, name='user_register'),
    path('modify/', views.user_modify, name='user_modify'),
]
