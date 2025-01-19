const get_chart_url = "http://127.0.0.1:8000/dashboard/get_chart/";
const create_chart_url = "http://127.0.0.1:8000/dashboard/create_chart/"
const chartForm = document.getElementById('chartForm');
const labelChoice = document.getElementById('labelSelect');
const widthChoice = document.getElementById('widthSelect');
const detailWidthChoice = document.getElementById('detailWidthSelect');
const legendChoice = document.getElementById('legendSelect');
const chartTypeSelect = document.getElementById('chartTypeSelect'); 
const stackChoice = document.getElementById('stackSelect');


let chartNumbers;
const selectedColor = [];  
const selectedDetailColor = [];
const chartColorSelectors = [];
const detailColorSelectors = [];



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
        graphColor: true,
        label: true,
        legend: true,   
    },
    line: {
        width: true,
        graphColor: true,
        detailWidth: true,
        detailColor: true,
        label: true,
        legend: true,
    },
};


const fillAdditionalFields = () => {
    setTimeout(() => {
        document.getElementById('stackSelect').value = 'false';
    }, 1);

    for (let i = 0; i < chartNumbers; i++) {
        
        const chartColorSelect = document.getElementById(`chartColorSelect${i}`);
        const detailColorSelect = document.getElementById(`detailColorSelect${i}`);

        if (chartColorSelect) {
            colors.forEach(color => {
                const option = document.createElement('option');
                option.value = color.value;
                option.textContent = color.label;
                chartColorSelect.append(option);
            })
            chartColorSelectors.push(chartColorSelect.id);
            selectedColor.push(chartColorSelect.value);
        };
            
        if (detailColorSelect) {
            colors.forEach(color => {
                const option = document.createElement('option');
                option.value = color.value;
                option.textContent = color.label;
                detailColorSelect.append(option);
            });
            detailColorSelectors.push(detailColorSelect.id);
            selectedDetailColor.push(detailColorSelect.value);
        };
    };

    return selectedColor, selectedDetailColor;
};


const updateFormFields = () => {
    const selectedType = chartTypeSelect.value;
    const fields = fieldMappings[selectedType];


    chartColorSelectors.forEach(chartColorSelectors => {
        const colorSelectElement = document.getElementById(chartColorSelectors);
        if (colorSelectElement) {
            colorSelectElement.parentElement.style.display = fields.graphColor ? 'block' : 'none';
        }
    });

    detailColorSelectors.forEach(detailColorSelectors => {
        const detailSelectElement = document.getElementById(detailColorSelectors);
        if(detailSelectElement){
            detailSelectElement.parentElement.style.display = fields.detailColor ? 'block' : 'none';
        }
    });

    widthSelect.parentElement.style.display = fields.width ? 'block' : 'none';
    detailWidthSelect.parentElement.style.display = fields.detailWidth ? 'block' : 'none';
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

    labelBool.forEach(labelChoice => {
        const option = document.createElement('option');
        option.value = labelChoice.value;
        option.textContent = labelChoice.label;
        labelSelect.append(option);
        legendChoice.append(option.cloneNode(true));
        stackChoice.append(option.cloneNode(true));
    });
}


const getFormValues = () => {
    let selectedColor = [];
    let selectedDetail = [];
    let selectedNameInput = [];
    let nombreDefaultVariables = [];

    for (let i = 0; i < chartNumbers; i++) {
        const varNameInput = document.getElementById(`varNameInput${i}`)
        const chartColorSelect = document.getElementById(`chartColorSelect${i}`);
        const detailColorSelect = document.getElementById(`detailColorSelect${i}`)
        
        nombreDefaultVariables.push(`Variable ${i}`)

        if (chartColorSelect) {
            selectedColor.push(chartColorSelect.value);
        }
        if (detailColorSelect) {
            selectedDetail.push(detailColorSelect.value);
        }
        if(varNameInput){
            
            selectedNameInput.push(varNameInput.value);
        }
    };
    //esta es la unica parte en la que es necesario reutilizar el for
    //porque primero es onload, y despues se tiene que rellamar en 
    //caso de cambios, probablemente hay mejor manera.

    let selectedType = chartTypeSelect.value;  
    let selectedLabel = labelSelect.value === 'true';
    let selectedWidth = widthChoice.value;
    let selectedDetailWidth = detailWidthChoice.value;
    let selectedLegend = legendChoice.value === 'true';
    let selectedStack = stackChoice.value === 'true';    
    

    if (selectedColor === 'random') {
        selectedColor = getRandomColor(); 
    }
    if (selectedDetail === 'random') {
        selectedDetail = getRandomColor(); 
    }
    if (selectedType === 'line'){
        selectedWidth = selectedWidth/10
    }  
    
    
    return {
        selectedType,
        selectedColor,
        selectedDetail,
        selectedLabel,
        selectedWidth,
        selectedDetailWidth,
        selectedLegend,
        selectedStack,
        selectedNameInput
    };
};


chartForm.addEventListener('change', async function () {
    const formData = getFormValues();
    console.log("Colores seleccionados:", formData.selectedColor); 

    console.log(formData);
    updateWidthValue();
    await initChart(formData);
});

const updateWidthValue = () => {
    widthValueDisplay.textContent = `Ancho de línea: ${widthChoice.value}`;
    detailWidthDisplay.textContent = `Ancho de detalles: ${detailWidthChoice.value}`;

}
;


window.addEventListener("load", async () => {

    const defaultFormData = {
        selectedType: 'line',
        selectedColor: '#800020',
        selectedDetail: '#800020',
        selectedLabel: true,
        selectedWidth: 15 / 10,
        selectedDetailWidth: 10,
        selectedLegend: true,
        selectedStack: false,
        selectedNameInput: "VVVVVVV",
    };
    
    await initChart(defaultFormData);
    fillAdditionalFields();
    updateWidthValue();
    populateChartOptions();
    updateFormFields(); 
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
                graph_detail: formData.selectedDetail,
                graph_label: formData.selectedLabel,
                graph_line_width: formData.selectedWidth,
                graph_detail_width: formData.selectedDetailWidth,
                graph_legend_show: formData.selectedLegend,
                graph_stack: formData.selectedStack,
                graph_variables_name : formData.selectedNameInput
            })
        })

        const data = await response.json();
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        const chart = data.chart;
        const chartNumbersRecieved = data.chartNumbers;

        return {chart, chartNumbersRecieved};

    } catch (ex) {
        console.error(ex);
        alert('Ocurrió un error al obtener el gráfico: ' + ex.message);
    }
};


const initChart = async (formData) => {
    const myChart = echarts.init(document.getElementById("chart"));
    const option = await getOptionChart(formData);
    

    if (option) {
        chartNumbers = option.chartNumbersRecieved
        myChart.setOption(option.chart);
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