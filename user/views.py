from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages


def user_login(request):
    #Explicacion de esta vista:
    #Si el method es POST, pide username y password, los autentica. Si es que corresponden a un usuario en la base, lo logea y lo manda al home
    #De lo contrario lo manda al login y le muestra un mensaje. SI ES QUE el metodo no es POST (Carga inicial o recarga de pagina x ejemplo), 
    #simplemente muestra la pagina.
    if request.method == 'POST':
        username = request.POST['username']
        passsword = request.POST['password']
        user = authenticate(request, username=username, password=passsword)
        if user is not None :
            login(request, user)
            return redirect('home')
        else: 
            messages.error(request, ("Usuario o contraseña incorrectos"))
            return redirect('user_login')
        
    else:
        return render(request, 'login/login.html', {})
