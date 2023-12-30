'use strict';
const { app, BrowserWindow} = require('electron')
const process = require("process");
const path  = require('path');
const fs    = require('fs');
const {makeWallpeaperImage} = require('./make_wallpeaper_image.js')
const {setWallpeaper} = require('./set_wallpeaper.js')


module.exports.TarihteBugun = class TarihteBugun {  
    gunun_dosyalari = {} 
    async start() {
        //okul türü kayıtlı değilse işlemi kes. view de ayar penceresini aç
        if (!this.okulTurunuGetir()) return; 
        
        this.gunun_dosyalari = await this.gununDosyalariniAyikla()
        let resimler = this.gunun_dosyalari.resimler
        let random_resim    = resimler[Math.floor(Math.random() * resimler.length)];
        let jsons = this.gunun_dosyalari.jsons
        let random_json_file     = jsons[Math.floor(Math.random() * jsons.length)]
        const data = fs.readFileSync(random_json_file);
        let json_data = JSON.parse(data)
        let random_json_data   = json_data[Math.floor(Math.random() * json_data.length)];

        let prefix = Math.floor(Math.random() * 99999);
        this.target_path = path.join("/var/tmp/",prefix+"_bilgi_penceresi.png");
        await makeWallpeaperImage(random_resim, random_json_data, this.target_path)
        setWallpeaper(this.target_path)
    }

    okulTurunuGetir() {
        const ID = process.env.MAIN_WINDOW_ID * 1;
        const mainWindow = BrowserWindow.fromId(ID)
        const storage_path  = app.getPath("userData")
        let ayarlar         = fs.existsSync(path.join(storage_path, '/user-data.json'))
        if (ayarlar){
            ayarlar         = fs.readFileSync(path.join(storage_path, '/user-data.json')) 
            return  JSON.parse(ayarlar).okul_turu
        }else{
            mainWindow.webContents.on('did-finish-load', function () {
                mainWindow.webContents.send("okultipi_sec", true) 
            });  
            return false        
        }
    }

    // tarih değerine göre dizinin yolu belirlyelim
    yollariBelirle() {
        var date = new Date();
        var month = date.getMonth();
        var day = date.getDate();
        let guncel_dizin = path.join(month.toString(), day.toString())
        let srcDir = path.join(__dirname, 'data', guncel_dizin) 
        return srcDir
    }

    async gununDosyalariniAyikla() {
        let srcDir      = this.yollariBelirle()
        let okul_turu   = this.okulTurunuGetir()
        let varolan_dosyalar = {}

        // okul turune ozel
        let dizinler    = fs.readdirSync(path.join(srcDir, okul_turu))
        dizinler.forEach(dizin => {
            varolan_dosyalar[dizin] = []
            let dosyalar = fs.readdirSync(path.join(srcDir, okul_turu, dizin))
            dosyalar.forEach(dosya => {
                varolan_dosyalar[dizin].push(path.join(srcDir, okul_turu, dizin, dosya))
            })
        })
        
        // genel
        okul_turu   = "genel"
        dizinler    = fs.readdirSync(path.join(srcDir, okul_turu))
        dizinler.forEach(dizin => { 
            let dosyalar = fs.readdirSync(path.join(srcDir, okul_turu, dizin))
            dosyalar.forEach(dosya => {
                varolan_dosyalar[dizin].push(path.join(srcDir, okul_turu, dizin, dosya))
            })
        })
        return varolan_dosyalar
    }
}