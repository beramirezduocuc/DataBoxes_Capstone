document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        //Nos aseguramos de que el archivo sea del formato .xlsx para evitar
        //errores en el caso de que alguien tratara de hacer algo como subir un word
        const fileName = file.name;
        if (!fileName.endsWith('.xlsx')) {
            alert('Por favor, suba un archivo con la extensión .xlsx.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(e) {
            const arrayBuffer = e.target.result;
            const workbook = new ExcelJS.Workbook();

            workbook.xlsx.load(arrayBuffer).then(function() {
                const worksheet = workbook.getWorksheet(1);
                const tableHeader = document.getElementById('tableHeader');
                const tableBody = document.getElementById('tableBody');

                // Limpiar tabla existente
                tableHeader.innerHTML = '';
                tableBody.innerHTML = '';

                // Crear encabezados de tabla
                const headerRow = worksheet.getRow(1);
                headerRow.eachCell(function(cell) {
                    const th = document.createElement('th');
                    th.textContent = cell.value;
                    tableHeader.appendChild(th);
                });

                // Crear cuerpo de la tabla
                worksheet.eachRow(function(row, rowNumber) {
                    if (rowNumber === 1) return; // Saltar encabezado
                    const tr = document.createElement('tr');
                    row.eachCell(function(cell) {
                        const td = document.createElement('td');
                        td.contentEditable = true; // Hacer celdas editables
                        td.textContent = cell.value || '';
                        tr.appendChild(td);
                    });
                    tableBody.appendChild(tr);
                });

                // Mostrar botón de descarga
                document.getElementById('downloadButton').classList.remove('hidden');
            });
        };
        reader.readAsArrayBuffer(file);
    }
});

// Añadir nueva fila
document.getElementById('addRowButton').addEventListener('click', function() {
    const tableBody = document.getElementById('tableBody');
    const newRow = document.createElement('tr');

    // Obtener el número de columnas de la primera fila de la tabla
    const columnCount = document.getElementById('tableHeader').children.length;

    for (let i = 0; i < columnCount; i++) {
        const newCell = document.createElement('td');
        newCell.contentEditable = 'true'; // Permitir edición de la nueva celda
        newCell.textContent = ''; // Celda vacía por defecto
        newRow.appendChild(newCell);
    }
    tableBody.appendChild(newRow);
});

// Añadir nueva columna
document.getElementById('addColumnButton').addEventListener('click', function() {
    const tableHeader = document.getElementById('tableHeader');
    const newHeaderCell = document.createElement('th');
    newHeaderCell.contentEditable = 'true'; // Permitir edición del nuevo encabezado
    newHeaderCell.textContent = 'Nueva Columna'; // Texto por defecto
    tableHeader.appendChild(newHeaderCell);

    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(function(row) {
        const newCell = document.createElement('td');
        newCell.contentEditable = 'true'; // Permitir edición de la nueva celda
        newCell.textContent = ''; // Celda vacía por defecto
        row.appendChild(newCell);
    });
});

// Función para eliminar la última columna
document.getElementById('removeColumnButton').addEventListener('click', function() {
    // Eliminar el último encabezado de la tabla
    const tableHeader = document.getElementById('tableHeader');
    const lastHeaderCell = tableHeader.lastElementChild;
    if (lastHeaderCell) {
        tableHeader.removeChild(lastHeaderCell);
    }

    // Eliminar la última celda de cada fila en el cuerpo de la tabla
    const tableBody = document.getElementById('tableBody');
    const rows = tableBody.querySelectorAll('tr');
    rows.forEach(function(row) {
        const lastCell = row.lastElementChild;
        if (lastCell) {
            row.removeChild(lastCell);
        }
    });
});

// Función para eliminar la última fila
document.getElementById('removeRowButton').addEventListener('click', function() {
    // Obtener el cuerpo de la tabla
    const tableBody = document.getElementById('tableBody');
    const lastRow = tableBody.lastElementChild;

    // Eliminar la última fila si existe
    if (lastRow) {
        tableBody.removeChild(lastRow);
    }
});
