from django.shortcuts import render,redirect
from .forms import chartTypeForm
from django.http.response import JsonResponse
import json
import requests
from random import randrange
from django.views.decorators.csrf import csrf_exempt

from django.http import JsonResponse, HttpResponseBadRequest

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



def get_chart(request, param1):
    if request.method == 'POST':
        data = json.loads(request.body)
        param1 = data.get('param1')
        print(f'Recibido param1: {param1}') 
        colors = ['blue', 'orange', 'red', 'black', 'yellow', 'green', 'magenta', 'lightblue', 'purple', 'brown']
        random_color = colors[randrange(0, (len(colors)-1))]
        serie = [randrange(100, 400) for _ in range(7)]  # Lista con datos aleatorios

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
                    'type': param1,
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
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


def create_chart(request):

        return render(request, 'crud/create_chart.html')

def bar_chart(request):
    return render(request, 'charts/bar_chart.html')

def line_chart(request):
    return render(request, 'charts/line_chart.html')



    