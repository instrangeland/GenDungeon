/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

'use strict';

const {app, BrowserWindow, ipcMain} = require('electron');
const fs = require('fs');
const path = require('path');

const client = require('discord-rich-presence')('801220293041455104');

client.updatePresence({
    instance: true
});

let window;

const savePath = path.join(app.getPath('userData'), 'save.pta');

ipcMain.on('saveGame', (event, gameData) => {
    fs.writeFile(savePath, gameData, () => {});
});

ipcMain.on('loadGame', () => {
    fs.readFile(savePath, 'utf-8', (error, data) => {
        window.webContents.send('receivedGameSave', data);
    });
});

ipcMain.on('resetGame', () => {
    fs.unlink(savePath, () => {});
});

ipcMain.on('drpc', (event, content) => {
    client.updatePresence({
        instance: true,
        state: content
    });
});

/**
 * Creates a new game window
 */
function newWindow() {
    window = new BrowserWindow({
        width: 1000,
        height: 600,
        icon: 'icon.png',
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, "app/js/preload.js")
        }
    });
    if (process.argv.includes('test')) {
        window.openDevTools();
    }
    window.setTitle('GenDungeon');
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