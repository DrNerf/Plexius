const { app, BrowserWindow } = require('electron');
const fs = require('fs');

function createWindow() {
    // Create the browser window.
    let win = new BrowserWindow({
        width: 1280,
        height: 720,
        frame: false,
        transparent: true,
        icon: './assets/plex.ico',
        title: 'Plexius',
        webPreferences: {
            nodeIntegration: true,
            webSecurity: false,
            allowRunningInsecureContent: true
        }
    });

    win.loadURL('https://app.plex.tv/');

    win.webContents.on('dom-ready', function (e) {
        fs.readFile("injector.js", "utf8", function (err, data) {
            if (err) {
                console.error(err);
            } else {
                win.webContents.executeJavaScript(data);
            }
        });
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});