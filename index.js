// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const {app, BrowserWindow} = require('electron');

/**
 * Creates a new electron window with the game
 */
function newWindow() {
    const window = new BrowserWindow({
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