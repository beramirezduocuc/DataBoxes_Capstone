const get_chart_url = "http://127.0.0.1:8000/dashboard/get_chart/";
const get_chart_types_url = "http://127.0.0.1:8000/dashboard/get_chart_types/";

const chartForm = document.getElementById('chartForm');

const chartTypeSelect = document.getElementById('chartTypeSelect');
const chartColorSelect = document.getElementById('chartColorSelect');
const detailColorSelect = document.getElementById('detailColorSelect');
const labelChoice = document.getElementById('labelSelect');
const widthChoice = document.getElementById('widthSelect');
const detailWidthChoice = document.getElementById('detailWidthSelect');
const legendChoice = document.getElementById('legendSelect')

const colors = [
    { value: '#800020', label: 'Rojo' },
    { value: '#1D3557', label: 'Azul' },
    { value: '#2E8B57', label: 'Verde' },
    { value: '#DAA520', label: 'Dorado' },
    { value: '#F5F5DC', label: 'Beige' },
    { value: '#F0F0F0', label: 'Blanco'},
    { value: '#6D757D', label: 'Gris' },
    { value: '#333333', label: 'Negro' },
    { value: 'random', label: 'Aleatorio' },
];

const labelBool = [
    { value: 'true', label: 'Si'},
    { value: 'false', label: 'No'},
]

const graphTypes = [
    { value: 'line', label: 'Lineas'},
    { value: 'bar', label: 'Barras'},
    { value: 'pie', label: 'Pastel'}
];

const getRandomColor = () => {
    const filteredColors = colors.filter(color => color.value !== 'random'); // Filtra el color aleatorio
    const randomColor = filteredColors[Math.floor(Math.random() * filteredColors.length)];
    return randomColor.value;
};

const fieldMappings = {
    bar: {
        width: true,
        detailWidth: false,
        detailColor: false,
        label: true,
        legend:true,
    
    },
    line: {
        width: true,
        detailWidth: true,
        detailColor: true,
        label: true,
        legend:true,
    },
    pie: {
        width: false,
        detailWidth: false,
        detailColor: false,
        label: false,
        legend:true,
    },
};




const updateFormFields = () => {
    const selectedType = chartTypeSelect.value;
    const fields = fieldMappings[selectedType];

    widthSelect.parentElement.style.display = fields.width ? 'block' : 'none';
    detailWidthSelect.parentElement.style.display = fields.detailWidth ? 'block' : 'none';
    detailColorSelect.parentElement.style.display = fields.detailColor ? 'block' : 'none';
    labelChoice.parentElement.style.display = fields.label ? 'block' : 'none';
    legendChoice.parentElement.style.display = fields.label ? 'block' : 'none';
};

chartTypeSelect.addEventListener('change', updateFormFields);

async function populateChartOptions() {

    graphTypes.forEach(graphType => {
        const option = document.createElement('option');
        option.value = graphType.value;
        option.textContent = graphType.label;
        chartTypeSelect.appendChild(option);
    });
        
    colors.forEach(color => {
        const option = document.createElement('option');
        option.value = color.value;
        option.textContent = color.label;
        chartColorSelect.append(option);
        detailColorSelect.append(option.cloneNode(true));  
    });

    labelBool.forEach(labelChoice => {
        const option = document.createElement('option');
        option.value = labelChoice.value;
        option.textContent = labelChoice.label;
        labelSelect.append(option);
        legendChoice.append(option.cloneNode(true));
    });
}


// Función para obtener los valores del formulario
const getFormValues = () => {
    let selectedType = chartTypeSelect.value;  
    let selectedColor = chartColorSelect.value;
    let selectedDetailColor = detailColorSelect.value;
    let selectedLabel = labelSelect.value === 'true';
    let selectedWidth = widthChoice.value;
    let selectedDetailWidth = detailWidthChoice.value;
    let selectedLegend = legendChoice.value === 'true';

    if (selectedColor === 'random') {
        selectedColor = getRandomColor(); 
    }
    if (selectedDetailColor === 'random') {
        selectedDetailColor = getRandomColor(); 
    }
    if (selectedType === 'line'){
        selectedWidth = selectedWidth/10
    }  
    
    
    return {
        selectedType,
        selectedColor,
        selectedDetailColor,
        selectedLabel,
        selectedWidth,
        selectedDetailWidth,
        selectedLegend,

    };
};

chartForm.addEventListener('change', async function() {
    const formData = getFormValues();
    updateWidthValue();
    await initChart(formData);  
});

const updateWidthValue = () => {
    //TEXTO DENTRO DEL HTML
    widthValueDisplay.textContent = `Ancho de línea: ${widthChoice.value}`;
    detailWidthDisplay.textContent = `Ancho de detalles: ${detailWidthChoice.value}`;
};


window.addEventListener("load", async () => {
    const defaultFormData = {
        selectedType: 'line',
        selectedColor: '#800020',
        selectedDetailColor: '#800020',
        selectedLabel:true,
        selectedWidth:15/10,
        selectedDetailWidth:10,
        selectedLegend:true,
    };
    updateWidthValue();
    populateChartOptions();
    await initChart(defaultFormData);  
});

const getOptionChart = async (formData) => {
    try {
        const response = await fetch(get_chart_url, {
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,  
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                graph_type: formData.selectedType,  
                graph_color: formData.selectedColor,
                graph_detail: formData.selectedDetailColor,
                graph_label: formData.selectedLabel,
                graph_line_width: formData.selectedWidth,
                graph_detail_width: formData.selectedDetailWidth,
                graph_legend_show : formData.selectedLegend,
            })
        });

        const data = await response.json();

        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        return data;
    } catch (ex) {
        console.error(ex);
        alert('Ocurrió un error al obtener el gráfico: ' + ex.message);
    }
};

// Inicializa el gráfico
const initChart = async (formData) => {
    const myChart = echarts.init(document.getElementById("chart"));
    const option = await getOptionChart(formData);

    if (option) {  
        myChart.setOption(option);  
        myChart.resize();  
    } else {
        console.error("La opción del gráfico es inválida");
    }
};

// Función para obtener el CSRF token
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken'); 


// Contenedor para los selectores de color
const dynamicColorSelectors = document.getElementById('dynamicColorSelectors');

// Función para generar los selectores de color
const createColorSelectors = (numSeries) => {
    dynamicColorSelectors.innerHTML = '';  // Limpiar el contenedor antes de agregar los nuevos selectores

    for (let i = 0; i < numSeries; i++) {
        const colorSelectorDiv = document.createElement('div');
        colorSelectorDiv.classList.add('mt-2');

        const label = document.createElement('label');
        label.textContent = `Color de gráfico para la serie ${i + 1}`;

        const select = document.createElement('select');
        select.classList.add('w-full', 'py-2', 'px-4', 'bg-white', 'border', 'rounded-lg', 'text-gray-900', 'mt-2', 'shadow-md');
        select.id = `seriesColorSelect${i}`;

        colors.forEach(color => {
            const option = document.createElement('option');
            option.value = color.value;
            option.textContent = color.label;
            select.appendChild(option);
        });

        colorSelectorDiv.appendChild(label);
        colorSelectorDiv.appendChild(select);
        dynamicColorSelectors.appendChild(colorSelectorDiv);
    }
};

