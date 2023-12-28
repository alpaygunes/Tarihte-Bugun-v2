const { app, BrowserWindow } = require('electron')
const {TarihteBugun} = require('./tarihte_bugun')
  


// Pencere oluşturma metodu
const pencereOlustur = () => {
    const anaPencere = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            enableRemoteModule: true,
            contextIsolation: false
        }
    })

    anaPencere.loadFile('./views/index.html')
}

// app yüklendikten sonra pencereyi oluşturalım
app.whenReady().then(() => {
    pencereOlustur()
})

let  tarihteBugun = new TarihteBugun()
tarihteBugun.target_folder =  "/var/tmp";
tarihteBugun.start()

 