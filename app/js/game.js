// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const {ipcRenderer} = require('electron')

window.$ = window.jQuery = require('jquery');

const inputBox = $('#input-box');
const log = $('#log');

// The time between individual characters rendering in the animation
const charDelay = 10;

const titleMessage = 'Welcome to ProceduralTA!';
const introMessage = 'You are in a room.';

/**
 * Animates a message appearing on screen
 * @param message The message to render
 * @param type The type of message (msg-system, msg-game, or msg-player)
 * @return {Promise<void>} Async promise
 */
async function logMessage(message, type) {
    const entry = $('<div></div>').addClass(type).appendTo(log);
    for (const char of message) {
        if (char === '\n')
            entry.append('<br>');
        else
            entry.append(char);
        await new Promise(resolve => setTimeout(resolve, charDelay));
    }
}

// Game start
$(() => {
    logMessage(titleMessage, 'msg-system').then();
    logMessage(introMessage, 'msg-game').then();
});

// Load game save if it exists
ipcRenderer.send('loadGame');
ipcRenderer.on('loadGame-reply', (event, saveData) => {
    if (saveData) {
        player = saveData['player'];
        map = saveData['map'];
    }
});