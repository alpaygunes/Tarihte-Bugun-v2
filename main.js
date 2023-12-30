const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const process = require("process");
const url = require("url")
const path = require("path")
const fs = require('node:fs');
const { TarihteBugun } = require('./tarihte_bugun')
const os = require("os")

let anaPencere
let tray = null
let tarihteBugun
// app yüklendikten sonra pencereyi oluşturalım 
app.whenReady().then(() => {
    // Sistem tepsisi ayarları
    tray = new Tray(path.join(__dirname, 'assets/icon.png'))
    tray.setToolTip('Bilgi Ekranı.')
    const contextMenu = Menu.buildFromTemplate([
        { label: 'Göster', type: 'normal',click: () => anaPencere.show() },
        { label: 'Çıkış', type: 'normal',click: () => app.quit() },
    ])
    tray.setContextMenu(contextMenu)

    baslangicaEkle()
    pencereOlustur()
    tarihteBugun = new TarihteBugun()
    tarihteBugun.start()
})

// Pencere oluşturma metodu
const pencereOlustur = () => {
    anaPencere = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        frame: true
    })
    anaPencere.loadURL(
        url.format({
            pathname: path.join(__dirname, "/view/index.html"),
            protocol: "file:",
            slashes: true,
        })
    )
    process.env.MAIN_WINDOW_ID = anaPencere.id;  
}

function baslangicaEkle() {
    let string = ("[Desktop Entry]\n\
Name= Bilgi Ekranı\n\
Comment= comment_optional\n\
Icon= app_icon\n\
Exec= tr.gov.meb.kayseri\n\
Terminal=false\n\
Type=Application\
")
    let autostart_path = path.join(os.homedir(), '.config/autostart', app.getName() + '.desktop')
    if (!fs.existsSync(autostart_path)) {
        fs.writeFileSync(path.join(autostart_path), string)
    }
}

// Gizle
ipcMain.on("hide", (err, data) => { 
    anaPencere.hide();
})


// okul türünü değiştir
ipcMain.on("change:type", async (err, type) => {
    okul_turu = type
    const storage_path  = app.getPath("userData")
    const user_data     = JSON.stringify({ "okul_turu": okul_turu })
    fs.writeFileSync(path.join(storage_path, '/user-data.json'), user_data)
    tarihteBugun.start()
})
