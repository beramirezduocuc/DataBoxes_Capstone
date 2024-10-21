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

            series = [
                [randrange(100, 400) for _ in range(7)] for _ in range(3)
            ]

            series_data = [
                {'name': f'Variable {i+1}', 'data': serie} 
                for i, serie in enumerate(series)
            ]

            chart = {
                'grid': {
                    'left': '0%',
                    'right': '0%',
                    'top': '5%',
                    'bottom': '0%',
                    'containLabel': params['graph_label'],
                },
                'legend': {
                    'show': params['graph_legend_show'],
                    'type': 'scroll',
                    'orient': 'horizontal',  
                },
                'tooltip': {
                    'show': True,
                    'type': 'cross',
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
                'series': []
            }

            for i, serie in enumerate(series_data):
                chart['series'].append({
                    'name': serie['name'],
                    'data': serie['data'],


                    'stack': 'Total' if params.get('graph_stack', True) else None,  # Condición para gráfico apilado
                    'areaStyle': {} if params.get('graph_stack', True) else None,   # Solo aplica si es apilado
                    
                    'emphasis': {
                        'focus': 'series'
                    } if params.get('graph_stack', True) else None,


                    'type': params.get('graph_type'),  
                    'itemStyle': {
                        'color': params.get('graph_detail')[i] if params['graph_type'] == 'line' else params['graph_color'][i]
                    },
                    'lineStyle': {
                        'width': params.get('graph_line_width'),
                        'color': params['graph_color'][i] 
                    },
                    'symbolSize': params.get('graph_detail_width', 4),
                    'barWidth': params.get('graph_line_width', 10) if params['graph_type'] == 'bar' else None
                })
            
            response_data = {
                'chart':chart,
                'chartNumbers':len(series_data)
            }
            return JsonResponse(response_data)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Solicitud JSON malformada'}, status=400)
        except Exception as e:
            print("Error:", e)  
            return JsonResponse({'error': 'Ocurrió un error al procesar la solicitud.'}, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)


def create_chart(request):
    if request.method == 'POST':
        chartNumbers = int(request.POST.get('chartNumbers')) 
    else: 
        chartNumbers = 3
    chartValues = range(chartNumbers)
    context = {
        'chartValues': chartValues,
        'chartNumbers': chartNumbers  
    }
    return render(request, 'crud/create_chart.html', context)


def line_chart(request):
    return render(request, 'charts/line_chart.html')



    