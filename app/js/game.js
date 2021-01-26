// ProceduralTA is licensed under GNU General Public License v3.0.

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

/**
 * The main class for the game
 * @module game
 * @class
 */
export default class game {
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

    static keyPress(event) {
        if (!event.ctrlKey) {

            // CONTROL KEY

            inputBox.focus();
        }

        if (event.keyCode === 38 && this.scrollEntry > 0) {

            // UP ARROW

            this.scrollEntry--;
            inputBox.val(gameSave.history[this.scrollEntry]);
        } else if (event.keyCode === 40 && scrollEntry < gameSave.history.length) {

            // DOWN ARROW

            this.scrollEntry++;
            inputBox.val(gameSave.history[this.scrollEntry]);
        } else if (event.keyCode === 13) {

            // ENTER KEY

            const input = inputBox.val().trim().toLowerCase();
            inputBox.val('');

            if (input) {
                gameSave.history.push(input);
                gameSave.save();
                game.newInput(input);
            }
        }
    }

    static reset() {
        gameSave.reset();
        location.reload();
    }

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
 * @param {Array} array The array
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