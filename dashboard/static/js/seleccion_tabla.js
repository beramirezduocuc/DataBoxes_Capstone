var myChart;
var excelData = [];
var selectedColumns = [];
var selectedVariables = [];
var chartType = 'bar'; 
let chartColor = '#800020'; 
let showLabels = true; // Mostrar etiquetas por defecto
let showLegend = true; // Mostrar leyenda por defecto
var mult_bar = false;



const colors = [
    { value: '#800020', label: 'Rojo' },
    { value: '#1D3557', label: 'Azul' },
    { value: '#2E8B57', label: 'Verde' },
    { value: '#DAA520', label: 'Dorado' },
    { value: '#F5F5DC', label: 'Beige' },
    { value: '#F0F0F0', label: 'Blanco' },
    { value: '#6D757D', label: 'Gris' },
    { value: '#333333', label: 'Negro' },
    { value: 'random', label: 'Aleatorio' },
];

const seriesColors = {};
let columnWidth = 35; // Ancho de las columnas por defecto
let detailSize = 10; // Tamaño de los detalles por defecto

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el gráfico con el valor inicial del combobox
    updateChart();

    // Manejar el evento change del combobox
    document.getElementById('chartTypeSelect').addEventListener('change', () => {
        updateChart(); // Actualiza el gráfico cuando cambia el tipo
    });
});

function updateSeriesColor(seriesIndex, newColor) {
    if (newColor === 'random') {
        newColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
    seriesColors[seriesIndex] = newColor; // Guarda el color personalizado
    updateChart(); // Actualiza el gráfico
}


document.getElementById('columnWidth').addEventListener('input', (e) => {
    columnWidth = parseInt(e.target.value);
    document.getElementById('columnWidthValue').textContent = columnWidth;
    updateChart(); // Actualiza el gráfico
});

// Slider para el tamaño de los detalles
document.getElementById('detailSize').addEventListener('input', (e) => {
    detailSize = parseInt(e.target.value);
    document.getElementById('detailSizeValue').textContent = detailSize;

    updateChart(); // Actualiza el gráfico
});



document.getElementById('labelVisibility').addEventListener('change', (e) => {
    showLabels = e.target.value === 'true'; // Convierte el valor a booleano
    updateChart(); // Actualiza el gráfico
});

// Función para alternar la leyenda
document.getElementById('legendVisibility').addEventListener('change', (e) => {
    showLegend = e.target.value === 'true'; // Convierte el valor a booleano
    updateChart(); // Actualiza el gráfico
});



function resetChartAndData() {
    // Reinicia todas las variables globales
    excelData = [];
    selectedColumns = [];
    selectedVariables = [];
    seriesColors = {};

    // Limpia la lista de columnas
    const columnList = document.getElementById('columnList');
    columnList.innerHTML = '';

    // Limpia los comboboxes de colores
    const comboboxContainer = document.getElementById('comboboxContainer');
    comboboxContainer.innerHTML = '';

    // Elimina el gráfico si ya existe
    if (myChart) {
        myChart.dispose();
        myChart = null;
    }

    // Inicializa un nuevo gráfico vacío
    initChart();
}

function updateChart() {

    if (selectedColumns.length === 0) {
        console.log('No hay columnas seleccionadas');
        const comboboxContainer = document.getElementById('comboboxContainer');
        comboboxContainer.innerHTML = '';
        return;
    }


    const categories = excelData.slice(1).map(row => row[selectedColumns[0]]);

    const series = selectedColumns.slice(1).map((colIndex, seriesIndex) => {
        const seriesOptions = {
            name: `${excelData[0][colIndex]}`,
            type: chartType,
            data: excelData.slice(1).map(row => row[colIndex]),
            itemStyle: {
                color: seriesColors[seriesIndex] || chartColor // Usa el color personalizado si existe
            },
            label: {
                show: showLabels // Controla la visibilidad de las etiquetas
            }
        };

        // Aplicar el ancho de las barras solo si el tipo de gráfico es 'bar'
        if (chartType === 'bar') {
            seriesOptions.barWidth = columnWidth;
        }

        // Aplicar el tamaño de los detalles y el ancho de las líneas solo si el tipo de gráfico es 'line'
        if (chartType === 'line') {
            seriesOptions.symbolSize = detailSize;
            seriesOptions.lineStyle = {
                width: columnWidth / 5 // Usa el valor del slider para el ancho de las líneas
            };
        }

        return seriesOptions;
    });

    if (!myChart) {
        myChart = echarts.init(document.getElementById('chart'));
    }

    const option = {

        tooltip: {},
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType: {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        legend: {
            show: showLegend, // Controla la visibilidad de la leyenda
            data: series.map(s => s.name)
        },
        xAxis: {
            type: 'category',
            data: categories
        },
        yAxis: {
            type: 'value'
        },
        series: series
    };

    myChart.setOption(option, true);
    updateComboboxes();
}

function toggleColumn(index) {
    if (index === 0) {
        // Si se selecciona o deselecciona la primera columna, se maneja por separado.
        if (selectedColumns.includes(index)) {
            selectedColumns = selectedColumns.filter(col => col !== index);
        } else {
            selectedColumns.unshift(index); // Añade la columna 0 al principio
        }
    } else {
        // Para las demás columnas, el comportamiento sigue igual.
        if (selectedColumns.includes(index)) {
            selectedColumns = selectedColumns.filter(col => col !== index);
        } else {
            selectedColumns.push(index);
        }
    }

    console.log('Columnas seleccionadas después del cambio:', selectedColumns);
    updateChart();
}

function updateVariableSelection() {
    const checkboxes = document.querySelectorAll('input[name="variableSelector"]:checked');
    selectedVariables = Array.from(checkboxes).map(cb => parseInt(cb.value));
    updateChart(); // Actualiza el gráfico con las nuevas variables
}

document.getElementById('columnList').addEventListener('change', function () {
    updateVariableSelection();
});


document.addEventListener('DOMContentLoaded', () => {
    const colorSelector = document.getElementById('colorSelector');

    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color.value;
        option.textContent = color.label;
        colorSelector.appendChild(option);
    });

    colorSelector.addEventListener('change', (e) => {
        updateColor(e.target.value);
    });

    document.getElementById('excelFile').addEventListener('change', handleFileUpload);

    let isFirstLoad = true; // Variable para rastrear si es la primera vez

    document.getElementById('excelFile').addEventListener('change', function () {
        const containerExcel = document.getElementById('containerExcel');
        
        if (isFirstLoad) {
            containerExcel.classList.remove('hidden'); // Mostrar el div
            isFirstLoad = false; // Cambiar el estado para futuras cargas
        }

        initChart();
    });
    
    

    
    document.getElementById('chartTypeSelect').addEventListener('change', (e) => {
        chartType = e.target.value;
        updateChart();
    });

    initChart(); // Inicializa el gráfico vacío
});

function handleFileUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });

            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
            showColumnSelector(excelData[0]);
        };
        reader.readAsArrayBuffer(file);
    }
}



function showColumnSelector(columns) {
    const columnList = document.getElementById('columnList');
    columnList.innerHTML = ''; // Limpia la lista

    columns.forEach((column, index) => {
        const checkbox = `
            <label class="flex space-x-2">
                <input type="checkbox" value="${index}" onchange="toggleColumn(${index})" class="form-checkbox">
                <span>${column}</span>
            </label>
        `;
        columnList.innerHTML += checkbox;
    });

    document.getElementById('columnSelector').classList.remove('hidden');
}



function updateColor(newColor) {
    if (newColor === 'random') {
        newColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
    chartColor = newColor;

    if (myChart) {
        const series = myChart.getOption().series.map((series, index) => ({
            ...series,
            itemStyle: { color: seriesColors[index] || chartColor } // Usa el color personalizado si existe
        }));

        myChart.setOption({ series: series });
    }
}
function initChart() {
    myChart = echarts.init(document.getElementById('chart'));
    myChart.setOption({
        tooltip: {},
        xAxis: { type: 'category', data: [] },
        yAxis: { type: 'value' },
        series: []
    });
}

function updateSeriesColor(seriesIndex, newColor) {
    if (newColor === 'random') {
        newColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }
    seriesColors[seriesIndex] = newColor; // Guarda el color personalizado
    updateChart(); // Actualiza el gráfico
}


function updateComboboxes() {
    const comboboxContainer = document.getElementById('comboboxContainer');
    comboboxContainer.innerHTML = '';

    // Solo procesar columnas numéricas (excluyendo la primera columna)
    selectedColumns.slice(1).forEach((colIndex, seriesIndex) => {
        if (!isColumnNumeric(colIndex)) return;

        const columnName = excelData[0][colIndex];
        const comboboxWrapper = document.createElement('div');
        comboboxWrapper.classList.add('combobox-item');

        const label = document.createElement('label');
        label.textContent = `Color para ${columnName}`;
        label.htmlFor = `colorCombobox-${seriesIndex}`;

        const select = document.createElement('select');
        select.id = `colorCombobox-${seriesIndex}`;
        select.className = 'form-select block w-[9rem] mt-1 bg-white border rounded-md';
        select.dataset.seriesIndex = seriesIndex; // Usar el índice de la serie
        select.addEventListener('change', (e) => {
            const newColor = e.target.value;
            updateSeriesColor(seriesIndex, newColor); // Pasar el índice de la serie
        });

        colors.forEach((color) => {
            const option = document.createElement('option');
            option.value = color.value;
            option.textContent = color.label;
            if (seriesColors[seriesIndex] === color.value) {
                option.selected = true; // Selecciona la opción correspondiente al color actual
            }
            select.appendChild(option);
        });

        comboboxWrapper.appendChild(label);
        comboboxWrapper.appendChild(select);
        comboboxContainer.appendChild(comboboxWrapper);
    });
}

//COMPATIBILIDAD DE COLUMNAS

function isColumnNumeric(colIndex) {
    return excelData.slice(1).every(row => !isNaN(parseFloat(row[colIndex])));
}

