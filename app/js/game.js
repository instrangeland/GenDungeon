// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const inputBox = $('#input-box');
const log = $('#log');

const gameData = {};

const logTypes = {
    ALERT: 'msg-alert',
    COMBAT: 'msg-combat',
    GAME: 'msg-game',
    PLAYER: 'msg-player',
    SYSTEM: 'msg-system'
};

/**
 * Compares two strings while ignoring case.
 * @param {string} str1 The first string
 * @param {string} str2 The second string
 * @return {boolean} Whether the strings match
 */
function equalsCI(str1, str2) {
    return str1.toLowerCase() === str2.toLowerCase();
}

/**
 * Gets a random element from an array.
 * @param {Array} array The array to get the element from
 * @return {*} The random element
 */
function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

/**
 * Gets a random integer from a range
 * @param {number} min The minimum integer
 * @param {number} max The maximum integer
 * @return {number} The random integer
 */
function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

$(() => {
    inputBox.trigger('focus');
});

$(window).keypress(() => {
    inputBox.trigger('focus');
});

/**
 * Gets input from the user, parses the input, and logs the input and response.
 * @return {boolean} Always false to prevent page reload
 */
function newInput() {
    const input = inputBox.val();

    if (!input) {
        return false;
    }

    logMessage('> ' + input, logTypes.PLAYER);

    handleInput(input);
    inputBox.val('');

    const map = gameData.map;
    const player = gameData.player;

    if (!map.getRoom(player.y, player.x)) {
        map.addRoom(player.y, player.x);
        const room = gameData.map[player.y][player.x];
        logMessage(room.getInfo(player), logTypes.GAME);
    }

    gameData.minimap.update();

    for (const monster of gameData.map[gameData.player.y][gameData.player.x].monsters) {
        if (monster.playerInteraction(gameData.player)) {
            logMessage('--- GAME OVER ---', logTypes.SYSTEM);
            inputBox.prop('disabled', true);
            inputBox.attr('placeholder', 'Thanks for playing!');
            return false;
        }
    }

    return false;
}

/**
 * Logs a message in the game UI.
 * @param {string} message The message to log
 * @param {string} type The type of message
 */
function logMessage(message, type) {
    const entry = $('<div></div>').addClass(type).appendTo(log);
    for (const char of message) {
        if (char === '\n') {
            entry.append('<br>');
        } else {
            entry.append(char);
        }
        log.scrollTop(log.prop('scrollHeight'));
    }
}

$(() => {
    const titleMessage = 'Welcome to ProceduralTA!';
    const introMessage = 'You are in a room. Try typing "look" to look around!';

    gameData.map = new GameMap();
    gameData.player = new Player();
    gameData.minimap = new Minimap();
    logMessage(titleMessage, 'msg-system');
    logMessage(introMessage, 'msg-game');
});