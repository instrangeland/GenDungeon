$(() => {
    inputBox.trigger('focus');
});

$(window).keypress(() => {
    inputBox.trigger('focus');
});

let input;
let inputArray;

function newInput() {
    input = inputBox.val();
    inputArray = input.toLowerCase().split(' ');
    inputBox.val('');

    logMessage('> ' + input, 'msg-player').then();
    logMessage(matchInput(), 'msg-game').then();
}

function matchInput() {

    // look around
    if (nextWord('look'))
        return 'You are at [' + player.x + ', ' + player.y + '].';

    // movement
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

    return 'Unknown command.';
}

function nextWord(match) {
    let word = inputArray[0];
    if (word === match)
        inputArray.shift();
    return word === match;
}