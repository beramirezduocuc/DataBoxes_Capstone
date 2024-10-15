const sidebar = document.getElementById("sidebar");
const sidebarBtn = document.getElementById("sidebarBtn");

sidebarBtn.addEventListener("click", (event) => {
    sidebar.classList.toggle("hidden");
    event.preventDefault();
});

// Detectar clic fuera del sidebar en dispositivos móviles
document.addEventListener("click", (event) => {
    const isClickInside = sidebar.contains(event.target) || sidebarBtn.contains(event.target);
    
    if (!isClickInside && window.innerWidth < 1024) { 
        sidebar.classList.add("hidden");
    }
});
