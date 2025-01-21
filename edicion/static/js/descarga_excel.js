document.getElementById('downloadButton').addEventListener('click', function() {
    let fileName = prompt("Ingrese el nombre del archivo:", "archivo_modificado");

    
    if (!fileName) {
        fileName = 'archivo_modificado';
    }

    //Asegurar que el nombre tenga la extensión .xlsx
    if (!fileName.endsWith('.xlsx')) {
        fileName += '.xlsx';
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Sheet1');
    const tableHeader = document.getElementById('tableHeader');
    const tableBody = document.getElementById('tableBody');

    let data = [];
    let headers = [];

    tableHeader.querySelectorAll('th').forEach(th => {
        headers.push(th.textContent);
    });

    data.push(headers);

    tableBody.querySelectorAll('tr').forEach(tr => {
        let row = [];
        tr.querySelectorAll('td').forEach(td => {
            row.push(td.textContent);
        });
        data.push(row);
    });

    // Añadir datos a la hoja de trabajo como una tabla
    worksheet.addTable({
        name: 'DataTable',
        ref: 'A1',
        headerRow: true,
        columns: headers.map(header => ({ name: header })),
        rows: data.slice(1)
    });

    //Estilizar la tabla opcionalmente
    //Ignorar por ahora, avanzar en caso de funcionalidad futura
    worksheet.getTable('DataTable').style = {
        theme: 'TableStyleMedium2',
        showRowStripes: true
    };

    //Descarga del archivo
    workbook.xlsx.writeBuffer().then(function(buffer) {
        const blob = new Blob([buffer], { type: 'application/octet-stream' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);  
        a.click();
        document.body.removeChild(a);  
        URL.revokeObjectURL(url);
    });
});