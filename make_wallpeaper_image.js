const { app,screen } = require('electron')
const { createCanvas,Image , loadImage} = require('./node_modules/@napi-rs/canvas')
const {promises} = require('fs')
const fs = require('fs')
const path  = require('path');

module.exports.makeWallpeaperImage = async function makeWallpeaperImage(image_path, json_data) {
    console.log(image_path, json_data) 
    await app.whenReady()
    const primaryDisplay    = screen.getPrimaryDisplay()
    const { width, height } = primaryDisplay.workAreaSize 
    const canvas            = createCanvas(width, height)
    const ctx               = canvas.getContext('2d')

    const background = await loadImage(image_path);
    ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    ctx.font = '60px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText("interaction.member.displayName", canvas.width / 2.5, canvas.height / 1.8);

    const pngData = await canvas.encode('png')
    await promises.writeFile(path.join(__dirname, 'simple.png'), pngData)


}