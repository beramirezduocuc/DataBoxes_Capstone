def user_data(request):
    return {
        'username': request.user.nombre if request.user.is_authenticated else ''
    }