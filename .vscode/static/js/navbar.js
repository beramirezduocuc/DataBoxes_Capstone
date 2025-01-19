const menu = document.getElementById("menu");
const menuBtn = document.getElementById("menuBtn");
const overlay = document.getElementById("overlay");
const icon = document.getElementById("icon");

menuBtn.addEventListener("click", function() {
    menu.classList.toggle("scale-x-0");
    overlay.classList.toggle("hidden");

    if (!overlay.classList.contains("hidden")) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "auto";
    }
});

overlay.addEventListener("click", function(){
    overlay.classList.toggle("hidden");
    menu.classList.toggle("scale-x-0");
    document.body.style.overflow = "auto";
    icon.classList.toggle("text-black");

});

