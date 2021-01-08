// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const inputBox = $('#input-box');
const log = $('#log');

const charDelay = 10;

const titleMessage = 'Welcome to ProceduralTA!';
const introMessage = 'You are in a room.';

const gameData = {};

let input;
let inputArray;

$(() => {
    inputBox.trigger('focus');
});

$(window).keypress(() => {
    inputBox.trigger('focus');
});

function newInput() {
    input = inputBox.val();
    inputArray = input.toLowerCase().split(' ');

    inputArray = inputArray.filter(word => word !== 'a');
    inputArray = inputArray.filter(word => word !== 'an');
    inputArray = inputArray.filter(word => word !== 'the');

    inputBox.val('');

    logMessage('> ' + input, 'msg-player').then();
    let response = handleInput();

    for (const monster of gameData.map[gameData.player.y][gameData.player.x].monsters) {
        if (monsterAttacksPlayer(gameData.player, monster)) {
            response += `\n* The ${monster.species} attacks you, doing ${monster.strength} damage.`;
        } else {
            response += `\n* The ${monster.species} attacks you, killing you.`;
        }
    }

    logMessage(response, 'msg-game').then();

    return false;
}

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
        log.scrollTop(log.prop('scrollHeight'));
    }
}

$(() => {
    gameData.map = new GameMap();
    gameData.player = new Player();
    logMessage(titleMessage, 'msg-system').then();
    logMessage(introMessage, 'msg-game').then();
});