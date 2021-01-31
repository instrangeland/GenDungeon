'use strict';

const {app, BrowserWindow, ipcMain, shell} = require('electron');
const fs = require('fs');
const path = require('path');

const preferencesPath = path.join(app.getPath('userData'), 'options.json');
const savePath = path.join(app.getPath('userData'), 'save.gend');

let gameWindow;

/**
 * Creates a new Electron window and loads the game.
 */
function createWindow() {
    gameWindow = new BrowserWindow({
        width: 1000,
        height: 600,
        title: 'GenDungeon',
        icon: 'icon.png',
        webPreferences: {
            contextIsolation: true,
            preload: path.join(__dirname, 'app/js/preload.js')
        }
    });

    if (process.argv.includes('test')) {
        gameWindow.openDevTools();
    }

    gameWindow.removeMenu();
    gameWindow.loadFile('app\\index.html').then();
}

app.whenReady().then(createWindow);

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

ipcMain.on('closeGame', () => {
    gameWindow.close();
});

ipcMain.on('setFullScreen', (event, isFullScreen) => {
    gameWindow.setFullScreen(isFullScreen);
    fs.writeFileSync(preferencesPath, `{"isFullScreen": ${isFullScreen}}`);
});

ipcMain.on('openWebsite', () => {
    shell.openExternal('https://gendungeon.com/').then();
});

ipcMain.on('getPreferences', () => {
    if (!fs.existsSync(preferencesPath)) {
        fs.writeFileSync(preferencesPath, '{"isFullScreen": false}');
    }
    gameWindow.webContents.send('receivePreferences', fs.readFileSync(preferencesPath, 'utf-8'));
});