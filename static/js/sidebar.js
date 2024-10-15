const sidebar = document.getElementById("sidebar");
const sidebarBtn = document.getElementById("sidebarBtn");
const navbar = document.getElementById("navbar");
const graphContainer = document.getElementById("graphContainer")
function sideShow() {
    if (sidebar) {
        sidebar.classList.toggle("hidden");
    }    
}
console.log('sidebar cargado');

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add('mt-2');
    } else {
        navbar.classList.remove('mt-2');
    }
});





