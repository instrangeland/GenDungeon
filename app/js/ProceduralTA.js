// ProceduralTA is licensed under GNU General Public License v3.0.

import {GameLog, logTypes} from './modules/GameLog.js';
import {InputHandler} from './modules/InputHandler.js';
import {MiniMap} from './modules/MiniMap.js';
import {Monster} from './modules/things/Monster.js';
import {Player} from './modules/Player.js';
import {World} from './modules/World.js';
import rpc from './modules/RPC.js';

let receivedSave;

export let seed;
let gameSave = {};

let awaitingRestartKey = false;

export const gameData = {};
gameData.isElectron = navigator.userAgent.indexOf('Electron') > -1;

if (gameData.isElectron) {
    window.api.send('loadGame');

    window.api.receive('receivedGameSave', data => {
        receivedSave = data
    })
}

$(() => {
    if (!gameData.isElectron) {
        receivedSave = localStorage.getItem('save')
    }
    if (receivedSave) {
        gameSave = JSON.parse(atob(receivedSave));
        seed = new Math.seedrandom(gameSave.seed);

        initGameData();

        for (const input of gameSave.history) {
            newInput(input);
        }
    } else {
        gameSave.seed = Math.random();
        gameSave.history = [];

        seed = new Math.seedrandom(gameSave.seed);

        initGameData();
    }
});

function initGameData() {
    noise.seed(seed.quick());

    gameData.gameLog = new GameLog();
    gameData.miniMap = new MiniMap();
    gameData.player = new Player();
    gameData.world = new World();
    gameData.score = 0;
}

/**
 * Adds a message to the main log.
 * @param {string} messageContent The content of the message
 * @param {string} messageType The type of the message
 */
export function logMessage(messageContent, messageType) {
    gameData.gameLog.addMessage(messageContent, messageType);
}

/**
 * Gets a random element from a given array.
 * @param {Array} array The array
 * @return {*} The element
 */
export function getRandomElement(array) {
    return array[Math.floor(seed.quick() * array.length)];
}

/**
 * Gets a random integer between two given integers, inclusive.
 * @param {number} min The minimum integer
 * @param {number} max The maximum integer
 * @return {number} The random integer
 */
export function getRandInt(min, max) {
    return Math.floor(seed.quick() * (max - min + 1) + min);
}

$('body').on('keydown', event => {
    const inputBox = $('#input-box');
    if (!event.ctrlKey) {
        inputBox.focus();
    }

    if (event.keyCode === 82 && awaitingRestartKey) {
        if (!gameData.isElectron) {
            localStorage.clear();
        } else {
            window.api.send('resetGame');
        }
        location.reload();
    }

    if (event.keyCode === 13) {

        const input = inputBox.val().trim().toLowerCase();
        inputBox.val('');

        if (input) {
            gameSave.history.push(input);
            // noinspection JSUnresolvedVariable
            if (gameData.isElectron) {
                window.api.send('saveGame', btoa(JSON.stringify(gameSave)));
            } else {
                localStorage.setItem('save', btoa(JSON.stringify(gameSave)));
            }
            newInput(input);
        }
    }
});

function newInput(input) {
    const inputBox = $('#input-box');

    gameData.gameLog.addMessage('> ' + input, logTypes.PLAYER);

    const isNewTurn = InputHandler(input);
    const y = gameData.player.y;
    const x = gameData.player.x;

    if (!gameData.world.getRoom(y, x).isExplored) {
        gameData.gameLog.addMessage(gameData.world.getRoom(y, x).getRoomInfo(), logTypes.GAME);
    }

    if (isNewTurn) {
        for (const thing of gameData.world.getRoom(y, x).contents) {
            if (thing instanceof Monster) {
                if (thing.playerInteraction(gameData.player)) {
                    rpc.updateDead();
                    logMessage('--- GAME OVER ---', logTypes.SYSTEM);
                    logMessage(`Score: ${gameData.score}`, logTypes.SUCCESS);
                    logMessage('(Press R to restart)', logTypes.SYSTEM);
                    awaitingRestartKey = true;
                    inputBox.prop('disabled', true);
                    inputBox.attr('placeholder', 'Thanks for playing!');
                }
            }
        }
    }

    gameData.miniMap.update();

    console.log(gameData);
}