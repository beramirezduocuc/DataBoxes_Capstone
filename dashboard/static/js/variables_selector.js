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
                variableContainer.classList.toggle("bg-red-500");
                
                // Obtener el nombre de la variable del atributo data-name
                const variableName = event.currentTarget.getAttribute('data-name');
                
                // Agregar la variable seleccionada al array
                if (!variable_selection.includes(variableName)) {
                    variable_selection.push(variableName);
                } else {
                    // Si ya está seleccionada, eliminarla del array
                    variable_selection = variable_selection.filter(v => v !== variableName);
                }
                
                console.log("Variables seleccionadas:", variable_selection);
            });
        }
    }
});
