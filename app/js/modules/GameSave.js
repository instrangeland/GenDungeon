/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import game, {isElectron} from '../game.js';

/**
 * Code related to saving and loading a game save.
 */
export default class GameSave {
    constructor() {
        this.seed = Math.random();
        this.history = [];

        if (isElectron) {
            window.api.send('loadGame');
            window.api.receive('receivedGameSave', (response) => {
                this.loadElectron(response);
                game.startGame(this.seed, this.history);
            });
        } else {
            this.loadLocalStorage();
            game.startGame(this.seed, this.history);
        }
    }

    /**
     * Saves the current GameSave data to a file or localStorage
     */
    save() {
        const exportData = btoa(JSON.stringify(unescape({
            seed: this.seed,
            history: this.history,
        })));

        if (isElectron) {
            window.api.send('saveGame', exportData);
        } else {
            localStorage.setItem('save', exportData);
        }
    }

    /**
     * Loads a given game save from a response from an electron API call.
     * @param {string} response The response from the API call
     */
    loadElectron(response) {
        if (response) {
            this.seed = JSON.parse(atob(escape(response))).seed;
            this.history = JSON.parse(atob(escape(response))).history;
        } else {
            this.save();
        }
    }

    /**
     * Attempts to load a game save from localStorage.
     */
    loadLocalStorage() {
        const response = localStorage.getItem('save');
        if (response) {
            this.seed = JSON.parse(atob(escape(response))).seed;
            this.history = JSON.parse(atob(escape(response))).history;
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