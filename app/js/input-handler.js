// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

let input;
let inputArray;

// Focus input box on load
$(() => {
    inputBox.trigger('focus');
});

// Focus input box on input
$(window).keypress(() => {
    inputBox.trigger('focus');
});

/**
 * Takes user input, passes it to matchInput() and logs the result
 */
function newInput() {
    input = inputBox.val();
    inputArray = input.toLowerCase().split(' ');

    // Remove articles
    inputArray = inputArray.filter(word => word !== 'a');
    inputArray = inputArray.filter(word => word !== 'an');
    inputArray = inputArray.filter(word => word !== 'the');

    inputBox.val('');

    logMessage('> ' + input, 'msg-player').then();
    logMessage(matchInput(), 'msg-game').then();

    const save = {};
    save.player = player;
    save.map = map;
    ipcRenderer.send('saveGame', save);
}

/**
 * Processes user input
 * @return {string} The response to the input
 */
function matchInput() {

    // Moving
    if (nextWord('north')) {
        player.y++;
        return 'You move north.';
    }
    if (nextWord('south')) {
        player.y--;
        return 'You move south.';
    }
    if (nextWord('east')) {
        player.x++;
        return 'You move east.';
    }
    if (nextWord('west')) {
        player.x--;
        return 'You move west.';
    }

    // Create a room if it doesn't exist
    if (!map[player.x][player.y])
        newRoom(player.x, player.y);

    const currentRoom = map[player.x][player.y];

    // Looking
    if (nextWord('look')) {

        // Looking around
        if (nextWord('around') || !wordsLeft())
            return 'You are at [' + player.x + ', ' + player.y + '].\n' +
                'Contents of this room: ' + getMonsters(currentRoom);

        // Looking at something, but not specifying what
        if (nextWord('at') && !wordsLeft())
            return 'What do you want to look at?';

        // Looking at something
        const object = getObject(currentRoom, wordsLeft());
        if (object)
            return object;
        else
            return 'That doesn\'t exist here.';
    }

    // If the matcher doesn't find anything, try looking for an object in the current room
    const object = getObject(currentRoom, wordsLeft());
    if (object)
        return object;

    // Give up
    return 'Unknown command.';
}

/**
 * Compares the next word in the input to a given word, and removes it if it matches
 * @param match The word to check against
 * @return {boolean} Whether the word matches
 */
function nextWord(match) {
    const word = inputArray[0];
    if (word === match)
        inputArray.shift();
    return word === match;
}

/**
 * Gets all unparsed words
 * @return {string} The remaining words
 */
function wordsLeft() {
    return inputArray.join(' ');
}