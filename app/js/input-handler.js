$(() => {
    inputBox.trigger('focus');
});

$(window).keypress(() => {
    inputBox.trigger('focus');
});

function newInput() {
    const input = inputBox.val();
    inputBox.val('');

    logMessage('> ' + input, 'msg-player').then();
    logMessage('Unknown command.', 'msg-game').then();
}