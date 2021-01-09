// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const {app, BrowserWindow} = require('electron');

/**
 * Creates a new game window
 */
function newWindow() {
    const window = new BrowserWindow({
        width: 1000,
        height: 600,
        icon: 'icon.png',
        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    });
    if (process.argv.includes('test')) {
        window.openDevTools();
    }
    window.setTitle('ProceduralTA');
    window.removeMenu();
    window.loadFile('app/index.html').then();
}

app.whenReady().then(newWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        newWindow();
    }
});