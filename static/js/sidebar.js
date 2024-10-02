const sidebar = document.getElementById("sidebar");
const sidebarBtn = document.getElementById("sidebarBtn");

function sideShow(){
    if (sidebar && sidebarBtn) {
        sidebarBtn.addEventListener("click", function() {
            sidebar.classList.toggle("hidden");
            sidebar.classList.toogle("sidebar-active");
        });
    }    
}
