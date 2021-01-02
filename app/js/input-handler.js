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

// Called upon submitting the form
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
}

// Checks the input to see what command the user intends
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

    let currentRoom = map[player.x][player.y];

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
        let object = getObject(currentRoom, wordsLeft());
        if (object)
            return object;
        else
            return 'That doesn\'t exist here.';
    }

    // If the matcher doesn't find anything, try looking for an object in the current room
    let object = getObject(currentRoom, wordsLeft());
    if (object)
        return object;
    return 'Unknown command.';
}

// Checks the next word to see if it matches something, and removes it if it does
function nextWord(match) {
    let word = inputArray[0];
    if (word === match)
        inputArray.shift();
    return word === match;
}

// Gets the words still in the array
function wordsLeft() {
    return inputArray.join(' ');
}