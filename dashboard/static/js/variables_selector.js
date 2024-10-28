

let submitSelectionButton = document.getElementById("submitSelection");

document.addEventListener("DOMContentLoaded", () => {
    let initial_variable_number_raw = document.getElementById('initial_variable_numbers');
    let initial_variable_number = initial_variable_number_raw ? initial_variable_number_raw.value : 0; 
    let variable_selection = [];

    console.log("chartNumbers:", initial_variable_number);

    // Configuración de selección de variables
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

    // Función para obtener CSRF Token
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
    let filtro_url = "http://127.0.0.1:8000/dashboard/temp_csv/";


    const submitSelectionButton = document.getElementById("submitSelection");
    
    if (submitSelectionButton) {
        submitSelectionButton.addEventListener("click", (event) => {
            event.preventDefault();
        
            const formData = new FormData();
            const fileInput = document.getElementById("file-upload");
            
            if (!fileInput.files[0]) {
                console.error("Archivo no seleccionado");
                return;
            }
        
            formData.append('file', fileInput.files[0]);
            formData.append('variable_selection', JSON.stringify(variable_selection));
            console.log("Enviando archivo y variables:", fileInput.files[0], variable_selection);
        
            fetch(filtro_url, {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrftoken,
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error en la respuesta del servidor, código: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Datos recibidos del servidor:", data);
            })
            .catch(error => console.error("Error al enviar las variables:", error));
        });
        
    } else {
        console.error("Botón de confirmación de selección (submitSelection) no encontrado.");
    }
    

    const fileForm = document.getElementById('fileForm');
    fileForm.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const formData = new FormData(fileForm);

    fetch(filtro_url, {
        method: 'POST',
        headers: {
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.csv_data) {
            window.location.href = 'http://127.0.0.1:8000/dashboard/create_chart/';
        }
    })
    .catch(error => console.error("Error al enviar el archivo:", error));
});

});    