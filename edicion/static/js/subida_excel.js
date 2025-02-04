document.addEventListener("DOMContentLoaded", () => {
  const fileInput = document.getElementById("fileInput");
  const generateButton = document.getElementById("generateButton");
  const tableContainer = document.getElementById("tableContainer");
  const addRowButton = document.getElementById("addRow");
  const addColumnButton = document.getElementById("addColumn");
  const deleteRowButton = document.getElementById("deleteRow");
  const deleteColumnButton = document.getElementById("deleteColumn");
  const deleteSpecificRowButton = document.getElementById("deleteSpecificRow");
  const deleteSpecificColumnButton = document.getElementById("deleteSpecificColumn");
  const addSheetButton = document.getElementById("addSheet");
  const deleteSheetButton = document.getElementById("deleteSheet");
  const sheetSelector = document.getElementById("sheetSelector");
  const renameSheetInput = document.getElementById("renameSheetInput");
  const renameSheetButton = document.getElementById("renameSheet");
  const downloadButton = document.getElementById("downloadExcel");

  let selectedRow = null; // Para la fila seleccionada
  let selectedColumnIndex = null; // Para la columna seleccionada
  let currentWorksheet = null; // Hoja activa
  const workbook = new ExcelJS.Workbook(); // Manejaremos todas las hojas aquí
  

  // Función para procesar un archivo Excel subido
  fileInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (file) {
      const workbook = new ExcelJS.Workbook();
      const reader = new FileReader();

      reader.onload = async (e) => {
        const buffer = e.target.result;
        await workbook.xlsx.load(buffer);
        const worksheet = workbook.getWorksheet(1); // Primera hoja

        renderTable(worksheet);
      };

      reader.readAsArrayBuffer(file);
    }
  });

  // Función para generar un archivo Excel vacío y mostrarlo como tabla
  generateButton.addEventListener("click", () => {
    const worksheet = workbook.addWorksheet("Hoja1");
    worksheet.addRow(["Encabezado 1", "Encabezado 2", "Encabezado 3"]);
    worksheet.addRow(["Dato 1", "Dato 2", "Dato 3"]);

    currentWorksheet = worksheet;
    updateSheetSelector();
    renderTable(worksheet);
  });

  // Función para actualizar la lista de hojas en el selector
  function updateSheetSelector() {
    sheetSelector.innerHTML = ""; // Limpiar selector
    workbook.eachSheet((worksheet, sheetId) => {
      const option = document.createElement("option");
      option.value = sheetId;
      option.textContent = worksheet.name;
      sheetSelector.appendChild(option);
    });

    if (workbook.worksheets.length > 0) {
      sheetSelector.value = workbook.worksheets.indexOf(currentWorksheet) + 1;
    }
  }

  // Crear una nueva hoja con una tabla base
  addSheetButton.addEventListener("click", () => {
    const sheetName = prompt("Introduce un nombre para la nueva hoja:");
    if (!sheetName) return;

    const worksheet = workbook.addWorksheet(sheetName);
    worksheet.addRow(["Encabezado 1", "Encabezado 2", "Encabezado 3"]);
    worksheet.addRow(["Dato 1", "Dato 2", "Dato 3"]);

    currentWorksheet = worksheet;
    updateSheetSelector();
    renderTable(worksheet);
  });

  // Cambiar entre hojas desde el selector
  sheetSelector.addEventListener("change", (e) => {
    const sheetId = parseInt(e.target.value, 10);
    currentWorksheet = workbook.getWorksheet(sheetId);
    renderTable(currentWorksheet);
  });

  // Renombrar la hoja actual
  renameSheetButton.addEventListener("click", () => {
    if (!currentWorksheet) return alert("No hay una hoja seleccionada.");
    const newName = renameSheetInput.value.trim();
    if (!newName) return alert("Introduce un nombre válido.");
    currentWorksheet.name = newName;
    updateSheetSelector();
  });

  // Eliminar la hoja actual
  deleteSheetButton.addEventListener("click", () => {
    if (workbook.worksheets.length <= 1) {
      return alert("No puedes eliminar todas las hojas.");
    }

    const sheetIndex = workbook.worksheets.indexOf(currentWorksheet);
    workbook.removeWorksheet(sheetIndex + 1); // ExcelJS usa índices base 1
    currentWorksheet = workbook.worksheets[0];
    updateSheetSelector();
    renderTable(currentWorksheet);
  });

  function applyNumericFormat(td, rowIndex, colIndex, worksheet) {
    function formatCell() {
      const value = td.textContent.trim();
      if (!isNaN(value) && value !== "") {
        td.style.textAlign = "right"; // Alinear a la derecha
        worksheet.getCell(rowIndex, colIndex).value = parseFloat(value); // Convertir a número
        worksheet.getCell(rowIndex, colIndex).numFmt = "0.00"; // Formato numérico con dos decimales
        worksheet.getCell(rowIndex, colIndex).alignment = { horizontal: "right" };
      } else {
        td.style.textAlign = "center"; // Alinear al centro si no es un número
        worksheet.getCell(rowIndex, colIndex).value = value || null; // Texto o vacío
        worksheet.getCell(rowIndex, colIndex).alignment = { horizontal: "center" };
      }
    }

    // Aplicar formato inmediatamente
    formatCell();

    // Escuchar cambios dinámicos
    td.addEventListener("input", formatCell);
  }

  // Función para renderizar una tabla editable
  function renderTable(worksheet) {
    const table = document.createElement("table");
    table.className = "table-auto w-full border-collapse border border-gray-300";

    worksheet.eachRow((row, rowIndex) => {
      const tr = document.createElement("tr");
      tr.className = rowIndex === 1 ? "bg-gray-100 font-bold" : "";

      row.eachCell((cell, colIndex) => {
        const td = document.createElement(rowIndex === 1 ? "th" : "td");
        td.className = "border border-gray-300 px-4 py-2";
        td.contentEditable = true; // Hacemos todas las celdas editables
        td.textContent = cell.value || "";

        // Aplicar formato numérico
        applyNumericFormat(td, rowIndex, colIndex, worksheet);

        tr.appendChild(td);
      });

      table.appendChild(tr);
    });

    table.addEventListener("click", (e) => {
      if (e.target.tagName === "TD" || e.target.tagName === "TH") {
        selectedRow = e.target.parentElement;
        selectedColumnIndex = Array.from(selectedRow.children).indexOf(e.target);
      }
    });

    // Habilitar navegación con Enter
    enableEnterNavigation(table);

    tableContainer.innerHTML = "";
    tableContainer.appendChild(table);
  }

  // Función para habilitar navegación con Enter
  function enableEnterNavigation(table) {
    table.addEventListener("keydown", (event) => {
      if (event.key === "Enter" && event.target.tagName === "TD") {
        event.preventDefault(); // Prevenir el comportamiento predeterminado de Enter

        const cell = event.target;
        const row = cell.parentElement;
        const currentCellIndex = Array.from(row.children).indexOf(cell);
        const nextRow = row.nextElementSibling;

        if (nextRow) {
          // Mover al siguiente TD en la misma columna
          nextRow.cells[currentCellIndex].focus();
        } else {
          // Añadir una nueva fila y mover el foco
          const newRow = table.insertRow();
          Array.from(table.rows[0].cells).forEach((_, colIndex) => {
            const newCell = document.createElement("td");
            newCell.className = "border border-gray-300 px-4 py-2";
            newCell.contentEditable = true;
            newRow.appendChild(newCell);

            // Aplicar formato numérico a la nueva celda
            applyNumericFormat(newCell, newRow.rowIndex, colIndex + 1, currentWorksheet);
          });
          newRow.cells[currentCellIndex].focus();
        }
      }
    });
  }

  
  // Función para añadir una nueva fila
  addRowButton.addEventListener("click", () => {
    const table = tableContainer.querySelector("table");
    if (!table) return;
  
    const newRow = table.insertRow();
    Array.from(table.rows[0].cells).forEach((_, colIndex) => {
      const td = document.createElement("td");
      td.className = "border border-gray-300 px-4 py-2";
      td.contentEditable = true;
      newRow.appendChild(td);
  
      // Aplicar formato numérico dinámico
      applyNumericFormat(td, newRow.rowIndex, colIndex + 1, currentWorksheet);
    });
  });
  

  //Función para añadir una nueva columna
  addColumnButton.addEventListener("click", () => {
    const table = tableContainer.querySelector("table");
    if (!table) return;
  
    Array.from(table.rows).forEach((row, rowIndex) => {
      const cell = document.createElement(rowIndex === 0 ? "th" : "td");
      cell.className = "border border-gray-300 px-4 py-2";
      cell.contentEditable = true;
      cell.textContent = rowIndex === 0 ? `Nueva Columna` : "";
      row.appendChild(cell);
  
      // Aplicar formato numérico dinámico
      applyNumericFormat(cell, rowIndex + 1, row.cells.length, currentWorksheet);
    });
  });
  

  //Función para eliminar la última fila
  deleteRowButton.addEventListener("click", () => {
    const table = tableContainer.querySelector("table");
    if (!table || table.rows.length <= 2) return alert("No puedes eliminar todas las filas.");
    table.deleteRow(-1);
  });

  //Función para eliminar la última columna
  deleteColumnButton.addEventListener("click", () => {
    const table = tableContainer.querySelector("table");
    if (!table || table.rows[0].cells.length <= 1) return alert("No puedes eliminar todas las columnas.");

    Array.from(table.rows).forEach((row) => row.deleteCell(-1));
  });

  //Función para eliminar filas específicas
  deleteSpecificRowButton.addEventListener("click", () => {
    const table = tableContainer.querySelector("table");
    if (!table || !selectedRow || table.rows.length <= 2) return alert("Selecciona una fila válida para eliminar.");
    selectedRow.remove();
    selectedRow = null;
  });

  //Función para eliminar columnas específicas
  deleteSpecificColumnButton.addEventListener("click", () => {
    const table = tableContainer.querySelector("table");
    if (!table || selectedColumnIndex === null || table.rows[0].cells.length <= 1)
      return alert("Selecciona una columna válida para eliminar.");

    Array.from(table.rows).forEach((row) => row.deleteCell(selectedColumnIndex));
    selectedColumnIndex = null;
  });

  //Descarga del archivo Excel
  downloadButton.addEventListener("click", async () => {
    if (workbook.worksheets.length === 0) {
      return alert("No hay datos en el archivo para descargar.");
    }
  
    
    const fileName = prompt("Introduce un nombre para el archivo (sin extensión):", "mi archivo");
    const finalFileName = fileName && fileName.trim() !== "" ? `${fileName.trim()}.xlsx` : "mi archivo.xlsx";
  
    //Convertir hojas en tablas para su uso en Excel
    workbook.eachSheet((worksheet) => {
      const lastRow = worksheet.lastRow.number;
      const lastCol = worksheet.columnCount;
  
      
      const range = `A1:${String.fromCharCode(64 + lastCol)}${lastRow}`;
  
      worksheet.addTable({
        name: `Tabla_${worksheet.name}`,
        ref: "A1",
        headerRow: true,
        style: {
          theme: "TableStyleMedium2",
          showRowStripes: true,
        },
        columns: worksheet.getRow(1).values.slice(1).map((header) => ({
          name: header || "",
          filterButton: true,
        })),
        rows: worksheet.getRows(2, lastRow - 1).map((row) => row.values.slice(1)), 
      });
    });
  
    // Generar el archivo Excel y descargar
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = finalFileName;
    link.click();
  });
  
});