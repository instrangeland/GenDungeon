// ProceduralTA is licensed under GNU General Public License v3.0.

import {gameData} from '../ProceduralTA.js';

export const logTypes = {
    ALERT: 'msg-alert',
    COMBAT: 'msg-combat',
    GAME: 'msg-game',
    MOVEMENT: 'msg-movement',
    PLAYER: 'msg-player',
    SUCCESS: 'msg-success',
    SYSTEM: 'msg-system'
};

/**
 * A log in which game messages are shown.
 * @module GameLog
 * @class
 */
export class GameLog {
    constructor() {
        if (!gameData.isElectron) {
            this.addMessage('ProceduralTA is best played offline. Some features may not work in a browser.', logTypes.ALERT);
        }
        this.addMessage('Welcome to ProceduralTA!', logTypes.SYSTEM);
        this.addMessage('You are in a room. Try typing "look" to look around!', logTypes.GAME);
    }

    /**
     * Adds a message to the log.
     * @param {string} messageContent The content of the message
     * @param {string} messageType The type of the message
     */
    addMessage(messageContent, messageType) {
        const logElement = $('#log');
        logElement.append(`<p class="${messageType}"></p>`);

        const messageElement = logElement.children().last();

        for (const char of messageContent) {
            if (char === '\n') {
                messageElement.append('<br>');
            } else {
                messageElement.append(char);
            }
        }

        logElement.scrollTop(logElement.prop('scrollHeight'));
    }
}