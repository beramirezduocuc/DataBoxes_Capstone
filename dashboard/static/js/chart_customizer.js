const get_chart_url = "http://127.0.0.1:8000/dashboard/get_chart/";
const get_chart_types_url = "http://127.0.0.1:8000/dashboard/get_chart_types/";
const chartForm = document.getElementById('chartForm');
const chartTypeSelect = document.getElementById('chartTypeSelect');
const chartColorSelect = document.getElementById('chartColorSelect');
const detailColorSelect = document.getElementById('detailColorSelect');




async function fetchChartTypes() {
    try {
        const response = await fetch(get_chart_types_url, {
            method: 'GET',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Error al obtener los tipos de gráficos');
        return await response.json();
    } catch (error) {
        console.error(error);
    }
}

async function populateChartOptions() {
    // Asumiendo que fetchChartTypes devuelve un objeto con los tipos de gráficos
    const graphTypes = await fetchChartTypes();

    // Poblamos el selector de tipos de gráficos
    Object.entries(graphTypes).forEach(([type, name]) => {
        const option = document.createElement('option'); // Crea una nueva opción <option>
        option.value = type;  // Asigna el valor de la opción (el tipo de gráfico)
        option.textContent = name;  // Asigna el texto visible (nombre del gráfico)
        chartTypeSelect.appendChild(option);  // Añade la opción al <select> de tipos de gráfico
    });

    // Poblamos el selector de colores
    const colors = ['red', 'blue', 'green', 'random'];
    colors.forEach(color => {
        const option = document.createElement('option'); // Crea una nueva opción <option>
        option.value = color;  // Asigna el valor de la opción (el color)
        option.textContent = color === 'random' ? 'Aleatorio' : color.charAt(0).toUpperCase() + color.slice(1); // Texto visible
        chartColorSelect.appendChild(option);
        detailColorSelect.append(option);
    });
}


window.addEventListener('load', populateChartOptions);

const getFormValues = () => {
    const selectedType = chartTypeSelect.value;  // Asegúrate de que el valor sea correcto
    const selectedColor = chartColorSelect.value;
    const selectedDetailColor = detailColorSelect.value;
    return {
        selectedType,
        selectedColor,
        selectedDetailColor,
    };
};



chartForm.addEventListener('change', async function(event) {
    const formData = getFormValues(); 
    await initChart(formData);  
});

async function fetchChartTypes() {
    const response = await fetch('/dashboard/get_chart_types/');
    
    if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
    }

    const data = await response.json();
    return data.chart_types;
}



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
            })
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);  // Verificar los datos devueltos por el servidor

        if (!response.ok) throw new Error('Error en la respuesta del servidor');

        return data;
    } catch (ex) {
        console.error(ex);
        alert('Ocurrió un error al obtener el gráfico: ' + ex.message);
    }
};


// Inicializar el gráfico
const initChart = async (formData) => {
    const myChart = echarts.init(document.getElementById("chart"));
    const option = await getOptionChart(formData);

    console.log(option);  // Para verificar qué opción devuelve el servidor

    if (option) {  
        myChart.setOption(option);  
        myChart.resize();  
    } else {
        console.error("La opción del gráfico es inválida");
        alert('No se pudo cargar el gráfico. Verifique la respuesta del servidor.');
    }
};

window.addEventListener("load", async () => {
    const formData = getFormValues();  
    await initChart(formData);  
});



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

