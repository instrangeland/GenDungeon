// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

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
    logMessage(matchInput(), 'msg-game').then();
}

/**
 * Parses and handles user input, returning a string that should be printed to in-game console.
 * @returns {string}
 */
function matchInput() {
    const map = gameData.map;
    const player = gameData.player;

    let response = 'Unknown command.'

    /* "north [...]" */
    if (nextWord('north')) {
        player.y++;
        response = 'You move north.';
    }
    /* "south [...]" */
    if (nextWord('south')) {
        player.y--;
        response = 'You move south.';
    }
    /* "east [...]" */
    if (nextWord('east')) {
        player.x++;
        response = 'You move east.';
    }
    /* "west [...]" */
    if (nextWord('west')) {
        player.x--;
        response = 'You move west.';
    }

    if (!map[player.y]) {
        map.addRoom(player.y, player.x);
    } else if (!map[player.y][player.x]) {
        map.addRoom(player.y, player.x);
    }

    const room = gameData.map[gameData.player.y][gameData.player.x];

    /* "look [...]" */
    if (nextWord('look')) {

        /* "look" OR "look around [...]" */
        if (nextWord('around') || !remainingWords()) {
            return 'You are at [' + player.x + ', ' + player.y + '].\n' +
                'Contents of this room: ' + room.listMonsters();
        }

        /* "look at" */
        if (nextWord('at') && !remainingWords()) {
            return 'What do you want to look at?';
        }

        /* "look at [...]" */
        const thing = room.lookAtMonster(remainingWords());
        if (thing) {
            return thing;
        } else {
            return 'That doesn\'t exist here.';
        }
    }

    /* "zombie" */
    const thing = room.lookAtMonster(remainingWords());
    if (thing) {
        return thing;
    }

    gameData.map = map;
    gameData.player = player;

    return response;
}

/**
 * Pops if given word matches next word, delimited by spaces, of the user input.
 *
 * @param match {string} word to match
 * @returns {boolean} if words match
 */
function nextWord(match) {
    const word = inputArray[0];
    if (word === match) {
        inputArray.shift();
    }
    return word === match;
}

/**
 * Returns the rest of the unpopped words.
 * @returns {string} the rest of the unpopped words
 */
function remainingWords() {
    return inputArray.join(' ');
}