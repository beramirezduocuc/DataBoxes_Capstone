const get_chart_url = "http://127.0.0.1:8000/dashboard/get_chart/";
const get_chart_types_url = "http://127.0.0.1:8000/dashboard/get_chart_types/";
const chartForm = document.getElementById('chartForm');
const chartTypeSelect = document.getElementById('chartTypeSelect');
const chartColorSelect = document.getElementById('chartColorSelect');
const detailColorSelect = document.getElementById('detailColorSelect');
const labelChoice = document.getElementById('labelSelect')


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

// Función para obtener un color aleatorio
const getRandomColor = () => {
    const filteredColors = colors.filter(color => color.value !== 'random'); // Filtra el color aleatorio
    const randomColor = filteredColors[Math.floor(Math.random() * filteredColors.length)];
    return randomColor.value;
};

// Obtén los tipos de gráficos
async function fetchChartTypes() {
    const response = await fetch(get_chart_types_url);
    
    if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
    }

    const data = await response.json();
    return data.chart_types;
}

// Llena las opciones del formulario con tipos de gráficos y colores
async function populateChartOptions() {
    const graphTypes = await fetchChartTypes();

    Object.entries(graphTypes).forEach(([type, name]) => {
        const option = document.createElement('option');
        option.value = type;
        option.textContent = name;
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
    });
}

window.addEventListener('load', populateChartOptions);

// Función para obtener los valores del formulario
const getFormValues = () => {
    const selectedType = chartTypeSelect.value;  
    let selectedColor = chartColorSelect.value;
    let selectedDetailColor = detailColorSelect.value;
    let selectedLabel = labelSelect.value === 'true';

    if (selectedColor === 'random') {
        selectedColor = getRandomColor(); // Obtener color aleatorio
    }
    if (selectedDetailColor === 'random') {
        selectedDetailColor = getRandomColor(); // Obtener color aleatorio para detalles
    }
    
    return {
        selectedType,
        selectedColor,
        selectedDetailColor,
        selectedLabel,
    };
};

// Evento para actualizar el gráfico cuando se cambie el formulario
chartForm.addEventListener('change', async function() {
    const formData = getFormValues();
    await initChart(formData);  
});

// Mostrar un gráfico por defecto al cargar la página
window.addEventListener("load", async () => {
    const defaultFormData = {
        selectedType: 'bar',
        selectedColor: '#800020',
        selectedDetailColor: '#800020',
        selectedLabel:true,
    };
    await initChart(defaultFormData);  
});

// Obtener los datos del gráfico desde el servidor
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
