document.addEventListener("DOMContentLoaded", () => {
    const fileInput = document.getElementById("fileInput");
    const generateButton = document.getElementById("generateButton");
    const tableContainer = document.getElementById("tableContainer");
    const addRowButton = document.getElementById("addRow");
    const removeRowButton = document.getElementById("removeRow");
    const addColumnButton = document.getElementById("addColumn");
    const removeColumnButton = document.getElementById("removeColumn");
    const downloadButton = document.getElementById("downloadExcel");
    const deleteSelectedRowButton = document.getElementById("deleteSelectedRow");
    const deleteSelectedColumnButton = document.getElementById("deleteSelectedColumn");
    const sheetSelector = document.getElementById("sheetSelector");
    const addSheetButton = document.getElementById("addSheet");
    const renameSheetButton = document.getElementById("renameSheet");
    const deleteSheetButton = document.getElementById("deleteSheet");

    let workbook = new ExcelJS.Workbook();
    let currentSheet = null;
    let selectedCell = { row: null, col: null }; 


    //Función para actualizar el selector de hojas
    function updateSheetSelector() {
        sheetSelector.innerHTML = "";
        workbook.worksheets.forEach((sheet) => {
            const option = document.createElement("option");
            option.value = sheet.name;
            option.textContent = sheet.name;
            sheetSelector.appendChild(option);
        });

        //Seleccionar automáticamente la primera hoja disponible
        if (workbook.worksheets.length > 0) {
            currentSheet = workbook.getWorksheet(sheetSelector.value);
            renderTable(currentSheet);
        }
    }

    //Cambio de hoja
    sheetSelector.addEventListener("change", () => {
        currentSheet = workbook.getWorksheet(sheetSelector.value);
        renderTable(currentSheet);
    });



    //Función para procesar el archivo subido
    fileInput.addEventListener("change", async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async (e) => {
            const buffer = e.target.result;
            await workbook.xlsx.load(buffer);
            currentSheet = workbook.worksheets[0];
            updateSheetSelector();
            renderTable(currentSheet);
        };
    });

    //Función para generar un nuevo archivo Excel
    generateButton.addEventListener("click", () => {
        workbook = new ExcelJS.Workbook();
        currentSheet = workbook.addWorksheet("Hoja1");

        //Agregamos datos de ejemplo
        currentSheet.addRow(["Columna 1", "Columna 2", "Columna 3"]);
        currentSheet.addRow(["Dato 1", "Dato 2", "Dato 3"]);
        
        updateSheetSelector();
        renderTable(currentSheet);
    });

    //Función para crear una nueva hoja
    addSheetButton.addEventListener("click", () => {
        const sheetName = prompt("Ingrese el nombre de la nueva hoja:");
        if (!sheetName) return;
    
        if (workbook.getWorksheet(sheetName)) {
            alert("Ya existe una hoja con ese nombre.");
            return;
        }
    
        
        const newSheet = workbook.addWorksheet(sheetName);
    
        //Inicializar la nueva hoja con encabezados
        newSheet.addRow(["Encabezado 1", "Encabezado 2", "Encabezado 3"]);
        //newSheet.addRow(["", "", ""]); 
    
        //Actualizar la hoja actual y el selector
        currentSheet = newSheet;
        updateSheetSelector();
        renderTable(currentSheet);
    });

    //Función para renombrar la hoja actual
    renameSheetButton.addEventListener("click", () => {
        if (!currentSheet) return;

        const newName = prompt("Ingrese el nuevo nombre de la hoja:");
        if (!newName) return;

        if (workbook.getWorksheet(newName)) {
            alert("Ya existe una hoja con ese nombre.");
            return;
        }

        currentSheet.name = newName;
        updateSheetSelector();
    });

    //Función para eliminar la hoja actual
    deleteSheetButton.addEventListener("click", () => {
        if (!currentSheet) return;

        if (workbook.worksheets.length === 1) {
            alert("No puedes eliminar la única hoja disponible.");
            return;
        }

        workbook.removeWorksheet(currentSheet.id);
        currentSheet = workbook.worksheets[0]; 
        updateSheetSelector();
        renderTable(currentSheet);
    });

    //Función para renderizar la tabla
    function renderTable(sheet) {
        tableContainer.innerHTML = "";
        const table = document.createElement("table");
        table.className = "table-auto w-full border-collapse border border-gray-300";

        sheet.eachRow((row, rowIndex) => {
            const tr = document.createElement("tr");
            tr.className = rowIndex === 1 ? "bg-gray-100 font-bold" : "";

            row.eachCell((cell, colIndex) => {
                const td = document.createElement(rowIndex === 1 ? "th" : "td");
                td.className = "border border-gray-300 px-4 py-2";
                td.contentEditable = true;
                td.tabIndex = 0;
                td.textContent = cell.value || "";
                
                //Guardamos cambios en la celda
                td.addEventListener("click", () => {
                    selectedCell.row = rowIndex;
                    selectedCell.col = colIndex;
                    console.log(`Celda seleccionada: Fila ${rowIndex}, Columna ${colIndex}`);
                });
                
                //Aplica los formatos
                td.addEventListener("blur", () => {
                    let value = td.textContent.trim();
                    const cell = sheet.getRow(rowIndex).getCell(colIndex);
                
                    //Aplicar conversión a minúsculas (excepto encabezados)
                    if (rowIndex > 1 && typeof value === "string") {
                        value = value.toLowerCase();
                        td.textContent = value;
                    }
                
                    //Verificar si el contenido es completamente numérico
                    if (!isNaN(value) && value !== "") {
                        value = Number(value);
                        td.style.textAlign = "right";
                        
                        //Guardar como número en Excel y aplicar formato numérico
                        cell.value = value;
                        cell.numFmt = "0.00";
                        cell.type = ExcelJS.ValueType.Number;
                    } else {
                        td.style.textAlign = "center";
                        
                        //Guardar como texto en Excel
                        cell.value = value;
                        cell.numFmt = "@";
                        cell.type = ExcelJS.ValueType.String;
                    }

                    sheet.getRow(rowIndex).getCell(colIndex).value = td.textContent;
                });

                tr.appendChild(td);
            });

            table.appendChild(tr);
        });

        tableContainer.appendChild(table);
    }

    //Función para manejar la navegación con teclado
    function handleNavigation(event) {
        const activeCell = document.activeElement;
        if (!activeCell || activeCell.tagName !== "TD") return;

        const row = activeCell.parentElement;
        const cellIndex = [...row.children].indexOf(activeCell);
        const rowIndex = [...row.parentElement.children].indexOf(row);

        switch (event.key) {
            case "Enter":
                event.preventDefault();
                const nextRow = row.nextElementSibling;

                if (nextRow) {
                    nextRow.children[cellIndex].focus();
                } else {
                    addNewRow();
                    tableContainer.querySelector("table tr:last-child td:nth-child(" + (cellIndex + 1) + ")").focus();
                }
                break;

            case "ArrowDown":
                event.preventDefault();
                if (row.nextElementSibling) row.nextElementSibling.children[cellIndex].focus();
                break;

            case "ArrowUp":
                event.preventDefault();
                if (row.previousElementSibling) row.previousElementSibling.children[cellIndex].focus();
                break;

            case "ArrowRight":
                event.preventDefault();
                if (activeCell.nextElementSibling) activeCell.nextElementSibling.focus();
                break;

            case "ArrowLeft":
                event.preventDefault();
                if (activeCell.previousElementSibling) activeCell.previousElementSibling.focus();
                break;
        }
    }



    //Función para eliminar una fila específica
    deleteSelectedRowButton.addEventListener("click", () => {
        if (!currentSheet || selectedCell.row === null || selectedCell.row < 1) return;

        currentSheet.spliceRows(selectedCell.row, 1);
        renderTable(currentSheet);
    });

    //Función para eliminar una columna específica
    deleteSelectedColumnButton.addEventListener("click", () => {
        if (!currentSheet || selectedCell.col === null || selectedCell.col < 1) return;

        const colIndex = selectedCell.col;
        currentSheet.eachRow((row) => {
            row.splice(colIndex, 1); 
        });

        currentSheet.columns.splice(colIndex - 1, 1);
        renderTable(currentSheet);
    });

    //Función para añadir una nueva fila automáticamente
    function addNewRow() {
        if (!currentSheet) return;
        const newRow = currentSheet.addRow([]);
        for (let i = 1; i <= currentSheet.columns.length; i++) {
            newRow.getCell(i).value = "";
        }
        renderTable(currentSheet);
    }

    //Detectar teclas en la tabla
    tableContainer.addEventListener("keydown", handleNavigation);

    //Función para añadir una nueva fila con ENTER
    addRowButton.addEventListener("click", () => {
        if (!currentSheet) return;
        const newRow = currentSheet.addRow([]);
        for (let i = 1; i <= currentSheet.columns.length; i++) {
            newRow.getCell(i).value = "";
        }
        renderTable(currentSheet);
    });

    //Función para eliminar la última fila
    removeRowButton.addEventListener("click", () => {
        if (!currentSheet || currentSheet.rowCount <= 1) return; //Evita borrar todo el contenido

        const lastRow = currentSheet.rowCount; 
        currentSheet.spliceRows(lastRow, 1); 

        //Actualizar manualmente la cuenta de filas en ExcelJS
        currentSheet._rows.pop();

        renderTable(currentSheet);
    });

    
    //Función para añadir una nueva columna
    addColumnButton.addEventListener("click", () => {
        if (!currentSheet) return;
        const colIndex = currentSheet.columns.length + 1;
        currentSheet.columns = [...currentSheet.columns, { key: `Col${colIndex}`, width: 10 }];

        currentSheet.eachRow((row, rowIndex) => {
            row.getCell(colIndex).value = rowIndex === 1 ? `Columna ${colIndex}` : "";
        });

        renderTable(currentSheet);
    });

    //Función para eliminar la última columna
    removeColumnButton.addEventListener("click", () => {
        if (!currentSheet || currentSheet.columns.length <= 1) return;
        const colIndex = currentSheet.columns.length;
        currentSheet.eachRow((row) => {
            row.splice(colIndex, 1);
        });

        currentSheet.columns.pop(); 
        renderTable(currentSheet);
    });


    //Función para la descarga
    downloadButton.addEventListener("click", () => {
        if (!workbook || !currentSheet) return;
    
        
        let fileName = prompt("Ingrese el nombre del archivo:", "archivo_editado");
        
        
        if (!fileName || fileName.trim() === "") {
            fileName = "archivo_editado";
        }
    
        
        const table = document.querySelector("table");
        if (table) {
            table.querySelectorAll("tr").forEach((rowElement, rowIndex) => {
                const row = currentSheet.getRow(rowIndex + 1);
                rowElement.querySelectorAll("td, th").forEach((cellElement, colIndex) => {
                    row.getCell(colIndex + 1).value = cellElement.textContent;
                });
            });
        }
    
        //Generar el archivo Excel
        workbook.xlsx.writeBuffer().then((buffer) => {
            const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName + ".xlsx";
            link.click();
        });
    });


});
