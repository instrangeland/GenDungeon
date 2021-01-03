// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const fs = require('fs');
const {app, BrowserWindow, ipcMain} = require('electron');

/**
 * Creates a new electron window with the game
 */
function newWindow() {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        icon: 'icon.png',
        webPreferences: {
            nodeIntegration: true
        }
    });
    window.openDevTools();
    window.removeMenu();
    window.loadFile('app/index.html').then();
}

// Launches the window on load
app.whenReady().then(newWindow);

// Closes the process on close
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin')
        app.quit();
});

// Launches the window on activation
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0)
        newWindow();
});

// IPC listener for requests to load game save
ipcMain.on('loadGame', event => {
    fs.readFile('save.pta', 'utf-8', (err, data) => {
        if (!data)
            // Game file does not exist
            event.reply('loadGame-reply', undefined)
        else
            // Game file exists
            event.reply('loadGame-reply', JSON.parse(data));
    });
});

// IPC listener for requests to write to game save
ipcMain.on('saveGame', (event, save) => {
    fs.writeFile('save.pta', JSON.stringify(save), () => {
    });
});