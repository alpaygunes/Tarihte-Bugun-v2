const { app, screen } = require('electron')
const { createCanvas,  loadImage } = require('@napi-rs/canvas')
const fs            = require('fs')
const path          = require('path');


module.exports.makeWallpeaperImage = async function makeWallpeaperImage(image_path, mesaj_json, target_path, ayarlar) {
    await app.whenReady()
    const primaryDisplay = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize
    const canvas = createCanvas(width, height)
    const ctx = canvas.getContext('2d')
    let okul_turu = ayarlar.okul_turu

    

    const mesaj         = mesaj_json.mesaj[Math.floor(Math.random() * mesaj_json.mesaj.length)]
    const mesaj_turu    = mesaj_json.mesaj_turu

    if (mesaj==undefined){
        console.log(mesaj)
    }
    // eğer mesaj_json içinde images varsa ozaman rasgele seçilen image_path i değiştirelim
    if (mesaj.hasOwnProperty("images")) {
        const mesaj_image       = mesaj.images[Math.floor(mesaj.images.length * Math.random())]
        const mesaj_image_path  = path.join(__dirname, 'data',ayarlar.okul_turu, mesaj_image)
        if (fs.existsSync(mesaj_image_path)) {
            image_path          = mesaj_image_path 
            console.log(" -----------------------------  Belirtilmiş Resim Mevcut : " , mesaj_image)
        }else{
            console.log(" !!!!!!!!!!!!!!!!!!!!!!!!!!!!!! BU RESİM YOK : " , mesaj_image)
        }
    }


    const background = await loadImage(image_path);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    if (Math.random() > 0) { // şuan 100% gösteriliyor istenirse mesaj kutusu gösterme oranı ayarlana bilir
        // mesaj kutusunu allıp resmin ortasına yerleştirelim
        let msg_box = await mesajKutusunuOlustusu(canvas.width, canvas.height, mesaj, mesaj_turu, okul_turu)
        let olcek   = ayarlar.boyut/100 
        let kutu_dx = 0
        let kutu_dy = 0
        let kutu_w  = canvas.width * olcek
        let kutu_h  = canvas.height * olcek

        if (ayarlar.konum == '1'){
            ctx.translate(0,0)
        }else if (ayarlar.konum == '2'){ 
            ctx.translate(canvas.width/2,0)
            if(canvas.width - ((canvas.width/2) + kutu_w)){
                kutu_dx = canvas.width - ((canvas.width/2) + kutu_w) 
            }
        }else if (ayarlar.konum == '3'){ 
            ctx.translate(0,canvas.height/2)
            if(canvas.height - ((canvas.height/2) + kutu_h)){
                kutu_dy = canvas.height - ((canvas.height/2) + kutu_h) 
            } 
        }else if (ayarlar.konum == '4'){ 
            ctx.translate(canvas.width/2,canvas.height/2)
            if(canvas.width - ((canvas.width/2) + kutu_w)){
                kutu_dx = canvas.width - ((canvas.width/2) + kutu_w) 
            }
            if(canvas.height - ((canvas.height/2) + kutu_h)){
                kutu_dy = canvas.height - ((canvas.height/2) + kutu_h) 
            } 
        }else if (ayarlar.konum == '5'){ 
            ctx.translate(canvas.width/2,canvas.height/2) 
            kutu_dx = -kutu_w*.5
            kutu_dy = -kutu_h*.5
        }
        



        ctx.drawImage(msg_box, kutu_dx, kutu_dy, kutu_w, kutu_h);
    }


    const jpgData = canvas.encodeSync('jpeg', { quality: 0.80 })
    fs.writeFileSync(path.join(target_path), jpgData)
}

// Bir mesaj kutusu oluşturur canvas döndürür
async function mesajKutusunuOlustusu(scrn_width, scrn_height, mesaj, mesaj_turu, okul_turu) {
    const kutu_width = scrn_width
    const kutu_height = scrn_height
    const msg_canvas = createCanvas(kutu_width, kutu_height)
    const ctx = msg_canvas.getContext('2d')
    //GlobalFonts.registerFromPath(path.join(__dirname,'assets/Alkatra-VariableFont_wght.ttf'), 'Alkatra')
    let msg_bg_name = "msg_bg" + Math.floor(Math.random() * 5)
    let image_path = path.join(__dirname, '/assets/' + msg_bg_name + '.png')
    const background = await loadImage(image_path);
    ctx.drawImage(background, 0, 0, msg_canvas.width, msg_canvas.height);
    let x = 0
    let y = kutu_width * .14
    let satir_arasi = kutu_width * .03
    let font_footer = "bold 60px Comic Sans MS"
    let font_title = "bold 50px Comic Sans MS"
    let font_answer = "bold 20px Comic Sans MS"
    let font_desc = "40px Comic Sans MS"


 
    ctx.textAlign = "center";
    x = msg_canvas.width / 2

    // ---------------------------------------------   "GÜNÜN DEYİMİ" 
    if (mesaj_turu == 'expression') {
        footer = "GÜNÜN DEYİMİ"
        ctx.font = font_footer;
        ctx.fillText(footer, x, y)
        y *= 1.2
        ctx.font = font_title;
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width);
        titles.forEach(title => {
            satir_width = ctx.measureText(title);
            y += satir_arasi
            ctx.fillText(title, x, y);
        });


        ctx.font = font_desc;
        y += satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width);
        descs.forEach(desc => {
            satir_width = ctx.measureText(desc);
            y += satir_arasi
            ctx.fillText(desc, x, y);
        });
        // ---------------------------------------------   "GÜNÜN OYUNU"
    } else if (mesaj_turu == 'game') {
        footer = "GÜNÜN OYUNU"
        ctx.font = font_footer;
        ctx.fillText(footer, x, y);
        y *= 1.2
        ctx.font = font_title;
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width);
        titles.forEach(title => {
            satir_width = ctx.measureText(title);
            y += satir_arasi
            ctx.fillText(title, x, y);
        });


        ctx.font = font_desc;
        y += satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width);
        descs.forEach(desc => {
            satir_width = ctx.measureText(desc);
            y += satir_arasi
            ctx.fillText(desc, x, y);
        });
    } else if (mesaj_turu == 'proverb') {
        // ---------------------------------------------   "GÜNÜN ATASÖZÜ"
        footer = "GÜNÜN ATASÖZÜ"
        ctx.font = font_footer;
        ctx.fillText(footer, x, y);
        y *= 1.2
        ctx.font = font_title;
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width);
        titles.forEach(title => {
            satir_width = ctx.measureText(title);
            y += satir_arasi
            ctx.fillText(title, x, y);
        });


        ctx.font = font_desc;
        y += satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width);
        descs.forEach(desc => {
            satir_width = ctx.measureText(desc);
            y += satir_arasi
            ctx.fillText(desc, x, y);
        });
        // ---------------------------------------------   "GÜNÜN NEDENİ"
    } else if (mesaj_turu == 'reason') {
        footer = "GÜNÜN NEDENİ"
        ctx.font = font_footer;
        ctx.fillText(footer, x, y);
        y *= 1.2
        ctx.font = font_title;
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width);
        titles.forEach(title => {
            satir_width = ctx.measureText(title);
            y += satir_arasi
            ctx.fillText(title, x, y);
        });


        ctx.font = font_desc;
        y += satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width);
        descs.forEach(desc => {
            satir_width = ctx.measureText(desc);
            y += satir_arasi
            ctx.fillText(desc, x, y);
        });
    } else if (mesaj_turu == 'solution') {
        // ---------------------------------------------   "GÜNÜN ÇÖZÜMÜ"
        footer = "GÜNÜN ÇÖZÜMÜ"
        ctx.font = font_footer;
        ctx.fillText(footer, x, y);
        y *= 1.2
        ctx.font = font_title;
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width);
        titles.forEach(title => {
            satir_width = ctx.measureText(title);
            y += satir_arasi
            ctx.fillText(title, x, y);
        });


        ctx.font = font_desc;
        y += satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width);
        descs.forEach(desc => {
            satir_width = ctx.measureText(desc);
            y += satir_arasi
            ctx.fillText(desc, x, y);
        });
        // ----------------------- GÜNÜN ÖNERİSİ
    }else if (mesaj_turu == 'suggestion') {
        footer = "GÜNÜN ÖNERİSİ"
        ctx.font = font_footer;
        ctx.fillText(footer, x, y);
        y *= 1.2
        ctx.font = font_title;
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width);
        titles.forEach(title => {
            y += satir_arasi
            ctx.fillText(title, x, y);
        });


        ctx.font = font_desc;
        y += satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width);
        descs.forEach(desc => {
            y += satir_arasi
            ctx.fillText(desc, x, y);
        });
    } else if (mesaj_turu == 'value') {
        // ---------------------------------------------   "GÜNÜN BİLGİSİ"
        footer = "GÜNÜN BİLGİSİ"
        ctx.font = font_footer;
        ctx.fillText(footer, x, y);
        y *= 1.2
        ctx.font = font_title;
        let names = satirlaraBol(ctx, mesaj.title, msg_canvas.width);
        names.forEach(name => {
            y += satir_arasi
            ctx.fillText(name, x, y);
        });

        ctx.font = font_desc;
        y += satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width);
        descs.forEach(desc => {
            y += satir_arasi
            ctx.fillText(desc, x, y);
        });
    } else if (mesaj_turu == 'word') {
        // ---------------------------------------------   "GÜNÜN KELİMESİ"
        footer = "GÜNÜN KELİMESİ"
        ctx.font = font_footer;
        ctx.fillText(footer, x, y);
        y *= 1.5
        ctx.font = font_title;
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width);
        titles.forEach(title => {
            y += satir_arasi
            ctx.fillText(title, x, y);
        });

        ctx.font = font_desc;
        y += satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width);
        descs.forEach(desc => {
            y += satir_arasi
            ctx.fillText(desc, x, y);
        });
    } else if (mesaj_turu == 'spelling') {
        // ---------------------------------------------   "GÜNÜN DOĞRUSU"
        // dogru yanlış işaretleri
        const d_y_canvas = createCanvas(64, 64)
        const d_y_ctx = msg_canvas.getContext('2d')
        let icon_dogru_path = path.join(__dirname, '/assets/dogru.png')
        let icon_yanlis_path = path.join(__dirname, '/assets/yanlis.png')
        const dogru_bg = await loadImage(icon_dogru_path);
        const yanlis_bg = await loadImage(icon_yanlis_path);

        footer = "GÜNÜN DOĞRUSU"
        ctx.font = font_footer;
        ctx.fillText(footer, x, y);

        y *= 2
        ctx.font = font_title;
        ctx.fillText(mesaj.correct, x, y);
        let doguru_uzunlugu = ctx.measureText(mesaj.correct)
        d_y_ctx.drawImage(dogru_bg, x - doguru_uzunlugu.width, y - satir_arasi);
        ctx.drawImage(d_y_canvas, 0, 0);

        y += 2 * satir_arasi
        ctx.fillText(mesaj.wrong, x, y);
        d_y_ctx.clearRect(0, 0, d_y_canvas.width, d_y_canvas.height);
        let yanlis_uzunlugu = ctx.measureText(mesaj.wrong)
        d_y_ctx.drawImage(yanlis_bg, x - yanlis_uzunlugu.width, y - satir_arasi);
        ctx.drawImage(d_y_canvas, 0, 0); 
    } else if (mesaj_turu == 'puzzle') {
        // ---------------------------------------------   "GÜNÜN BİLMECESİ"
        footer = "GÜNÜN BİLMECESİ"
        ctx.font = font_footer;
        ctx.fillText(footer, x, y);
        ctx.font = font_desc;
        y += satir_arasi
        y *= 1.5
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width);
        descs.forEach(desc => {
            y += satir_arasi
            ctx.fillText(desc, x, y);
        });

        y *= 1.5
        ctx.translate(x, y)
        ctx.rotate(Math.PI) 
        ctx.globalAlpha = .6
        ctx.font = font_answer
        ctx.textAlign = "center" 
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, msg_canvas.width, 0);
        gradient.addColorStop(0, "#ffffff"); 
        gradient.addColorStop(1, "#ffffff");  
        ctx.strokeStyle = gradient
        ctx.lineWidth = 2
        ctx.strokeText(mesaj.answer, 0, -msg_canvas.height + y + (3 * satir_arasi) )
         
        ctx.fillStyle = 'black';
        ctx.fillText(mesaj.answer, 0, -msg_canvas.height + y + (3 * satir_arasi))
        ctx.rotate(Math.PI)
        ctx.translate(-x, -y)
    } else if (mesaj_turu == 'ayet') {
        // ---------------------------------------------   "GÜNÜN AYETİ"
        footer = "GÜNÜN AYETİ"
        ctx.font = font_footer;
        ctx.fillText(footer, x, y);
        y *= 1.5
        ctx.font = font_title;
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width);
        titles.forEach(title => {
            y += satir_arasi
            ctx.fillText(title, x, y);
        });

        ctx.font = font_desc;
        y += satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width);
        descs.forEach(desc => {
            y += satir_arasi
            ctx.fillText(desc, x, y);
        });  
    }else if (mesaj_turu == 'hadis') {
        // ---------------------------------------------   "GÜNÜN HADİSİ"
        footer      = "GÜNÜN HADİSİ"
        ctx.font    = font_footer;
        ctx.fillText(footer, x, y);

        ctx.font = font_desc;
        y += satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width);
        descs.forEach(desc => {
            y += satir_arasi
            ctx.fillText(desc, x, y);
        }); 
    }else if (mesaj_turu == 'yemek') {
        // ---------------------------------------------   "GÜNÜN YEMEĞİ"
        footer = "GÜNÜN YEMEĞİ"
        ctx.font = font_footer;
        ctx.fillText(footer, x, y);
        y *= 1.5
        ctx.font = font_title;
        let titles = satirlaraBol(ctx, mesaj.title, msg_canvas.width);
        titles.forEach(title => {
            y += satir_arasi
            ctx.fillText(title, x, y);
        });

        ctx.font = font_desc;
        y += satir_arasi
        let descs = satirlaraBol(ctx, mesaj.desc, msg_canvas.width);
        descs.forEach(desc => {
            y += satir_arasi
            ctx.fillText(desc, x, y);
        });   
    }else {
        console.log(mesaj_turu)
    }


    return msg_canvas
}

// uzun metinleri satılara ayırarark dizi döndürür
function satirlaraBol(context, text, fitWidth) {
    fitWidth = fitWidth || 0;
    fitWidth *= .74 // geniliğin 0.8 ine sığdır 
    lines = []
    if (fitWidth <= 0) {
        context.fillText(text, x, y);
        return;
    }
    if (text==undefined){
        console.log(text)
    }
    var words = text.split(' ');
    var currentLine = 0;
    var idx = 1;
    while (words.length > 0 && idx <= words.length) {
        var str = words.slice(0, idx).join(' ');
        var w = context.measureText(str).width;
        if (w > fitWidth) {
            if (idx == 1) {
                idx = 2;
            }
            lines.push(words.slice(0, idx - 1).join(' '))
            currentLine++;
            words = words.splice(idx - 1);
            idx = 1;
        }
        else { idx++; }
    }
    if (idx > 0)
        lines.push(words.join(' '))
    return lines
}