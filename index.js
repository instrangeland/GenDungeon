const {app, BrowserWindow} = require('electron');

function newWindow() {
    let window = new BrowserWindow({
        width: 800,
        height: 600,
        icon: 'icon.png',
        webPreferences: {
            contextIsolation: true
        }
    });
    window.removeMenu();
    window.loadFile('app/index.html').then();
}

app.whenReady().then(newWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
        newWindow();
});