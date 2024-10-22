from django.shortcuts import render
from django.http.response import JsonResponse
import json
import requests
from random import randrange
from django.utils import timezone

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
            coindata_response = get_coin_data(request)
            coindata_json = json.loads(coindata_response.content)
            coin_prices_name = coindata_json.get('coin_prices', []) #<-- Parsear los nombres
            coin_timestamps_name = coindata_json.get('coin_timestamps', [])
            data = json.loads(request.body)  
            params = {**data}

            series = [
                coindata_json['coin_prices']
            #    [randrange(100, 400) for _ in range(7)] for _ in range(3)
            ]
            if not isinstance(series[0], list):
                series = [series] 

            series_data = [
                {'name': f'Variable {i+1}', 'data': serie} 
                for i, serie in enumerate(series)
            ]
            #para mañana: como mostrar nombres en el grafico.
            #solucion probable. parsear los nombres, meterlos en una lista
            #y titulo X y titulo Y
            #eso O poner campos para asignar nombres dentro de personalizacion
            # ;;

            #prices = [float(entry['price']) for entry in coin_prices_name]  
            #timestamps = [entry['timestamp'] for entry in coin_timestamps_name]

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
                        'data': coindata_json['coin_timestamps']
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


                    'stack': 'Total' if params.get('graph_stack', True) else None,  
                    'areaStyle': {} if params.get('graph_stack', True) else None,   
                    
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
                'chartNumbers':len(series_data),
                
            }
            
            request.session['storedNumber'] = len(series_data)

            return JsonResponse(response_data)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Solicitud JSON malformada'}, status=400)
        except Exception as e:
            print("Error:", e)  
            return JsonResponse({'error': 'Ocurrió un error al procesar la solicitud.'}, status=500)
    else:
        return JsonResponse({'error': 'Método no permitido'}, status=405)



#el timestamp es para forzar al navegador a NO usar cache, 
#si llega a usar cache, la pagina no se actualiza correctamente
#en cuanto a la cantidad de variables/opciones
#por lo que pueden haber 5 variables y las opciones disponibles
#van a ser las anteriores a la sesion

def create_chart(request):

    storedNumber = request.session.get('storedNumber')
    chartValues = range(storedNumber)
    
    context = {
        'chartValues': chartValues,
        'timestamp': timezone.now().timestamp()
    }
    return render(request, 'crud/create_chart.html', context)




def get_coin_data(request):
    api_key = 'coinrankingd36bd1d040b13258dcebca59a6ec428c217e4d0bbac4a5ae'
    url = 'https://api.coinranking.com/v2/coin/Qwsogvtv82FCd/history?timePeriod=1h'
    headers = {
        'x-access-token': api_key
    }
    response = requests.get(url, headers=headers)
    data = response.json()

    coin_prices = [entry['price'] for entry in data['data']['history']]
    coin_timestamps = [entry['timestamp'] for entry in data['data']['history']]

    context = {
        'coin_prices': coin_prices,
        'coin_timestamps': coin_timestamps
    }

    return JsonResponse(context, safe=False)



def line_chart(request):
    return render(request, 'charts/line_chart.html')



    