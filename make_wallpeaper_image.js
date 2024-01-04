const { app, screen } = require('electron')
const { createCanvas, GlobalFonts,  loadImage } = require('@napi-rs/canvas') 
const fs = require('fs')
const path = require('path');
 

module.exports.makeWallpeaperImage = async function makeWallpeaperImage(image_path, mesaj_json,target_path,okul_turu) {
    await app.whenReady()
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const background = await loadImage(image_path);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    
    if(Math.random()>0){
        // mesaj kutusunu allıp resmin ortasına yerleştirelim
        let msg_box = await mesajKutusunuOlustusu(canvas.width, canvas.height,mesaj_json,okul_turu)
        let olcek = .4
        let kutu_w = canvas.width * olcek
        let kutu_h = canvas.height * olcek
        let kutu_dx = (canvas.width-kutu_w)/2
        let kutu_dy = (canvas.height-kutu_h)/2
        ctx.drawImage(msg_box, kutu_dx, kutu_dy, kutu_w, kutu_h);
    }


    const jpgData = canvas.encodeSync('jpeg',{quality: 0.95}) 
    fs.writeFileSync(path.join(target_path), jpgData)
}

// Bir mesaj kutusu oluşturur canvas döndürür
async function mesajKutusunuOlustusu(scrn_width, scrn_height, mesaj_json,okul_turu) {
    const olcek_orani = 0.4
    const kutu_width = scrn_width * olcek_orani
    const kutu_height = scrn_height * olcek_orani
    const msg_canvas = createCanvas(kutu_width, kutu_height)
    const ctx = msg_canvas.getContext('2d')
    GlobalFonts.registerFromPath(path.join(__dirname,'assets/Alkatra-VariableFont_wght.ttf'), 'Alkatra')
    let image_path = path.join(__dirname, '/assets/'+okul_turu+'.png')
    const background = await loadImage(image_path);
    ctx.drawImage(background, 0, 0, msg_canvas.width, msg_canvas.height);
    let x
    let y = 120
    let satirlar =[]
    let satir_arasi = 30
    let width_kullanima_orani = .9



    // (10) ['game', 'preference', 'proverb', 'reason', 'solution', 'specialSay', 'spelling', 'suggestion', 'value', 'word']

    if (mesaj_json.mesaj_turu == 'game'){
        console.log(game)
    }else if (mesaj_json.mesaj_turu == 'proverb'){
        console.log(mesaj_json)
    }else if (mesaj_json.mesaj_turu == 'reason'){
        console.log(mesaj_json)
    }else if (mesaj_json.mesaj_turu == 'solution'){
        console.log(mesaj_json)
    }else if (mesaj_json.mesaj_turu == 'specialSay'){
        console.log(mesaj_json)
    }else if (mesaj_json.mesaj_turu == 'suggestion'){
        console.log(mesaj_json)
    }else if (mesaj_json.mesaj_turu == 'value'){
        console.log(mesaj_json)
    }else if (mesaj_json.mesaj_turu == 'word'){
        console.log(mesaj_json)
    }


    return msg_canvas
}

// uzun metinleri satılara ayırarark dizi döndürür
function satirlaraBol( context , text,  fitWidth){
    fitWidth = fitWidth || 0;
    lines = []
    if (fitWidth <= 0)
    {
        context.fillText( text, x, y );
        return;
    }
    var words = text.split(' ');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length)
    {
        var str = words.slice(0,idx).join(' ');
        var w = context.measureText(str).width;
        if ( w > fitWidth )
        {
            if (idx==1)
            {
                idx=2;
            }
            lines.push( words.slice(0,idx-1).join(' '))
            currentLine++;
            words = words.splice(idx-1);
            idx = 1;
        }
        else
        {idx++;}
    }
    if  (idx > 0) 
        lines.push( words.join(' '))
       return lines
}














    // // eğer açıklama varsa satır sayısı kadar yukarı çekelim başlığı
    // if (mesaj_json.txt){
    //     satirlar = satirlaraBol(ctx, mesaj_json.txt, msg_canvas.width );
    //     y -= satirlar.length * 25
    // }
    // ctx.textBaseline = 'middle';
    // //---------------------------------------- Footer
    // if (mesaj_json.footer){
    //     let footer  = mesaj_json.footer
    //     ctx.font    = "bold 30px Alkatra";
    //     let text_width    = ctx.measureText(footer); 
    //     x = (msg_canvas.width-text_width.width)/2
        
    //     ctx.textTracking = "100";
    //     ctx.strokeStyle = '#b58065';
    //     ctx.lineWidth = 1;
    //     ctx.strokeText(footer, x+1, y+1);

    //     ctx.fillStyle = '#823915';
    //     ctx.fillText(footer, x, y); 
    // }

    // //---------------------------------------- title 
    // y += 18
    // if (mesaj_json.title){
    //     let title  = mesaj_json.title
    //     satirlar = satirlaraBol(ctx, title, msg_canvas.width*width_kullanima_orani);
    //     ctx.font    = "bold 20px Alkatra";
    //     if(satirlar>2){
    //         ctx.font    = "bold 18px Alkatra";
    //     } 
    //     satirlar.forEach(satir => {
    //         satir_width    = ctx.measureText(satir);
    //         x = (msg_canvas.width-satir_width.width)/2
    //         y = y  + satir_arasi 
    //         ctx.fillText(satir, x, y);
    //     });
    // }

    // //---------------------------------------- dogru_yanlis yi ekleyelim
    // if (mesaj_json.dogru_yanlis){
    //     let dogru  = "Doğru : " + mesaj_json.dogru_yanlis.dogru
    //     ctx.font    = "40px Alkatra";
    //     text_width    = ctx.measureText(dogru);
    //     x = (msg_canvas.width-text_width.width)/2
    //     y = y  + 60
    //     ctx.fillText(dogru, x, y);
    //     let yanlis  = "Yanlış : " + mesaj_json.dogru_yanlis.yanlis
    //     ctx.font    = "30px Alkatra";
    //     text_width    = ctx.measureText(yanlis);
    //     x = (msg_canvas.width-text_width.width)/2
    //     y = y  + (2*satir_arasi)
    //     ctx.fillText(yanlis, x, y);
    // }
    
    // //---------------------------------------- txt yi ekleyelim
    // if (mesaj_json.txt){
    //     let txt  = mesaj_json.txt
    //     satirlar = satirlaraBol(ctx, txt, msg_canvas.width*width_kullanima_orani );
    //     ctx.font    = "18px Alkatra";
    //     satirlar.forEach(satir => {
    //         satir_width    = ctx.measureText(satir);
    //         x = (msg_canvas.width-satir_width.width)/2
    //         y = y  + satir_arasi 
    //         ctx.fillText(satir, x, y);
    //     }); 
    // }

    // //---------------------------------------- bottom ı ekleyelim
    // if (mesaj_json.bottom){
    //     let bottom  = mesaj_json.bottom
    //     ctx.font    = "italic bold  18px Alkatra ";
    //     text_width    = ctx.measureText(bottom);
    //     x = (msg_canvas.width-text_width.width)/2
    //     y = y  + satir_arasi
    //     ctx.fillText(bottom, x, y);
    // }
