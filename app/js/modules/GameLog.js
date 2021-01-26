// ProceduralTA is licensed under GNU General Public License v3.0.

export const logTypes = {
    ALERT: 'msg-alert',
    COMBAT: 'msg-combat',
    GAME: 'msg-game',
    MOVEMENT: 'msg-movement',
    PLAYER: 'msg-player',
    RESTART: 'msg-restart',
    SUCCESS: 'msg-success',
    SYSTEM: 'msg-system'
};

/**
 * A log in which game messages are shown.
 * @module GameLog
 * @class
 */
export class GameLog {
    static init() {
        this.logElement = $('#log');
        this.logElement.empty();
        this.addMessage('Welcome to ProceduralTA!', logTypes.SYSTEM);
        this.addMessage('You are in a room. Try typing "look" to look around!', logTypes.GAME);
    }

    /**
     * Adds a horizontal rule to the log.
     */
    static addDivider() {
        this.logElement.append('<hr>');
    }

    /**
     * Adds a message to the log.
     * @param {string} messageContent The content of the message
     * @param {string} messageType The type of the message
     */
    static addMessage(messageContent, messageType) {
        this.logElement.append(`<p class="${messageType}"></p>`);

        const messageElement = this.logElement.children().last();

        for (const char of messageContent) {
            if (char === '\n') {
                messageElement.append('<br>');
            } else {
                messageElement.append(char);
            }
        }

        this.logElement.scrollTop(this.logElement.prop('scrollHeight'));
    }
}