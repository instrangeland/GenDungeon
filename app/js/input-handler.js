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

    nextWord('go');

    /* NORTH ... */
    if (nextWord('north')) {
        player.y++;
        return 'You move north.';
    }
    /* SOUTH ... */
    if (nextWord('south')) {
        player.y--;
        return 'You move south.';
    }
    /* EAST ... */
    if (nextWord('east')) {
        player.x++;
        return 'You move east.';
    }
    /* WEST ... */
    if (nextWord('west')) {
        player.x--;
        return 'You move west.';
    }

    if (!map[player.y]) {
        map.addRoom(player.y, player.x);
    } else if (!map[player.y][player.x]) {
        map.addRoom(player.y, player.x);
    }

    const room = gameData.map[player.y][player.x];

    /* LOOK ... */
    if (nextWord('look')) {

        /* LOOK or LOOK AROUND ... */
        if (nextWord('around') || !remainingWords()) {
            return `You are at [${player.x}, ${player.y}].\nContents of this room: ${room.listMonsters()}`;
        }

        /* LOOK AT */
        if (nextWord('at') && !remainingWords()) {
            return 'What do you want to look at?';
        }

        /* LOOK ... or LOOK AT ... */
        const thing = room.getMonster(remainingWords());
        if (thing) {
            return `You are looking at: ${thing.species}.`;
        }
        return 'That doesn\'t exist here.';
    }

    /* ATTACK ... */
    if (nextWord('attack')) {

        /* ATTACK */
        if (!remainingWords()) {
            return 'What do you want to attack?';
        }

        /* ATTACK ... */
        const monster = room.getMonster(remainingWords());
        if (monster) {
            monster.hp--;
            if (monster.hp > 0) {
                return `You did 1 damage, taking its HP down to ${monster.hp}.`;
            }
            room.removeMonster(remainingWords());
            return `You did 1 damage. The ${monster.species.toLowerCase()} is now dead.`;
        }
        return 'That doesn\'t exist here.';
    }

    /* ... */
    const thing = room.getMonster(remainingWords());
    if (thing) {
        return `You are looking at: ${thing.species}.`;
    }

    return 'Unknown command';
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