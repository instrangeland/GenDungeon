// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const inputBox = $('#input-box');
const log = $('#log');

const titleMessage = 'Welcome to ProceduralTA!';
const introMessage = 'You are in a room.';

const charDelay = 10;

const gameData = {};

const logTypes = {
    GAME: 'msg-game',
    PLAYER: 'msg-player',
    SYSTEM: 'msg-system'
};

$(() => {
    inputBox.trigger('focus');
});

$(window).keypress(() => {
    inputBox.trigger('focus');
});

/**
 * Compares two strings while ignoring case.
 * @param {string} str1 The first string
 * @param {string} str2 The second string
 * @return {boolean} Whether the strings match
 */
function equalsCI(str1, str2) {
    return str1.toLowerCase() === str2.toLowerCase();
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Gets input from the user, parses the input, and logs the input and response.
 * @return {boolean} Always false to prevent page reload
 */
function newInput() {
    const input = inputBox.val();
    const response = handleInput(input);
    inputBox.val('');

    logMessage('> ' + input, logTypes.PLAYER).then();

    if (Array.isArray(response)) {
        logMessage(response[0], logTypes.GAME).then();
        logMessage(response[1], logTypes.SYSTEM).then();
    } else {
        logMessage(response, logTypes.GAME).then();
    }

    return false;
}

/**
 * Logs a message in the game UI.
 * @param {string} message The message to log
 * @param {string} type The type of message
 * @return {Promise<void>} Promise that the message will be logged
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
        log.scrollTop(log.prop('scrollHeight'));
    }
}

$(() => {
    gameData.map = new GameMap();
    gameData.player = new Player();
    logMessage(titleMessage, 'msg-system').then();
    logMessage(introMessage, 'msg-game').then();
});