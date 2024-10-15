from django.shortcuts import render 
from main.models import ClienteUsuario
import requests
from random import randrange

def dashboard(request):
    username = request.user.nombre
    cloud_ping_url = 'https://southamerica-west1-databuckets-437414.cloudfunctions.net/saludar'
    try:
        response = requests.get(cloud_ping_url)
        saludo = response.text 
    except requests.RequestException as e:
        saludo = 'error de conexion con cloud'
        
    context = {'username' : username,
                'ola' : saludo}
    return render(request, 'dashboard/dashboard.html', context)


def get_chart(request):
    serie ={}
    counter=0

    while(counter<7):
        serie.append(randrange(100,400))
    chart = {
        'xAxis':[
            {
                'type':"category",
                'data':["Lun","Mar","Mie","Jue","Vie","Sab","Dom"]
            }
        ],
        'yAxis':[
            {
                'type':"value"
            }
        ],
        'series':[
            {
                'data':serie,
                'type':"line"
            }
        ]
    }
    return render(request, 'dashboard/dashboard.html')


def bar_chart(request):
    return render(request, 'charts/bar_chart.html')

def line_chart(request):
    return render(request, 'charts/line_chart.html')



    