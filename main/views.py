from django.shortcuts import redirect

def handle_404(request, exception):
    return redirect('/')
