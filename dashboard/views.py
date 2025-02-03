from django.shortcuts import render, redirect
from django.http.response import JsonResponse
from django.utils import timezone
import json
import pandas as pd
import requests
from random import randrange
import csv
from .forms import CSVUploadForm
<<<<<<< HEAD


def dashboard(request):
    #esto tiene que llamar a los graficos mas tarde, cloud ping -> cloud_ping_graficos(????)
    #parametros guardados en la nube????????
=======
from django.core.files.storage import default_storage


def dashboard(request):

>>>>>>> desarrollo_2
    username = request.user.nombre
    context = {'username' : username}
    return render(request, 'dashboard/dashboard.html', context)
<<<<<<< HEAD
def get_chart(request):
    if request.method == 'POST':
        try:
            #coindata_response = get_coin_data(request)
            #coindata_json = json.loads(coindata_response.content)
            #coin_prices_name = coindata_json.get('coin_prices', []) #<-- Parsear los nombres
            #coin_timestamps_name = coindata_json.get('coin_timestamps', [])
            data = json.loads(request.body)  
            params = {**data}

            series = [
            #    coindata_json['coin_prices']
                [randrange(100, 400) for _ in range(7)] for _ in range(4)
            ]
            if not isinstance(series[0], list):
                series = [series] 

            series_data = [
                {'name': f'Variable {i+1}', 'data': serie} 
                for i, serie in enumerate(series)
            ]

            #como mostrar nombres en el grafico.
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
                        'data': ['Lun','Mar','Mie','Jue','Vie','Sab','Dom']
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
                    'name': params.get('graph_variables_name')[i],
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
            #print(data)
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
#van a ser las anteriores a la sesion actual
#(no funciona 🫠)

# views.pycsrftoken


def filtrar_datos(request):
    if request.method == 'POST':
        # Obtén las variables seleccionadas desde el POST
        variables_seleccionadas = json.loads(request.POST.get('variables', '[]'))
        
        # Obtiene el archivo CSV desde los archivos adjuntos
        csv_file = request.FILES.get('file')
        if not csv_file:
            return JsonResponse({'error': 'Archivo no encontrado'}, status=404)

        # Procesa el archivo CSV
        decoded_file = csv_file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)
        df = pd.DataFrame(reader)

        # Filtra el DataFrame por las variables seleccionadas
        try:
            df_filtrado = df[variables_seleccionadas]
        except KeyError:
            return JsonResponse({'error': 'Las variables seleccionadas no son válidas'}, status=400)
        
        # Devuelve los datos filtrados
        df_head = df_filtrado.head().to_json(orient='split')
        return JsonResponse({'data': df_head})
    
    return JsonResponse({'error': 'Método no permitido'}, status=405)


def slice_csv(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        variable_selection = request.POST.get('variable_selection')
        print('Archivo recibido:', file)

        if not file or not variable_selection:
            return {'error': 'Archivo o variable de selección no encontrados'}

        decoded_file = file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)
        cleaned_headers = [header.strip() for header in reader.fieldnames]
        selected_columns = [col.strip('"[]') for col in variable_selection.split(',')]


        print("Encabezados limpios:", cleaned_headers)
        print("Columnas seleccionadas:", selected_columns)

        sliced_data = []
        for row in reader:
            cleaned_row = {header.strip(): value for header, value in row.items()}  
            data_row = {col: cleaned_row.get(col, '') for col in selected_columns if col in cleaned_row}
            sliced_data.append(data_row)

        request.session['csv_data'] = sliced_data
        request.session['row_name'] = selected_columns
        
        return redirect('create_chart')
        
        #return {
        #    'sliced_data': sliced_data,
        #    'selected_columns': selected_columns,
        #}

        


def upload_csv(request):
    if request.method == 'POST':
        file = request.FILES.get('file')
        variable_selection = request.POST.get('variable_selection')
        csvForm = CSVUploadForm(request.POST, request.FILES)
        #print('variable_selection:',variable_selection)
        if not file:
            return JsonResponse({'error': 'Archivo o lista no encontrado'}, status=400)
        print('Funcionando aqui punto 1')
        sliced_csv = None
        sliced_data = None
        
        if variable_selection:
            sliced_csv = slice_csv(request)
            sliced_data = sliced_csv.get('sliced_data')
            
            print('Funcionando aqui punto 2')
        decoded_file = file.read().decode('utf-8').splitlines()
        reader = csv.DictReader(decoded_file)

        csv_data = [row for row in reader]
        row_name = reader.fieldnames

        # Almacena los datos y nombres de columnas en la sesión
        request.session['csv_data'] = csv_data
        request.session['row_name'] = row_name
        #print('csvdata:',csv_data)
        context = {
            'csv_data': csv_data,
            'row_name': row_name,
            'sliced_data': sliced_data,
        }

        #print(sliced_data)
        if request.headers.get('X-Requested-With') == 'XMLHttpRequest':
            return JsonResponse(context, status=200)

        return redirect('create_chart')

    return JsonResponse({'error': 'Método no permitido'}, status=405)


def create_chart(request):
    storedNumber = request.session.get('storedNumber', 2)
    chartValues = range(storedNumber)
    csvForm = CSVUploadForm()
    csv_data = request.session.get('csv_data', [])
    row_name = request.session.get('row_name', [])
    try:
        initial_charts = len(row_name)
    except:
        initial_charts = 2

    context = {
        'chartValues': chartValues,
        'csvForm': csvForm,
        'csv_data': csv_data,
        'row_name': row_name,
        'initial_charts': initial_charts,
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
=======
 
def create_chart(request):
    username = request.user.nombre
    context = {'username' : username}
    return render(request, 'crud/create_chart.html', context)

def test(request):
    return render(request, 'test.html')
>>>>>>> desarrollo_2
#Cambiar el nombre de este mas tarde a "default_chart" o algo asi
def line_chart(request):
    return render(request, 'charts/line_chart.html')



    