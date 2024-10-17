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




GRAPH_TYPES = {
    'bar': {
        'name': 'Barra',
        'default_color': 'blue'
    },
    'line': {
        'name': 'Línea',
        'default_color': 'green'
    },
    # Agrega más tipos de gráficos aquí sin cambiar todo el código
}
def get_chart(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  
            graph_type = data.get('graph_type')
            graph_color = data.get('graph_color')
            graph_detail = data.get('graph_detail')  

            serie = [randrange(100, 400) for _ in range(7)]  # Datos aleatorios

            chart = {
                'grid': {
                    'left': '0%',
                    'right': '0%',
                    'top': '5%',
                    'bottom': '0%',
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
                        'type': graph_type,  # Usar el tipo de gráfico enviado
                        'itemStyle': {
                            'color': graph_color  # Usar el color enviado
                        },
                        'lineStyle': {
                            'color': graph_detail
                        }
                    }
                ]
            }
            return JsonResponse(chart)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Solicitud JSON malformada'}, status=400)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


def get_chart_types(request):
    if request.method == 'GET':
        chart_types = {key: value['name'] for key, value in GRAPH_TYPES.items()}  # Devuelve un diccionario de tipos de gráficos
        return JsonResponse({'chart_types': chart_types})
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)



def create_chart(request):

        return render(request, 'crud/create_chart.html')

def bar_chart(request):
    return render(request, 'charts/bar_chart.html')

def line_chart(request):
    return render(request, 'charts/line_chart.html')



    