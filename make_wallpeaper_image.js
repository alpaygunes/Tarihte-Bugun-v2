const { app, screen } = require('electron')
const { createCanvas, GlobalFonts,  loadImage } = require('./node_modules/@napi-rs/canvas') 
const fs = require('fs')
const path = require('path');
 

module.exports.makeWallpeaperImage = async function makeWallpeaperImage(image_path, random_json,target_path) {
    await app.whenReady()
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')

    const background = await loadImage(image_path);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);
    // mesaj kutusunu allıp resmin ortasına yerleştirelim
    let msg_box = await mesajKutusunuOlustusu(canvas.width, canvas.height,random_json)
    let olcek = .4
    let kutu_w = canvas.width * olcek
    let kutu_h = canvas.height * olcek
    let kutu_dx = (canvas.width-kutu_w)/2
    let kutu_dy = (canvas.height-kutu_h)/2
    ctx.drawImage(msg_box, kutu_dx, kutu_dy, kutu_w, kutu_h);
    const pngData = canvas.encodeSync('png') 
    fs.writeFileSync(path.join(target_path), pngData)
}

// Bir mesaj kutusu oluşturur canvas döndürür
async function mesajKutusunuOlustusu(scrn_width, scrn_height, random_json) {
    const olcek_orani = 0.4
    const kutu_width = scrn_width * olcek_orani
    const kutu_height = scrn_height * olcek_orani
    const msg_canvas = createCanvas(kutu_width, kutu_height)
    const ctx = msg_canvas.getContext('2d')
    GlobalFonts.registerFromPath(path.join(__dirname,'assets/Alkatra-VariableFont_wght.ttf'), 'Alkatra')
    let image_path = path.join(__dirname, '/assets/msg_bg1.png')
    const background = await loadImage(image_path);
    ctx.drawImage(background, 0, 0, msg_canvas.width, msg_canvas.height);
    let x,y=150
    let satirlar =[]
    let satir_arasi = 30
    let width_kullanima_orani = .9

    // eğer açıklama varsa satır sayısı kadar yukarı çekelim başlığı
    if (random_json.txt){
        satirlar = satirlaraBol(ctx, random_json.txt, msg_canvas.width );
        y -= satirlar.length * 25
    }
    ctx.textBaseline = 'middle';
    // Footeri ekleyelim
    if (random_json.footer){
        let footer  = random_json.footer
        ctx.font    = "bold 40px Alkatra";
        let text_width    = ctx.measureText(footer); 
        x = (msg_canvas.width-text_width.width)/2
        
        ctx.textTracking = "100";
        ctx.strokeStyle = '#b58065';
        ctx.lineWidth = 1.5;
        ctx.strokeText(footer, x+1, y+1);

        ctx.fillStyle = '#823915';
        ctx.fillText(footer, x, y); 
    }

    // title ekleyelim
    y += 20
    if (random_json.title){
        let title  = random_json.title + " Failed to send GpuControl.CreateCommandBuffer."
        satirlar = satirlaraBol(ctx, title, msg_canvas.width*width_kullanima_orani);
        ctx.font    = "bold 20px Alkatra";
        if(satirlar>2){
            ctx.font    = "bold 15px Alkatra";
        } 
        satirlar.forEach(satir => {
            satir_width    = ctx.measureText(satir);
            x = (msg_canvas.width-satir_width.width)/2
            y = y  + satir_arasi 
            ctx.fillText(satir, x, y);
        });
    }

    // dogru_yanlis yi ekleyelim
    if (random_json.dogru_yanlis){
        let dogru  = "Doğru : " + random_json.dogru_yanlis.dogru
        ctx.font    = "40px Alkatra";
        text_width    = ctx.measureText(dogru);
        x = (msg_canvas.width-text_width.width)/2
        y = y  + 60
        ctx.fillText(dogru, x, y);
        let yanlis  = "Yanlış : " + random_json.dogru_yanlis.yanlis
        ctx.font    = "40px Alkatra";
        text_width    = ctx.measureText(yanlis);
        x = (msg_canvas.width-text_width.width)/2
        y = y  + (2*satir_arasi)
        ctx.fillText(yanlis, x, y);
    }
    
    // txt yi ekleyelim
    if (random_json.txt){
        let txt  = random_json.txt + "ContextResult::kTransientFailure:  Failed to send GpuControl.CreateCommandBuffer."
        satirlar = satirlaraBol(ctx, txt, msg_canvas.width*width_kullanima_orani );
        ctx.font    = "20px Alkatra";
        satirlar.forEach(satir => {
            satir_width    = ctx.measureText(satir);
            x = (msg_canvas.width-satir_width.width)/2
            y = y  + satir_arasi 
            ctx.fillText(satir, x, y);
        }); 
    }

    // bottom ı ekleyelim
    if (random_json.bottom){
        let bottom  = random_json.bottom
        ctx.font    = "bold 20px Alkatra";
        text_width    = ctx.measureText(bottom);
        x = (msg_canvas.width-text_width.width)/2
        y = y  + satir_arasi
        ctx.fillText(bottom, x, y);
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