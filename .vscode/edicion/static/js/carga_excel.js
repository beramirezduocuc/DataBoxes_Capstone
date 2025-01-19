document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
//Si no se proporciona un nombre, se usa uno por defecto, 
    //el nombre por defecto puede ser cambiado solo editalo aqui
    if (file) {
        const fileName = file.name;
        if (!fileName.endsWith('.xlsx')) {
            alert('Por favor, suba un archivo con la extensión .xlsx.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            window.workbook = new ExcelJS.Workbook(); // Declaración global

            window.workbook.xlsx.load(arrayBuffer).then(function() {
                populateSheetSelector();
                displaySheet(window.workbook.getWorksheet(1));

                // Mostrar botón de descarga
                document.getElementById('downloadButton').classList.remove('hidden');
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

