from django.contrib.auth import authenticate, login, logout, update_session_auth_hash
from main.models import usuario
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.shortcuts import render, redirect
from django.db.utils import IntegrityError
from .forms import CreateUserForm, CustomSetPasswordForm
from django.contrib.auth.forms import SetPasswordForm

# CRUD

def carrito(request):
    return render(request, 'dashboard/dashboard.html')

def user_login(request):
    if request.method == 'POST':
        correo = request.POST['correo']  
        password = request.POST['password']  
        user = authenticate(request, correo=correo, password=password) 
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            messages.error(request, ("Usuario o contraseña incorrectos"))
            return redirect('user_login')
        
    else:
        return render(request, 'login/login.html', {})

def user_logout(request):
    logout(request)
    return redirect('home')

def user_register(request):
    form = CreateUserForm()
    if request.method == 'POST':
        form = CreateUserForm(request.POST)
        if form.is_valid():
            correo = form.cleaned_data['correo'] 
            if usuario.objects.filter(correo=correo).exists():  
                form.add_error('correo', 'Este correo electrónico ya está registrado.')  
            else:
                try:
                    user = form.save()
                    login(request, user)
                    return redirect('home')
                except IntegrityError:
                    pass  
                    
    return render(request, 'CUD/register.html', {'form': form})

@login_required
def user_modify(request):
    if request.method == 'POST':
        form = CustomSetPasswordForm(user=request.user, data=request.POST)
        if form.is_valid():
            form.save()  # Guarda la nueva contraseña sin pedir la antigua
            update_session_auth_hash(request, form.user)  # Mantiene al usuario autenticado
            return redirect('home')
    else:
        form = CustomSetPasswordForm(user=request.user)

    return render(request, 'CUD/modify.html', {'form': form})
