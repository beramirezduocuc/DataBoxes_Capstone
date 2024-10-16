from django.shortcuts import render 
from main.models import ClienteUsuario
from django.http.response import JsonResponse
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


def get_chart(_request):
    colors = ['blue', 'orange', 'red', 'black', 'yellow', 'green', 'magenta', 'lightblue', 'purple', 'brown']
    random_color = colors[randrange(0, (len(colors)-1))]

    serie = []
    counter = 0

    while (counter < 7):
        serie.append(randrange(100, 400))
        counter += 1

    chart = {
        'grid': {
            'left':'0%',
            'right':'0%',
            'top':'5%',
            'bottom':'0%',
            'containLabel': 'true'
        },
        'tooltip': {
            'show': True,
            'trigger': "axis",
            'triggerOn': "mousemove|click"
        },
        'xAxis': [
            {
                'type': "category",
                'data': ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
            }
        ],
        'yAxis': [
            {
                'type': "value"
            }
        ],
        'series': [
            {
                'data': serie,
                'type': "line",
                'itemStyle': {
                    'color': random_color
                },
                'lineStyle': {
                    'color': random_color
                }
            }
        ]
    }

    return JsonResponse(chart)


def bar_chart(request):
    return render(request, 'charts/bar_chart.html')

def line_chart(request):
    return render(request, 'charts/line_chart.html')



    