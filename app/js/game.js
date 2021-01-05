// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const inputBox = $('#input-box');
const log = $('#log');

const charDelay = 10;

const titleMessage = 'Welcome to ProceduralTA!';
const introMessage = 'You are in a room.';

const gameData = {};

/**
 * Writes a message to the in-game console.
 *
 * @param message {string}  the message to write
 * @param type {string}     css class to apply
 * @returns {Promise<void>}
 */
async function logMessage(message, type) {
    const entry = $('<div></div>').addClass(type).appendTo(log);
    for (const char of message) {
        if (char === '\n') {
            entry.append('<br>');
        } else {
            entry.append(char);
        }
        await new Promise(resolve => setTimeout(resolve, charDelay));
    }
}

$(() => {
    gameData.map = new GameMap();
    gameData.player = new Player();
    logMessage(titleMessage, 'msg-system').then();
    logMessage(introMessage, 'msg-game').then();
});