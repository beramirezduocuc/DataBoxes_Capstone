const menu = document.getElementById("menu");
const menu_btn = document.getElementById("menuBtn");

const showHideMenu=()=>{
    menu_btn.firstElementChild.classList.toggle("bx-menu-alt-left");
    menu_btn.firstElementChild.classList.toggle("bx-x");
    menu.classList.toggle("scale-x-0");
}

menu_btn.addEventListener("click", showHideMenu);

console.log("Si estas viendo este mensaje, navbar.js esta cargado.")