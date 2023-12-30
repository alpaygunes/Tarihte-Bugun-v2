const electron = require("electron");
const { ipcRenderer } = electron;
// let message = document.querySelector("#message"); 
let exitAppBtn = document.querySelector("#app-exit");
let settings = document.querySelector("#settings");
let messsageBox = document.querySelector("#message-of-day-box");
let settingMenu = document.querySelector("#settings-menu");
let settingMenuItem = document.getElementsByClassName("menu-item");
let Aylar = new Array("Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran", "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık");

document.addEventListener("DOMContentLoaded", () => {
    // menü itemlerine olaydinleyici ekleyelim
    for (var i = 0; i < settingMenuItem.length; i++) {
        settingMenuItem[i].addEventListener("click", (event) => {
            let id = event.target.id
            settingMenu.style.display = "none";
            messsageBox.style.backgroundColor = "rgba(255, 255, 255, 0.719)";
            switch (id) {
                case "menu-item-ilkokul":
                    ipcRenderer.send("change:type", "ilkokul")
                    break;
                case "menu-item-ortaokul":
                    ipcRenderer.send("change:type", "ortaokul")
                    break;
                case "menu-item-lise":
                    ipcRenderer.send("change:type", "lise")
                    break;
            }
        })
    }
});

settings.addEventListener("click", () => {
    if (settingMenu.style.display === "none") {
        settingMenu.style.display = "block";
        messsageBox.style.backgroundColor = "rgba(93, 93, 93, 0.719)";
    } else {
        settingMenu.style.display = "none";
        messsageBox.style.backgroundColor = "rgba(255, 255, 255, 0.719)";
    }
})

exitAppBtn.addEventListener("click", () => {
    ipcRenderer.send("hide", true)
})


ipcRenderer.on("okultipi_sec", () => {
    settingMenu.style.display = "block";
    messsageBox.style.backgroundColor = "rgba(93, 93, 93, 0.719)";
})

