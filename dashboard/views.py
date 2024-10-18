from django.shortcuts import render
from django.http.response import JsonResponse
import json
import requests
from random import randrange


from django.http import JsonResponse
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
    if request.method == 'POST':
        try:
            data = json.loads(request.body)  
            params = {**data}
            serie_1 = [randrange(100, 400) for _ in range(7)]  
            serie_2 = [randrange(100, 400) for _ in range(7)] 
            chart = {
                'grid': {
                    'left': '0%',
                    'right': '0%',
                    'top': '5%',
                    'bottom': '0%',
                    'containLabel': params['graph_label'],
                },
                'legend': {
                    'show': True,
                    'type': 'plain',
                    'top': '10%',  # Ajusta la posición del legend
                    'orient': 'vert',  # Puedes ajustar esto según la necesidad
                    'orient': 'horizontal',  # O 'vertical' si deseas que sea vertical
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
                        'name': 'Varaiable 1',
                        'data': serie_1,
                        'type': params['graph_type'],  
                        'itemStyle': {
                            'color': params['graph_detail'] if params['graph_type'] == 'line' else params['graph_color']
                        },
                        'lineStyle': {
                            'width': params['graph_line_width'], 
                            'color': params['graph_color']
                        },
                        'symbolSize': params['graph_detail_width'],
                        'barWidth':params['graph_line_width'] if params['graph_type'] == 'bar' else None
                    },
                    {
                        'name': 'Variable 2',  # Nombre para la segunda serie
                        'data': serie_2,  # Segundo conjunto de datos
                        'type': params['graph_type'],
                        'itemStyle': {
                            'color': params['graph_detail'] if params['graph_type'] == 'line' else params['graph_color']
                        },
                        'lineStyle': {
                            'width': params['graph_line_width'],
                            'color': params['graph_color']
                        },
                        'symbolSize': params['graph_detail_width'] if params['graph_type'] == 'line' else 0,
                        'barWidth': params['graph_line_width'] if params['graph_type'] == 'bar' else None
                    }
                ]
            }
            return JsonResponse(chart)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Solicitud JSON malformada'}, status=400)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)




def create_chart(request):
        return render(request, 'crud/create_chart.html')


def line_chart(request):
    return render(request, 'charts/line_chart.html')



    