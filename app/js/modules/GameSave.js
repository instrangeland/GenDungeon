/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import game, {isElectron, gameVersion} from '../game.js';

/**
 * Code related to saving and loading a game save.
 */
export default class GameSave {
    constructor() {
        this.seed = Math.random();
        this.history = [];
        this.gameVersion = gameVersion;

        if (isElectron) {
            window.api.send('loadGame');
            window.api.receive('receivedGameSave', (response) => {
                this.load(response);
                game.startGame(this.seed, this.history);
            });
        } else {
            this.load(localStorage.getItem('save'));
            game.startGame(this.seed, this.history);
        }
    }

    /**
     * Saves the current GameSave data to a file or localStorage
     */
    save() {
        const exportData = btoa(escape(JSON.stringify({
            seed: this.seed,
            history: this.history,
            gameVersion: this.gameVersion
        })));

        if (isElectron) {
            window.api.send('saveGame', exportData);
        } else {
            localStorage.setItem('save', exportData);
        }
    }

    /**
     * Loads a given game save from a response
     * @param {string} response The response
     */
    load(response) {
        if (response) {
            this.seed = JSON.parse(unescape(atob(response))).seed;
            this.history = JSON.parse(unescape(atob(response))).history;
            this.gameVersion = JSON.parse(unescape(atob(response))).gameVersion;

            if (this.gameVersion < gameVersion) {
                this.reset();

                this.seed = Math.random();
                this.history = [];
                this.gameVersion = gameVersion;
            }
        } else {
            this.save();
        }
    }

    reset() {
        if (isElectron) {
            window.api.send('resetGame');
        } else {
            localStorage.clear();
        }
    }
}