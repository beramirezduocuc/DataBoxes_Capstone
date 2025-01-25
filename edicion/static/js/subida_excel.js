document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const generateButton = document.getElementById("generateButton");
    const tableContainer = document.getElementById("tableContainer");
    const addRowButton = document.getElementById("addRow");
    const deleteRowButton = document.getElementById("deleteRow");
    const addColumnButton = document.getElementById("addColumn");
    const deleteColumnButton = document.getElementById("deleteColumn");
    const addSheetButton = document.getElementById("addSheet");
    const sheetButtonsContainer = document.getElementById("sheetButtons");
    const downloadButton = document.getElementById("downloadButton");
  
    let workbook = new ExcelJS.Workbook();
    let currentWorksheet = null;
  
    // Función para procesar un archivo Excel subido
    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (file) {
          const reader = new FileReader();
      
          reader.onload = async (e) => {
            const buffer = e.target.result;
            await workbook.xlsx.load(buffer);
      
            // Iterar por cada hoja del archivo y eliminar tablas existentes
            workbook.worksheets.forEach((worksheet) => {
              if (worksheet.tables && worksheet.tables.length > 0) {
                worksheet.tables.forEach((table) => worksheet.removeTable(table.name));
              }
            });
      
            // Cargar la primera hoja por defecto
            loadSheet(workbook.worksheets[0]);
            updateSheetButtons();
          };
      
          reader.readAsArrayBuffer(file);
        }
      });
  
    //Función para generar un archivo Excel vacío
    generateButton.addEventListener("click", () => {
        workbook = new ExcelJS.Workbook();
        const worksheet = workbook.addWorksheet("Hoja1");
        worksheet.addRow(["Columna 1", "Columna 2", "Columna 3"]);
        worksheet.addRow(["Dato 1", "Dato 2", "Dato 3"]);
        loadSheet(worksheet);
        updateSheetButtons();
    });
  
    // Cargar y renderizar una hoja específica
    function loadSheet(worksheet) {
        currentWorksheet = worksheet;
        renderTable(worksheet);
    }
  
    // Actualizar los botones de navegación entre hojas
    function updateSheetButtons() {
        sheetButtonsContainer.innerHTML = ""; // Limpiar botones existentes
        workbook.worksheets.forEach((sheet, index) => {
            const button = document.createElement("button");
            button.textContent = sheet.name;
            button.className =
                "bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 focus:bg-blue-500";
        button.addEventListener("click", () => loadSheet(sheet));
        sheetButtonsContainer.appendChild(button);
        });
    }
  
    // Función para añadir una fila
    addRowButton.addEventListener("click", () => {
        if (currentWorksheet) {
            currentWorksheet.addRow(Array(currentWorksheet.columnCount).fill(""));
            renderTable(currentWorksheet);
        }
    });
  
    // Función para eliminar la última fila
    deleteRowButton.addEventListener("click", () => {
        if (currentWorksheet && currentWorksheet.rowCount > 0) {
            currentWorksheet.spliceRows(currentWorksheet.rowCount, 1);
            renderTable(currentWorksheet);
        }
    });
  
    // Función para añadir una columna
    addColumnButton.addEventListener("click", () => {
        if (currentWorksheet) {
            currentWorksheet.eachRow((row) => {
            row.getCell(row.cellCount + 1).value = ""; // Añadimos una celda vacía
        });
        renderTable(currentWorksheet);
        }
    });
  
    // Función para eliminar la última columna
    deleteColumnButton.addEventListener("click", () => {
        if (currentWorksheet && currentWorksheet.columnCount > 0) {
        currentWorksheet.eachRow((row) => {
            row.splice(row.cellCount, 1); // Eliminamos la última celda
        });
        renderTable(currentWorksheet);
      }
    });
    
    //Función para crear hojas
    addSheetButton.addEventListener("click", () => {
        const newSheet = workbook.addWorksheet(`Hoja${workbook.worksheets.length + 1}`);
      
        //Añadimos una fila inicial con encabezados predeterminados, esto se hace porque no podemos editar la hoja si 
        //empieza en blanco, en parte tambien es debido a como los botones de filas y columnas funcionan, la misma validacion
        //que impide crear filas o columnas sin haber subido o generado un documento provocan esto, de todas formas esta es la
        //solucion que considero optima
        newSheet.addRow(["Columna 1", "Columna 2", "Columna 3"]);
      
        loadSheet(newSheet);
        updateSheetButtons();
    });
  
    //Función para renderizar una tabla editable
    function renderTable(worksheet) {
        const table = document.createElement("table");
        table.className = "table-auto w-full border-collapse border border-gray-300";
      
        worksheet.eachRow((row, rowIndex) => {
          const tr = document.createElement("tr");
      
          row.eachCell((cell, colIndex) => {
            const cellElement = document.createElement(rowIndex === 1 ? "th" : "td");
            cellElement.className = "border border-gray-300 px-4 py-2";
      
            // Alineamos los números a la derecha
            if (typeof cell.value === "number") {
              cellElement.style.textAlign = "right";
            }
      
            // Hacemos la celda editable
            cellElement.contentEditable = true;
      
            // Cambiamos el valor en el worksheet al editar
            cellElement.addEventListener("input", (e) => {
              const newValue = e.target.textContent;
      
              // Detectar si el valor es numérico
              if (!isNaN(newValue) && newValue.trim() !== "") {
                // Si es un número, guardamos como número y alineamos a la derecha
                row.getCell(colIndex).value = parseFloat(newValue);
                row.getCell(colIndex).numFmt = "0.00"; // Formato numérico con dos decimales
                cellElement.style.textAlign = "right";
              } else {
                // Si no es un número, guardamos como texto
                row.getCell(colIndex).value = newValue;
                row.getCell(colIndex).numFmt = undefined; // Quitar formato numérico
                cellElement.style.textAlign = "left";
              }
            });
      
            cellElement.textContent = cell.value || "";
            tr.appendChild(cellElement);
          });
      
          table.appendChild(tr);
        });
      
        tableContainer.innerHTML = ""; // Limpiamos el contenedor
        tableContainer.appendChild(table);
      }
    
    downloadButton.addEventListener("click", () => {
        // Pedimos al usuario que ingrese un nombre para el archivo
        const fileName = prompt("Por favor, ingrese el nombre del archivo:", "documento.xlsx");
        const finalFileName = fileName && fileName.trim() !== "" ? fileName.trim() : "documento.xlsx";
      
        // Convertir los datos de cada hoja a una tabla antes de descargar
        workbook.worksheets.forEach((worksheet) => {
          // Si la hoja tiene datos, definimos un rango y creamos una tabla
          if (worksheet.rowCount > 0 && worksheet.columnCount > 0) {
            const columns = [];
            const firstRow = worksheet.getRow(1);
      
            // Crear encabezados basados en la primera fila
            firstRow.eachCell((cell, colIndex) => {
              columns.push({ name: cell.value || `Columna ${colIndex}`, filterButton: true });
            });
      
            // Definir el rango de la tabla
            const tableRange = `A1:${worksheet.getColumn(worksheet.columnCount).letter}${worksheet.rowCount}`;
      
            // Crear la tabla
            worksheet.addTable({
                name: `Tabla_${worksheet.name}`, // Nombre único basado en la hoja
                ref: "A1",
                headerRow: true,
                style: {
                    theme: "TableStyleMedium9", // Estilo de tabla (puedes cambiarlo)
                    showRowStripes: true,
                },
                columns: columns,
                rows: worksheet.getSheetValues().slice(2).map((row) => row.slice(1)), // Filas sin el encabezado y celdas vacías
            });
            }
        });
      
        // Generar el archivo Excel y descargarlo
        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
          const link = document.createElement("a");
          link.href = URL.createObjectURL(blob);
          link.download = finalFileName;
          link.click();
        });
    });

      
});
  