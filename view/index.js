const electron = require("electron");
const { ipcRenderer } = electron;
// let message = document.querySelector("#message"); 
let exitAppBtn = document.querySelector("#app-exit");
let settings = document.querySelector("#settings");
let messsageBox = document.querySelector("#message-of-day-box");
let settingMenu = document.querySelector("#settings-menu");
let konumListesi = document.querySelectorAll("#konum_listesi>.setting-item");
let settingMenuItem = document.getElementsByClassName("menu-item");
let timeout = document.querySelector("#timeout");
let boyut = document.querySelector("#boyut");



document.addEventListener("DOMContentLoaded", () => {
    // menü itemlerine olaydinleyici ekleyelim
    for (var i = 0; i < settingMenuItem.length; i++) {
        settingMenuItem[i].addEventListener("click", (event) => {
            let id = event.target.id
            //settingMenu.style.display = "none";
            //messsageBox.style.backgroundColor = "rgba(255, 255, 255, 0.719)"; 
            for (var a = 0; a < settingMenuItem.length; a++){
                settingMenuItem[a].style.backgroundColor = "rgba(255, 255, 255, 1)"; 
            }
            switch (id) {
                case "menu-item-ilkokul":
                    ipcRenderer.send("change:type", "ilkokul")
                    event.target.style.backgroundColor = "rgba(190, 245, 154, 1)";
                    break;
                case "menu-item-ortaokul":
                    ipcRenderer.send("change:type", "ortaokul")
                    event.target.style.backgroundColor = "rgba(190, 245, 154, 1)";
                    break;
                case "menu-item-lise":
                    ipcRenderer.send("change:type", "lise")
                    event.target.style.backgroundColor = "rgba(190, 245, 154, 1)";
                    break;
            }
        })
    }

    //konum listesi li lerine event ekleyelim
    for (var j = 0; j < konumListesi.length; j++) {
        konumListesi[j].addEventListener("click", (event) => {  
            for (var a = 0; a < konumListesi.length; a++){
                konumListesi[a].style.backgroundColor = "rgba(255, 255, 255, 1)"; 
            }

            if (event.target.getAttribute('value')){
                event.target.style.backgroundColor = "rgba(190, 245, 154, 1)"; 
                ipcRenderer.send("konum", event.target.getAttribute('value'))
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

// Zaman aşımı ayarı
timeout.addEventListener("input", (event) => {
    document.querySelector("#timeout-label").innerHTML = "Zaman Aşımı " + event.target.value + " dk"
})
timeout.addEventListener("change", (event) => {
    ipcRenderer.send("timeout", event.target.value)
})



// Mesaj kutusunun boyut ayarı
boyut.addEventListener("input", (event) => {
    document.querySelector("#boyut-label").innerHTML = "Boyut %" + event.target.value
})
boyut.addEventListener("change", (event) => {
    ipcRenderer.send("boyut", event.target.value)
})



ipcRenderer.on("okultipi_sec", () => {
    settingMenu.style.display = "block";
    messsageBox.style.backgroundColor = "rgba(93, 93, 93, 0.719)";
})

ipcRenderer.on("gunun_dosyalari_yok", () => { 
    alert("Bu güne ait data bulunamadı.")
})

ipcRenderer.on("ayarlar",(event,ayarlar)=>{ 
    timeout.value = ayarlar.timeout
    document.querySelector("#timeout-label").innerHTML = "Zaman Aşımı " + ayarlar.timeout + " dk"
    document.querySelector("#menu-item-"+ayarlar.okul_turu).style.backgroundColor = "rgba(190, 245, 154, 1)";
    boyut.value = ayarlar.boyut
    document.querySelector("#boyut-label").innerHTML = "Boyut %" + ayarlar.boyut

    // konumun değerini işaretle
    for (var j = 0; j < konumListesi.length; j++) {
        if (konumListesi[j].getAttribute('value')==ayarlar.konum){
            konumListesi[j].style.backgroundColor = "rgba(190, 245, 154, 1)";
        }
    }
})