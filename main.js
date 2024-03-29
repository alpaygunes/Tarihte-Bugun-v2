const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron')
const process = require("process");
const url = require("url")
const path = require("path")
const fs = require('fs');
const { TarihteBugun } = require('./tarihte_bugun')
const os = require("os")
var schedule = require('node-schedule');
let ayarlar = {"timeout":5,"konum":2,"okul_turu":"lise","boyut":50}

let anaPencere
let tray = null
let tarihteBugun
const gotTheLock = app.requestSingleInstanceLock()



// yalnızca bir defa
if (!gotTheLock) {
    app.quit()
} else {
    tarihteBugun = new TarihteBugun()
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        // Someone tried to run a second instance, we should focus our window.
        if (anaPencere) {
            if (anaPencere.isMinimized()) anaPencere.restore()
            anaPencere.focus()
        }
    })

    app.setLoginItemSettings({
        openAtLogin: true
    })

    // Create anaPencere, load the rest of the app, etc...
    // app yüklendikten sonra pencereyi oluşturalım 
    app.whenReady().then(() => {
        pencereOlustur()
        ayarlariGetir()
        tekrarCalismayiKur() 
        // Sistem tepsisi ayarları
        tray = new Tray(path.join(__dirname, 'assets/icon.png'))
        tray.setToolTip('Bilgi Ekranı')
        const contextMenu = Menu.buildFromTemplate([
            { label: 'Göster', type: 'normal', click: () => anaPencere.show() },
            { label: 'Çıkış', type: 'normal', click: () => app.quit() },
        ])
        tray.setContextMenu(contextMenu)
        tray.on('click', function(e){
            if (anaPencere.isVisible()) {
              anaPencere.hide()
            } else {
              anaPencere.show()
            }
          });

        if (process.platform === 'linux') {
            baslangicaEkle()
        }
        tarihteBugun.start(ayarlar) 
    })
}

function ayarlariGetir() {
    const storage_path  = app.getPath("userData")
    let ayar_dosyasi    = fs.existsSync(path.join(storage_path, '/user-data.json'))
    if (ayar_dosyasi) {
        ayarlar = fs.readFileSync(path.join(storage_path, '/user-data.json'))
        ayarlar = JSON.parse(ayarlar)
    }
    anaPencere.webContents.on('did-finish-load', function () {
        anaPencere.webContents.send("ayarlar", ayarlar)
    });
}

// Pencere oluşturma metodu
const pencereOlustur = () => {
    anaPencere = new BrowserWindow({
        backgroundColor: '#00FFFFFF',
        width: 400,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        },
        //frame: false,
        transparent: true,
    })

    anaPencere.loadURL(
        url.format({
            pathname: path.join(__dirname, "/view/index.html"),
            protocol: "file:",
            slashes: true,
        })
    )

    process.env.MAIN_WINDOW_ID = anaPencere.id;
    var isDev = process.env.APP_DEV ? (process.env.APP_DEV.trim() == "true") : false;
    if (!isDev) {
        anaPencere.hide();
    }
}
// Pencere oluşturma metodu SONU

function tekrarCalismayiKur() {
    // her saat başı çalış
    let pattern = '*/' + ayarlar.timeout + ' * * * *'
    if(schedule.scheduledJobs["tetiklenme"]){
        schedule.scheduledJobs["tetiklenme"].cancel()
    }
    schedule.scheduleJob("tetiklenme",pattern, function () {
        tarihteBugun.start(ayarlar)
        console.log('schedule.schedule job ÇALIŞTI')
    });
}






function baslangicaEkle() {
    let string = ("[Desktop Entry]\n\
Name= Bilgi Penceresi\n\
Comment= comment_optional\n\
Icon= app_icon\n\
Exec= bilgi-penceresi\n\
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
    okul_turu           = type
    const storage_path  = app.getPath("userData")
    ayarlar.okul_turu   = okul_turu
    const user_data     = JSON.stringify(ayarlar)
    fs.writeFileSync(path.join(storage_path, '/user-data.json'), user_data)
    tarihteBugun.start(ayarlar)
})

// zaman aşımını değiştir
ipcMain.on("timeout", async (err, timeout) => {
    const storage_path = app.getPath("userData")
    ayarlar.timeout = timeout
    const user_data = JSON.stringify(ayarlar)
    fs.writeFileSync(path.join(storage_path, '/user-data.json'), user_data)
    tekrarCalismayiKur()
})

// konum değiştir
ipcMain.on("konum", async (err, konum) => {
    const storage_path = app.getPath("userData")
    ayarlar.konum = konum
    const user_data = JSON.stringify(ayarlar)
    fs.writeFileSync(path.join(storage_path, '/user-data.json'), user_data) 
    tarihteBugun.start(ayarlar)
})

// tetikleme süresi değiştir
ipcMain.on("boyut", async (err, boyut) => {
    const storage_path = app.getPath("userData")
    ayarlar.boyut = boyut
    const user_data = JSON.stringify(ayarlar)
    fs.writeFileSync(path.join(storage_path, '/user-data.json'), user_data)
    tarihteBugun.start(ayarlar)
    tekrarCalismayiKur()
})