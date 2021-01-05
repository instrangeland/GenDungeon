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

function matchInput() {
    const cMap = gameData.map;
    const cPlayer = gameData.player;

    let response = 'Unknown command.'

    if (nextWord('north')) {
        cPlayer.y++;
        response = 'You move north.';
    }
    if (nextWord('south')) {
        cPlayer.y--;
        response = 'You move south.';
    }
    if (nextWord('east')) {
        cPlayer.x++;
        response = 'You move east.';
    }
    if (nextWord('west')) {
        cPlayer.x--;
        response = 'You move west.';
    }

    if (!cMap[cPlayer.y]) {
        cMap.addRoom(cPlayer.y, cPlayer.x);
    } else if (!cMap[cPlayer.y][cPlayer.x]) {
        cMap.addRoom(cPlayer.y, cPlayer.x);
    }

    const cRoom = gameData.map[gameData.player.y][gameData.player.x];

    if (nextWord('look')) {

        if (nextWord('around') || !wordsLeft())
            return 'You are at [' + cPlayer.x + ', ' + cPlayer.y + '].\n' +
                'Contents of this room: ' + cRoom.printMonsters();

        if (nextWord('at') && !wordsLeft())
            return 'What do you want to look at?';

        const object = cRoom.printObject(wordsLeft());
        if (object)
            return object;
        else
            return 'That doesn\'t exist here.';
    }

    const object = cRoom.printObject(wordsLeft());
    if (object)
        return object;

    gameData.map = cMap;
    gameData.player = cPlayer;

    return response;
}

function nextWord(match) {
    const word = inputArray[0];
    if (word === match)
        inputArray.shift();
    return word === match;
}

function wordsLeft() {
    return inputArray.join(' ');
}