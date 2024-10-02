const sidebar = document.getElementById("sidebar");
const sidebarBtn = document.getElementById("sidebarBtn");

function sideShow() {
    if (sidebar) {
        sidebar.classList.toggle("hidden");
        sidebar.classList.toggle("sidebar-active");
    }    
}
