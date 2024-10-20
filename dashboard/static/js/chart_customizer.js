const get_chart_url = "http://127.0.0.1:8000/dashboard/get_chart/";
const get_chart_types_url = "http://127.0.0.1:8000/dashboard/get_chart_types/";

const chartForm = document.getElementById('chartForm');
const detailColorSelect = document.getElementById('detailColorSelect');
const labelChoice = document.getElementById('labelSelect');
const widthChoice = document.getElementById('widthSelect');
const detailWidthChoice = document.getElementById('detailWidthSelect');
const legendChoice = document.getElementById('legendSelect');
const chartTypeSelect = document.getElementById('chartTypeSelect'); 

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

const labelBool = [
    { value: 'true', label: 'Si' },
    { value: 'false', label: 'No' },
];

const graphTypes = [
    { value: 'line', label: 'Lineas' },
    { value: 'bar', label: 'Barras' },
    { value: 'pie', label: 'Pastel' }
];

const getRandomColor = () => {
    const filteredColors = colors.filter(color => color.value !== 'random'); 
    const randomColor = filteredColors[Math.floor(Math.random() * filteredColors.length)];
    return randomColor.value;
};

const fieldMappings = {
    bar: {
        width: true,
        detailWidth: false,
        detailColor: false,
        label: true,
        legend: true,   
    },
    line: {
        width: true,
        detailWidth: true,
        detailColor: true,
        label: true,
        legend: true,
    },
    pie: {
        width: false,
        detailWidth: false,
        detailColor: false,
        label: false,
        legend: true,
    },
};

window.addEventListener("load", async () => {
    var chartNumbers = 2;  
    var selectedColor = [];  
    var chartColorSelectors = [];
    for (let i = 0; i < chartNumbers; i++) {
        const chartColorSelect = document.getElementById(`chartColorSelect${i}`);
        console.log(chartColorSelect); 

        if (chartColorSelect) {
            colors.forEach(color => {
                const option = document.createElement('option');
                option.value = color.value;
                option.textContent = color.label;
                chartColorSelect.append(option);
            });
            chartColorSelectors.push(chartColorSelect.id);
            selectedColor.push(chartColorSelect.value);
        } else {
            console.error(`Error con chartColorSelect${i}`);
        }
    }
    return selectedColor;
    
});

const updateFormFields = () => {
    const selectedType = chartTypeSelect.value;
    const fields = fieldMappings[selectedType];
    var chartNumbers = 2;
    var chartColorSelectors = [];
    for (let i = 0; i < chartNumbers; i++) {
        const chartColorSelect = document.getElementById(`chartColorSelect${i}`);
        console.log(chartColorSelect); 
        chartColorSelectors.push(chartColorSelect.id);
    }
    chartColorSelectors.forEach(chartColorSelectors => {
        const colorSelectElement = document.getElementById(chartColorSelectors);
        if (colorSelectElement) {
            console.log(`Mostrando/ocultando: ${colorSelectElement.id}, Mostrar: ${fields.detailColor}`);
            colorSelectElement.parentElement.style.display = fields.detailColor ? 'block' : 'none';
        }
    });
    widthSelect.parentElement.style.display = fields.width ? 'block' : 'none';
    detailWidthSelect.parentElement.style.display = fields.detailWidth ? 'block' : 'none';
    detailColorSelect.parentElement.style.display = fields.detailColor ? 'block' : 'none';
    labelChoice.parentElement.style.display = fields.label ? 'block' : 'none';
    legendChoice.parentElement.style.display = fields.legend ? 'block' : 'none';
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
        detailColorSelect.append(option);  
    });

    labelBool.forEach(labelChoice => {
        const option = document.createElement('option');
        option.value = labelChoice.value;
        option.textContent = labelChoice.label;
        labelSelect.append(option);
        legendChoice.append(option.cloneNode(true));
    });
}


const getFormValues = () => {
    let selectedColors = [];
    let chartNumbers = 2;
    for (let i = 0; i < chartNumbers; i++) {
        const chartColorSelect = document.getElementById(`chartColorSelect${i}`);
        if (chartColorSelect) {
            selectedColors.push(chartColorSelect.value);
        }
    }

    let selectedType = chartTypeSelect.value;  
    let selectedDetailColor = detailColorSelect.value;
    let selectedLabel = labelSelect.value === 'true';
    let selectedWidth = widthChoice.value;
    let selectedDetailWidth = detailWidthChoice.value;
    let selectedLegend = legendChoice.value === 'true';

    if (selectedColors === 'random') {
        selectedColors = getRandomColor(); 
    }
    if (selectedDetailColor === 'random') {
        selectedDetailColor = getRandomColor(); 
    }
    if (selectedType === 'line'){
        selectedWidth = selectedWidth/10
    }  
    
    
    return {
        selectedType,
        selectedColors,
        selectedDetailColor,
        selectedLabel,
        selectedWidth,
        selectedDetailWidth,
        selectedLegend,
    };
};


chartForm.addEventListener('change', async function () {
    const formData = getFormValues();
    console.log("Colores seleccionados:", formData.selectedColors); 

    console.log(formData);
    updateWidthValue();
    await initChart(formData);
});

const updateWidthValue = () => {
    widthValueDisplay.textContent = `Ancho de línea: ${widthChoice.value}`;
    detailWidthDisplay.textContent = `Ancho de detalles: ${detailWidthChoice.value}`;
};


window.addEventListener("load", async () => {

    const defaultFormData = {
        selectedType: 'line',
        selectedColors: '#800020',
        selectedDetailColor: '#800020',
        selectedLabel: true,
        selectedWidth: 15 / 10,
        selectedDetailWidth: 10,
        selectedLegend: true,
    };

    updateWidthValue();
    populateChartOptions();
    updateFormFields(); 
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
                graph_color: formData.selectedColors,
                graph_detail: formData.selectedDetailColor,
                graph_label: formData.selectedLabel,
                graph_line_width: formData.selectedWidth,
                graph_detail_width: formData.selectedDetailWidth,
                graph_legend_show: formData.selectedLegend,
            })
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        return data;
    } catch (ex) {
        console.error(ex);
        alert('Ocurrió un error al obtener el gráfico: ' + ex.message);
    }
};


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
