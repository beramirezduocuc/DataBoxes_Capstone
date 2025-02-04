from django.shortcuts import render
from django.http import JsonResponse
import os
# Create your views here.
def prueba_create(request):
    return render(request,'vista.html')


