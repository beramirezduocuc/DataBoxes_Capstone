// Función para obtener los valores de los colores seleccionados para cada serie
const getSeriesColors = (numSeries) => {
    let seriesColors = [];

    for (let i = 0; i < numSeries; i++) {
        const colorSelector = document.getElementById(`seriesColorSelect${i}`);
        const selectedColor = colorSelector.value;
        seriesColors.push(selectedColor === 'random' ? getRandomColor() : selectedColor);
    }

    return seriesColors;
};

// Cuando cargues el gráfico, crea los selectores basados en el número de series
const numSeries = 2;  // Aquí es donde decides cuántas series tienes
createColorSelectors(numSeries);  // Llamar a la función para crear selectores de color

// En tu lógica para enviar el formulario o actualizar el gráfico, usa `getSeriesColors`:
const formData = getFormValues();
const seriesColors = getSeriesColors(numSeries);

// Enviar seriesColors junto con el resto del formData
