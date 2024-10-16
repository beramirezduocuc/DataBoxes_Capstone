const sidebar = document.getElementById("sidebar");
const sidebarBtn = document.getElementById("sidebarBtn");
const navbar = document.getElementById("navbar");

window.addEventListener("scroll", () => {
    if (window.scrollY > 50) {
        navbar.classList.add('mt-4');
    } else {
        navbar.classList.remove('mt-4');
    }
});

sidebarBtn.addEventListener("click", (event) => {
    sidebar.classList.toggle("hidden");
    event.preventDefault();
});

document.addEventListener("click", (event) => {
    const isClickInside = sidebar.contains(event.target) || sidebarBtn.contains(event.target);
    
    if (!isClickInside && window.innerWidth < 1024) { 
        sidebar.classList.add("hidden");
    }
});
