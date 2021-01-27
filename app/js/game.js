/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import {GameLog, logTypes} from './modules/GameLog.js';
import GameSave from './modules/GameSave.js';
import InputHandler from './modules/InputHandler.js';
import MiniMap from './modules/MiniMap.js';
import Monster from './modules/things/Monster.js';
import Player from './modules/Player.js';
import RPC from './modules/RPC.js';
import World from './modules/World.js';

export const isElectron = navigator.userAgent.indexOf('Electron') > -1;
const inputBox = $('#input-box');

const keyCodes = {
    ENTER: 13,
    UP_ARROW: 38,
    DOWN_ARROW: 40
};

/**
 * The main class for the game.
 */
export default class game {
    /**
     * Begins the game logic, will be called after the save is loaded.
     * @param {number} seed The seed of the game
     * @param {string[]} history An array containing all user input
     */
    static startGame(seed, history) {
        this.seed = new Math.seedrandom(seed);

        MiniMap.init();
        GameLog.init();

        this.player = new Player();
        this.world = new World();

        this.score = 0;
        this.scrollEntry = 0;

        if (history) {
            setTimeout(() => {
                for (const input of history) {
                    this.newInput(input);
                }
            });
        }
    }

    /**
     * Handles a given keydown event.
     * @param {Object} event The event
     */
    static keyPress(event) {
        if (!event.ctrlKey) {
            inputBox.focus();
        }
        if (event.keyCode === keyCodes.UP_ARROW && this.scrollEntry > 0) {
            this.scrollEntry--;
            inputBox.val(gameSave.history[this.scrollEntry]);

        } else if (event.keyCode === keyCodes.DOWN_ARROW && this.scrollEntry < gameSave.history.length) {
            this.scrollEntry++;
            inputBox.val(gameSave.history[this.scrollEntry]);

        } else if (event.keyCode === keyCodes.ENTER) {
            const input = inputBox.val().trim().toLowerCase();
            inputBox.val('');

            if (input) {
                gameSave.history.push(input);
                gameSave.save();
                game.newInput(input);
            }
        }
    }

    /**
     * Resets the game save and reloads the game.
     */
    static reset() {
        gameSave.reset();
        location.reload();
    }

    /**
     * Takes an input and computes it effects.
     * @param {string} input The input
     */
    static newInput(input) {
        GameLog.addDivider();
        GameLog.addMessage('> ' + input, logTypes.PLAYER);
        this.scrollEntry = gameSave.history.length;

        const isNewTurn = InputHandler(input);
        const y = game.player.y;
        const x = game.player.x;

        if (!game.world.getRoom(y, x).isExplored) {
            GameLog.addMessage(game.world.getRoom(y, x).getRoomInfo(), logTypes.GAME);
        }

        if (isNewTurn) {
            for (const thing of game.world.getRoom(y, x).contents) {
                if (thing instanceof Monster) {
                    if (thing.playerInteraction(game.player)) {
                        RPC.updateDead();
                        GameLog.addMessage('--- GAME OVER ---', logTypes.SYSTEM);
                        GameLog.addMessage(`Score: ${game.score}`, logTypes.SUCCESS);
                        GameLog.addMessage('RESTART', logTypes.RESTART);
                        inputBox.prop('disabled', true);
                        inputBox.attr('placeholder', 'Thanks for playing!');

                        $('.msg-restart').on('click', () => {
                            game.reset();
                        });
                    }
                }
            }
        }

        MiniMap.update();
    }
}

const gameSave = new GameSave();

$('body').on('keydown', event => {
    game.keyPress(event);
});

/**
 * Gets a random element from a given array.
 * @param {any[]} array The array
 * @return {*} The element
 */
export function getRandomElement(array) {
    return array[Math.floor(game.seed.quick() * array.length)];
}

/**
 * Gets a random integer between two given integers, inclusive.
 * @param {number} min The minimum integer
 * @param {number} max The maximum integer
 * @return {number} The random integer
 */
export function getRandInt(min, max) {
    return Math.floor(game.seed.quick() * (max - min + 1) + min);
}