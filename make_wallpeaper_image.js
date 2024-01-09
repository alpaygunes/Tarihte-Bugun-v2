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
        let kutu_dx = canvas.width*.75 - kutu_w*.5
        let kutu_dy = canvas.height*.25 - kutu_h*.5
        ctx.drawImage(msg_box, kutu_dx, kutu_dy, kutu_w, kutu_h);
    }


    const jpgData = canvas.encodeSync('jpeg',{quality: 0.95}) 
    fs.writeFileSync(path.join(target_path), jpgData)
}

// Bir mesaj kutusu oluşturur canvas döndürür
async function mesajKutusunuOlustusu(scrn_width, scrn_height, mesaj_json,okul_turu) {
    const kutu_width = scrn_width 
    const kutu_height = scrn_height 
    const msg_canvas = createCanvas(kutu_width, kutu_height)
    const ctx = msg_canvas.getContext('2d')
    GlobalFonts.registerFromPath(path.join(__dirname,'assets/Alkatra-VariableFont_wght.ttf'), 'Alkatra')
    let msg_bg_name = "msg_bg" + Math.floor(Math.random()*5)
    let image_path = path.join(__dirname, '/assets/'+msg_bg_name+'.png')
    const background = await loadImage(image_path);
    ctx.drawImage(background, 0, 0, msg_canvas.width, msg_canvas.height);
    let x = 0
    let y = kutu_width*.13 
    let satir_arasi = kutu_width*.03 
    let font_footer = "bold 60px Alkatra"
    let font_title  = "bold 50px Alkatra"
    let font_desc   = "40px Alkatra"


    ctx.textAlign = "start";
    ctx.textAlign = "center";
    x = msg_canvas.width/2
    let mesaj           = mesaj_json.mesaj[Math.floor(Math.random() * mesaj_json.mesaj.length)]
    // ---------------------------------------------   "GÜNÜN DEYİMİ"
    if (mesaj_json.mesaj_turu == 'expression'){
        footer              = "GÜNÜN OYUNU"
        ctx.font            = font_footer; 
        ctx.fillText(footer, x, y); 
        y *=1.2
        ctx.font            = font_title;  
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width );
        titles.forEach(title => {
            satir_width    = ctx.measureText(title); 
            y +=satir_arasi
            ctx.fillText(title, x, y);
        });
       

        ctx.font            = font_desc; 
        y +=satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width );
        descs.forEach(desc => {
            satir_width    = ctx.measureText(desc); 
            y +=satir_arasi
            ctx.fillText(desc, x, y); 
        });
    // ---------------------------------------------   "GÜNÜN OYUNU"
    }else if (mesaj_json.mesaj_turu == 'game'){
        footer              = "GÜNÜN OYUNU"
        ctx.font            = font_footer; 
        ctx.fillText(footer, x, y); 
        y *=1.2
        ctx.font            = font_title;  
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width );
        titles.forEach(title => {
            satir_width    = ctx.measureText(title); 
            y +=satir_arasi
            ctx.fillText(title, x, y);
        });
       

        ctx.font            = font_desc; 
        y +=satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width );
        descs.forEach(desc => {
            satir_width    = ctx.measureText(desc); 
            y +=satir_arasi
            ctx.fillText(desc, x, y); 
        });
    // ---------------------------------------------   "GÜNÜN ATASÖZÜ"
    }else if (mesaj_json.mesaj_turu == 'proverb'){
        footer              = "GÜNÜN ATASÖZÜ"
        ctx.font            = font_footer; 
        ctx.fillText(footer, x, y);
        y *=1.2
        ctx.font            = font_title;  
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width );
        titles.forEach(title => {
            satir_width    = ctx.measureText(title); 
            y +=satir_arasi
            ctx.fillText(title, x, y);
        });
       

        ctx.font            = font_desc; 
        y +=satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width );
        descs.forEach(desc => {
            satir_width    = ctx.measureText(desc); 
            y +=satir_arasi
            ctx.fillText(desc, x, y); 
        });
    // ---------------------------------------------   "GÜNÜN NEDENİ"
    }else if (mesaj_json.mesaj_turu == 'reason'){ 
        footer              = "GÜNÜN NEDENİ"
        ctx.font            = font_footer; 
        ctx.fillText(footer, x, y);
        y *=1.2
        ctx.font            = font_title;  
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width );
        titles.forEach(title => {
            satir_width    = ctx.measureText(title); 
            y +=satir_arasi
            ctx.fillText(title, x, y);
        });
       

        ctx.font            = font_desc; 
        y +=satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width );
        descs.forEach(desc => {
            satir_width    = ctx.measureText(desc); 
            y +=satir_arasi
            ctx.fillText(desc, x, y); 
        });
    // ---------------------------------------------   "GÜNÜN ÇÖZÜMÜ"
    }else if (mesaj_json.mesaj_turu == 'solution'){
        footer              = "GÜNÜN ÇÖZÜMÜ"
        ctx.font            = font_footer; 
        ctx.fillText(footer, x, y);
        y *=1.2
        ctx.font            = font_title;  
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width );
        titles.forEach(title => {
            satir_width    = ctx.measureText(title); 
            y +=satir_arasi
            ctx.fillText(title, x, y);
        });
       

        ctx.font            = font_desc; 
        y +=satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width );
        descs.forEach(desc => {
            satir_width    = ctx.measureText(desc); 
            y +=satir_arasi
            ctx.fillText(desc, x, y); 
        });
    // ---------------------------------------------   "GÜNÜN TERCİHİ"
    }else if (mesaj_json.mesaj_turu == 'preference'){
        // dogru yanlış işaretleri
        const d_y_canvas = createCanvas(64, 64)
        const d_y_ctx = msg_canvas.getContext('2d')
        let   icon_dogru_path = path.join(__dirname, '/assets/dogru.png')
        let   icon_yanlis_path = path.join(__dirname, '/assets/yanlis.png')
        const dogru_bg = await loadImage(icon_dogru_path);
        const yanlis_bg = await loadImage(icon_yanlis_path);

        footer              = "GÜNÜN TERCİHİ"
        ctx.font            = font_footer;  
        ctx.fillText(footer, x, y);
        y +=3*satir_arasi
        ctx.font            = font_title;   
        ctx.fillText(mesaj.correct, x, y);
        let doguru_uzunlugu = ctx.measureText(mesaj.correct)
        d_y_ctx.drawImage(dogru_bg, x-doguru_uzunlugu.width, y-satir_arasi);
        ctx.drawImage(d_y_canvas, 0, 0);


        y +=2*satir_arasi
        ctx.fillText(mesaj.wrong, x, y);
        d_y_ctx.clearRect(0, 0, d_y_canvas.width, d_y_canvas.height);
        let yanlis_uzunlugu = ctx.measureText(mesaj.wrong)
        d_y_ctx.drawImage(yanlis_bg, x-yanlis_uzunlugu.width, y-satir_arasi);
        ctx.drawImage(d_y_canvas, 0, 0); 
    // ---------------------------------------------   "GÜNÜN SÖZÜ"
    }else if (mesaj_json.mesaj_turu == 'specialSay'){
        footer              = "GÜNÜN SÖZÜ"
        ctx.font            = font_footer; 
        ctx.fillText(footer, x, y); 
        y *=1.2
        ctx.font            = font_desc; 
        y +=satir_arasi
        let says = satirlaraBol(ctx, mesaj.say, msg_canvas.width );
        says.forEach(say => { 
            y +=satir_arasi
            ctx.fillText(say, x, y); 
        });

        ctx.font            = font_title;  
        let titles = satirlaraBol(ctx, mesaj.whoSaid, msg_canvas.width );
        titles.forEach(title => { 
            y +=satir_arasi
            ctx.fillText(title, x, y);
        });
    // ---------------------------------------------   "GÜNÜN ÖNERİSİ"
    }else if (mesaj_json.mesaj_turu == 'suggestion'){
        footer              = "GÜNÜN ÖNERİSİ"
        ctx.font            = font_footer; 
        ctx.fillText(footer, x, y);
        y *=1.2
        ctx.font            = font_title;  
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width );
        titles.forEach(title => { 
            y +=satir_arasi
            ctx.fillText(title, x, y);
        });
       

        ctx.font            = font_desc; 
        y +=satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width );
        descs.forEach(desc => { 
            y +=satir_arasi
            ctx.fillText(desc, x, y); 
        });
    // ---------------------------------------------   "GÜNÜN BİLGİSİ"
    }else if (mesaj_json.mesaj_turu == 'value'){
        footer              = "GÜNÜN BİLGİSİ"
        ctx.font            = font_footer; 
        ctx.fillText(footer, x, y);
        y *=1.2
        ctx.font            = font_title;  
        let names = satirlaraBol(ctx, mesaj.name, msg_canvas.width );
        names.forEach(name => { 
            y +=satir_arasi
            ctx.fillText(name, x, y);
        });
       
        ctx.font            = font_desc; 
        y +=satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width );
        descs.forEach(desc => { 
            y +=satir_arasi
            ctx.fillText(desc, x, y); 
        }); 
    // ---------------------------------------------   "GÜNÜN KELİMESİ"
    }else if (mesaj_json.mesaj_turu == 'word'){
        footer              = "GÜNÜN KELİMESİ"
        ctx.font            = font_footer; 
        ctx.fillText(footer, x, y);
        y *=1.5
        ctx.font            = font_title;  
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width );
        titles.forEach(title => { 
            y +=satir_arasi
            ctx.fillText(title, x, y);
        });
       
        ctx.font            = font_desc; 
        y +=satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width );
        descs.forEach(desc => { 
            y +=satir_arasi
            ctx.fillText(desc, x, y); 
        });
    // ---------------------------------------------   "GÜNÜN DOĞRUSU"
    }else if (mesaj_json.mesaj_turu == 'spelling'){
        // dogru yanlış işaretleri
        const d_y_canvas = createCanvas(64, 64)
        const d_y_ctx = msg_canvas.getContext('2d')
        let   icon_dogru_path = path.join(__dirname, '/assets/dogru.png')
        let   icon_yanlis_path = path.join(__dirname, '/assets/yanlis.png')
        const dogru_bg = await loadImage(icon_dogru_path);
        const yanlis_bg = await loadImage(icon_yanlis_path);
       
        footer              = "GÜNÜN DOĞRUSU" 
        ctx.font            = font_footer;  
        ctx.fillText(footer, x, y);  

        y *= 2  
        ctx.font            = font_title;  
        ctx.fillText(mesaj.correct, x, y);
        let doguru_uzunlugu = ctx.measureText(mesaj.correct)
        d_y_ctx.drawImage(dogru_bg, x-doguru_uzunlugu.width, y-satir_arasi);
        ctx.drawImage(d_y_canvas, 0, 0); 

        y +=2*satir_arasi 
        ctx.fillText(mesaj.wrong, x, y);
        d_y_ctx.clearRect(0, 0, d_y_canvas.width, d_y_canvas.height);
        let yanlis_uzunlugu = ctx.measureText(mesaj.wrong)
        d_y_ctx.drawImage(yanlis_bg, x-yanlis_uzunlugu.width, y-satir_arasi);
        ctx.drawImage(d_y_canvas, 0, 0); 
    }else{
        console.log(mesaj_json)
    }


    return msg_canvas
}

// uzun metinleri satılara ayırarark dizi döndürür
function satirlaraBol( context , text,  fitWidth){
    fitWidth = fitWidth || 0;
    fitWidth *= .7 // geniliğin 0.8 ine sığdır 
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