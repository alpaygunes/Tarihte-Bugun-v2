'use strict';
const { app, BrowserWindow } = require('electron')
const process = require("process");
const path = require('path');
const fs = require('fs');
const { makeWallpeaperImage } = require('./make_wallpeaper_image.js')
const { setWallpeaper } = require('./set_wallpeaper.js');
const { rejects } = require('assert');
const sqlite3 = require('sqlite3').verbose();
let zatenViewYuklendi = false


module.exports.TarihteBugun = class TarihteBugun {
    gunun_dosyalari = {}
    gunun_mesajlari = {}
    okul_turu
    async start() {
        const ID = process.env.MAIN_WINDOW_ID * 1;
        const mainWindow = BrowserWindow.fromId(ID)
        //okul türü kayıtlı değilse işlemi kes. view de ayar penceresini aç
        this.okul_turu = this.okulTurunuGetir()
        if (!this.okul_turu) return;

        // -------------------------------------- Resimleri getir
        this.gunun_dosyalari = await this.gununDosyalari()
        if (!Object.keys(this.gunun_dosyalari).length) {
            if (zatenViewYuklendi) {
                mainWindow.webContents.send("gunun_dosyalari_yok", true)
            } else {
                mainWindow.webContents.on('dom-ready', function () {
                    mainWindow.webContents.send("gunun_dosyalari_yok", true)
                    zatenViewYuklendi = true
                });
            }
            return false
        }

        let resimler        = this.gunun_dosyalari.resimler
        let random_resim    = resimler[Math.floor(Math.random() * resimler.length)];

        // günün mesajlarını getir  
        this.gunun_mesajlari = JSON.parse(await this.gununMesajlari())
        var keys = Object.keys(this.gunun_mesajlari);
        keys.shift()
        let mesaj_turu = keys[Math.floor(keys.length * Math.random())]
        let mesaj     = this.gunun_mesajlari[mesaj_turu];
        let mesaj_json =({mesaj_turu,mesaj})

 
        //let prefix = Math.floor(Math.random() * 99999);
        this.target_path = path.join("/var/tmp/", "bilgi_penceresi.jpg");
        await makeWallpeaperImage(random_resim, mesaj_json, this.target_path, this.okul_turu)
        setWallpeaper(this.target_path)
    }

    okulTurunuGetir() {
        const ID = process.env.MAIN_WINDOW_ID * 1;
        const mainWindow = BrowserWindow.fromId(ID)
        const storage_path = app.getPath("userData")
        let ayarlar = fs.existsSync(path.join(storage_path, '/user-data.json'))
        if (ayarlar) {
            ayarlar = fs.readFileSync(path.join(storage_path, '/user-data.json'))
            return JSON.parse(ayarlar).okul_turu
        } else {
            mainWindow.webContents.on('did-finish-load', function () {
                mainWindow.show()
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

    async gununDosyalari() {
        let srcDir = this.yollariBelirle()
        let okul_turu = this.okulTurunuGetir()
        let varolan_dosyalar = {}
        let dizinler

        // güne ait dosyalar VARSA oradan seçilsin
        if (fs.existsSync(path.join(srcDir, okul_turu))) {
            dizinler = fs.readdirSync(path.join(srcDir, okul_turu))
            dizinler.forEach(dizin => {
                varolan_dosyalar[dizin] = []
                let dosyalar = fs.readdirSync(path.join(srcDir, okul_turu, dizin))
                dosyalar.forEach(dosya => {
                    varolan_dosyalar[dizin].push(path.join(srcDir, okul_turu, dizin, dosya))
                })
            })
        } else {
            //  güne ait dosyalar YOKSA genel dizininden seçilsin 
            let srcGenelDir = path.join(__dirname, 'data', 'genel')
            dizinler = fs.readdirSync(srcGenelDir)
            dizinler.forEach(dizin => {
                let dosyalar = fs.readdirSync(path.join(srcGenelDir, dizin))
                dosyalar.forEach(dosya => {
                    if (!varolan_dosyalar[dizin]) {
                        varolan_dosyalar[dizin] = []
                    }
                    varolan_dosyalar[dizin].push(path.join(srcGenelDir, dizin, dosya))
                })
            })
        }


        return varolan_dosyalar
    }

    gununMesajlari() {
        let date    = new Date();
        let month   = ("0" + (date.getMonth() + 1)).slice(-2)
        let day     = ("0" + (date.getDate() + 1)).slice(-2)
        let where   = day+"."+month+".2021"
        let sql_string = 'SELECT * FROM calendar WHERE date =\''+where+'\''
        console.log(sql_string)

        let db = new sqlite3.Database(path.join(__dirname, 'data/takvim_v27'), sqlite3.OPEN_READONLY, (err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Connected to the chinook database.');
        });

        let json = new Promise((resolve,rejects)=>{
            db.serialize(() => {
                db.each(sql_string, (err, row) => {
                    if (err) {
                        console.error(err.message);
                        rejects(err.message)
                    } 
                   resolve(row.json) 
                });
            });
        })
        return json
    }
}