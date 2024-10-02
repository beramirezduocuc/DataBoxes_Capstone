from django.shortcuts import render 


def dashboard(request):
    username = request.user.username
    context = {'username' : username}
    return render(request, 'dashboard/dashboard.html', context)


