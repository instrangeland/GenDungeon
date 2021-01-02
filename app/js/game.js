'use strict';

const inputBox = $('#input-box');
const log = $('#log');

// The time between individual characters rendering in the animation
const charDelay = 10;

const titleMessage = 'Welcome to ProceduralTA!';
const introMessage = 'You are in a room. [0, 0]';

// Animate a message appearing on screen
async function logMessage(message, type) {
    const entry = $('<div></div>').addClass(type).appendTo(log);
    for (const char of message) {
        if (char === '\n')
            entry.append('<br>');
        else
            entry.append(char);
        await new Promise(resolve => setTimeout(resolve, charDelay));
    }
}

// Log intro messages on load
$(() => {
    logMessage(titleMessage, 'msg-system').then();
    logMessage(introMessage, 'msg-game').then();
});