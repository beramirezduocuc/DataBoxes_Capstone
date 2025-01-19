from django.shortcuts import redirect
from django.urls import resolve
from django.template import TemplateDoesNotExist
from django.conf import settings

class UserLoginRequiredMiddleware:

    def __init__(self, get_response):
        self.get_response = get_response
        # Lista de URLs donde no es necesario estar autenticado 
        self.login_not_required = ['user_login', 'user_register', 'home'] 

    def __call__(self, request):
        # Obtener el nombre de la URL actual
        current_url_name = resolve(request.path_info).url_name

        # Si la URL no está exenta y el usuario no está autenticado, redirigir a login
        if current_url_name not in self.login_not_required and not request.user.is_authenticated:
            return redirect('user_login')  # Redirigir a la página de login

        # Continuar con la solicitud normalmente si está autenticado o la URL está exenta
        response = self.get_response(request)
        return response

class HandleTemplateDoesNotExistMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
        except TemplateDoesNotExist:
            # Redirigir a la página de inicio si no se encuentra el template
            return redirect(settings.LANDING_PAGE_URL)  # Usa la URL que corresponda
        return response