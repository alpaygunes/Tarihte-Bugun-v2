'use strict';
const path  = require('path');
const fs    = require('fs');
const {makeWallpeaperImage} = require('./make_wallpeaper_image.js')


module.exports.TarihteBugun = class TarihteBugun {

    target_folder
    gunun_dosyalari = {}

    async start() {
        this.gunun_dosyalari = await this.gununDosyalariniAyikla()
        let resimler = this.gunun_dosyalari.resimler
        let random_resim    = resimler[Math.floor(Math.random() * resimler.length)];
        let jsons = this.gunun_dosyalari.jsons
        let json_file     = jsons[0]
        const data = fs.readFileSync(json_file);
        let datas = JSON.parse(data)
        let random_data   = datas[Math.floor(Math.random() * datas.length)];  
        makeWallpeaperImage(random_resim,random_data)
    }

    okulTurunuGetir() {
        return 'ilkokul'
    }

    // tarih değerine göre dizinin yolu belirlyelim
    yollariBelirle() {
        var date = new Date();
        var month = date.getMonth();
        var day = date.getDate();
        let guncel_dizin = path.join(month.toString(), day.toString())
        let srcDir = path.join(__dirname, 'data', guncel_dizin)
        // let destDir = path.join(this.target_folder, guncel_dizin)
        return srcDir
    }

    async gununDosyalariniAyikla() {
        let srcDir = this.yollariBelirle()
        let okul_turu = this.okulTurunuGetir()
        let dizinler = fs.readdirSync(path.join(srcDir, okul_turu))
        let varolan_dosyalar = {}
        dizinler.forEach(dizin => {
            varolan_dosyalar[dizin] = []
            let dosyalar = fs.readdirSync(path.join(srcDir, okul_turu, dizin))
            dosyalar.forEach(dosya => {
                varolan_dosyalar[dizin].push(path.join(srcDir, okul_turu, dizin, dosya))
            })
        })
        return varolan_dosyalar
    }


}




