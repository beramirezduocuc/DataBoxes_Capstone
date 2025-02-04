document.addEventListener("DOMContentLoaded", () => {
    fetch("http://127.0.0.1:8000/dashboard/recieve/", {  // Cambié la URL a /recieve/
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    })
        .then((response) => {
            // Verifica si la respuesta es JSON válida
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then((data) => {
            const preview = document.getElementById("preview");
            preview.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`; // Renderiza los datos
        })
        .catch((error) => {
            console.error("Error al obtener datos:", error);
        });
});
