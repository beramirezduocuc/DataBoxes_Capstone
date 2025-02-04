from django.shortcuts import render, redirect
from django.http.response import JsonResponse
from django.utils import timezone
import json
import pandas as pd
import requests
from random import randrange
import csv
from .forms import CSVUploadForm
from django.core.files.storage import default_storage


def dashboard(request):

    username = request.user.nombre
    context = {'username' : username}
    return render(request, 'dashboard/dashboard.html', context)
 
def create_chart(request):
    username = request.user.nombre
    context = {'username' : username}
    return render(request, 'crud/create_chart.html', context)

def test(request):
    return render(request, 'test.html')
    
def line_chart(request):
    return render(request, 'charts/line_chart.html')



    