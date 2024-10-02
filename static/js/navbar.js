const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");
const icon = document.getElementById("icon");

menuBtn.addEventListener("click", function() {
    menu.classList.toggle("scale-x-0");
    overlay.classList.toggle("hidden");

    // Cambiar color del icono
    icon.classList.toggle("text-black");
    icon.classList.toggle("text-white");

    // Desactivar scroll de fondo cuando el menú está abierto
    if (!overlay.classList.contains("hidden")) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
});
