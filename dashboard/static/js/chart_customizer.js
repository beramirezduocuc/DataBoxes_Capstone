const chartForm = document.getElementById('chartForm');
const get_chart_url = "http://127.0.0.1:8000/dashboard/get_chart/";

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Si esta cookie empieza con el nombre dado, obtén su valor
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken'); // Obtén el token CSRF


chartForm.addEventListener('change', async function(event) {
    const selectedType = event.target.value;  // Obtiene el valor seleccionado
    await initChart(selectedType);  // Llama a initChart con el tipo seleccionado
});

const getOptionChart = async (selectedType) => {
    try {
        const response = await fetch(`${get_chart_url}${selectedType}/`, { // Agrega una barra '/' al final de la URL si no está
            method: 'POST',
            headers: {
                'X-CSRFToken': csrftoken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ param1: selectedType }) // Envía el tipo de gráfico seleccionado como parámetro
        });

        // Verificar si la respuesta es OK (código 200)
        if (!response.ok) {
            const errorText = await response.text(); // Leer el texto de error
            throw new Error(`Error en la respuesta del servidor: ${response.status} - ${errorText}`);
        }

        return await response.json(); // Devuelve la respuesta JSON con los datos del gráfico
    } catch (ex) {
        console.error(ex);
        alert('Ocurrió un error al obtener el gráfico: ' + ex.message);
    }
};



const initChart = async (selectedType) => {
    const myChart = echarts.init(document.getElementById("chart"));
    const option = await getOptionChart(selectedType);  // Obtiene la configuración del gráfico con los datos
    myChart.setOption(option);  // Establece los datos en el gráfico
    myChart.resize();  // Ajusta el tamaño del gráfico
};

window.addEventListener("load", async () => {
    const selectedType = chartForm.elements['Tipo_de_grafico'].value;  // Obtiene el valor inicial del formulario
    await initChart(selectedType);  // Inicializa el gráfico con el tipo seleccionado
});



chartForm.addEventListener('change', async function(event) {
    const selectedType = event.target.value;  
    await initChart(selectedType);  
});

