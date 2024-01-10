const { promisify } = require('node:util');
const childProcess  = require('node:child_process');
const execFile      = promisify(childProcess.execFile);
const process       = require('process')
const path = require('path');


module.exports.setWallpeaper = async function setWallpeaper(target_path) {
    if (process.platform === 'win32') {
        const binary = path.join(__dirname, '/assets/windows-wallpaper-x86-64.exe');
        let scale = 'fill'
        const arguments_ = [
            'set',
            path.resolve(target_path),
            '--scale',
            scale,
        ];
        await execFile(binary, arguments_);
    }
    gnome(target_path)
    kde(target_path) 
}


async function gnome(target_path) {
    try {
        let command = 'gsettings'
        let { stdout } = await execFile('which', ['-a', command]);
        stdout = stdout.trim(); if (stdout) {
            await execFile('gsettings', [
                'set',
                'org.gnome.desktop.background',
                'picture-uri',
                `file://${target_path}`,
            ]);
        }
    } catch (err) {
        return
    }
}


async function kde(target_path) {
    try {
        command = 'qdbus'
        let { stdout } = await execFile('which', ['-a', command]);
        stdout = stdout.trim();
        await execFile('qdbus', [
            'org.kde.plasmashell',
            '/PlasmaShell',
            'org.kde.PlasmaShell.evaluateScript',
            `
		var allDesktops = desktops();
		for (var i = 0; i < allDesktops.length; i++) {
			var desktop = allDesktops[i];
			desktop.wallpaperPlugin = 'org.kde.image';
			desktop.currentConfigGroup = ['Wallpaper', 'org.kde.image', 'General'];
			desktop.writeConfig('Image', 'file://${target_path}');
		}
		`,
        ]);
    } catch (err) {
        return
    }
}