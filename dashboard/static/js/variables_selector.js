let filtro_url = "http://127.0.0.1:8000/dashboard/filtro/";
document.addEventListener("DOMContentLoaded", () => {
    let initial_variable_number_raw = document.getElementById('initial_variable_numbers');
    let initial_variable_number = initial_variable_number_raw ? initial_variable_number_raw.value : 0; 
    let variable_selection = [];

    console.log("chartNumbers:", initial_variable_number);
    for (let i = 0; i < initial_variable_number; i++) {
        const variableSelector = document.getElementById(`variableSelector${i}`);
        const variableContainer = document.getElementById(`variableContainer${i}`);

        if (variableSelector) {
            variableSelector.addEventListener("click", (event) => {
                variableContainer.classList.toggle("bg-gray-300");
                const icon = document.createElement("i");
                icon.className = "fa-solid fa-check";
        
                if (!variableContainer.querySelector("i")) {
                    variableContainer.appendChild(icon); 
                } else {
                    variableContainer.removeChild(variableContainer.querySelector("i")); 
                }
                const variableName = event.currentTarget.getAttribute('data-name');
                
                if (!variable_selection.includes(variableName)) {
                    variable_selection.push(variableName);
                } else {
                    variable_selection = variable_selection.filter(v => v !== variableName);
                }
                
                console.log("Variables seleccionadas:", variable_selection);
            });
        }
    }

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

    document.getElementById("submitSelection").addEventListener("click", () => {
        fetch(filtro_url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrftoken  // Utiliza la variable csrftoken aquí
            },
            body: JSON.stringify({ variables: variable_selection })
        })
        .then(response => response.json())
        .then(data => {
            console.log("Datos recibidos del servidor:", data);
        })
        .catch(error => console.error("Error al enviar las variables:", error));
    });

});


//1) PASAR DATAFRAME ENTRE PAGINAS Y LISTA DE SELECCION ENTRE PAGINAS
//2) GUARDAR DATOS (TEMPORAL/PERMANENTE) Y ENVIARSELOS AL GRAFICO
//3) GRAFICO CARGADO CON DATOS --> GUARDAR GRAFICO (ESTO ES UNA SIMPLIFICACION)