'use strict';
const path  = require('path');
const fs    = require('fs'); 
 

module.exports.TarihteBugun = class TarihteBugun{ 

    target_folder
    ilkokul_resimleri =[]
    ortaokul_resimleri =[]
    lise_resimleri =[]

    async start(){
        await this.gununDizininiTempeTasi()
        this.gununDosyalariniAyikla()
    }
    
    okulTurunuGetir(){
        return 'ilkokul'
    }

    // tarih değerine göre dizinin yolu belirlyelim
    yollariBelirle(){
        var date        = new Date();
        var month       = date.getMonth();
        var day         = date.getDate(); 
        let guncel_dizin    = path.join(month.toString(), day.toString()) 
        let srcDir      = path.join(__dirname, 'data', guncel_dizin)
        let destDir     = path.join(this.target_folder, guncel_dizin)
        return {srcDir,destDir}
    }
    async  gununDizininiTempeTasi() { 
        let {srcDir,destDir} = this.yollariBelirle()
        let okul_turu = this.okulTurunuGetir()
        // okul türü dizinini kopyala
        if (!fs.existsSync(path.join(destDir, okul_turu ))) { 
            fs.cpSync(path.join(srcDir, okul_turu ), path.join(destDir, okul_turu), { recursive: true }, (err) => {
                if (err) throw err; 
            });
        }else{
            console.log('fs.copexistsSyncySync dizin zaten var !')
        }
        if (!fs.existsSync(path.join(destDir, 'genel'))) { 
            fs.cpSync(path.join(srcDir, 'genel'), path.join(destDir, 'genel'), { recursive: true }, (err) => {
                if (err) throw err; 
            });
        }else{
            console.log('fs.copexistsSyncySync destDir dizin zaten var !')
        }
    }
    
    
    async gununDosyalariniAyikla() {   
        let gunun_dosyalari = {}
        let {destDir} = this.yollariBelirle() 
        let okul_turu = this.okulTurunuGetir();
 
        let dizinler = fs.readdirSync(path.join(destDir,okul_turu))
        dizinler.forEach(dizin=>{ 
            console.log("------",dizin)
            let dosyalar = fs.readdirSync(path.join(destDir,okul_turu,dizin))
            dosyalar.forEach(dosya=>{  
                console.log(dosya)
            })
        })
        console.log(gunun_dosyalari)
     
    }
}




