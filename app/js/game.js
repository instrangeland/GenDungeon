const inputBox = $('#input-box');
const log = $('#log');
const charDelay = 10;

const titleMessage = 'Welcome to ProceduralTA!';
const introMessage = 'You are in a room.';

async function logMessage(message, type) {
    const entry = $('<div></div>').addClass(type).appendTo(log);
    for (const char of message) {
        entry.append(char);
        await new Promise(resolve => setTimeout(resolve, charDelay));
    }
}

$(() => {
    logMessage(titleMessage, 'msg-system').then();
    logMessage(introMessage, 'msg-game').then();
    logMessage(window.process.type, 'msg-system').then();
});