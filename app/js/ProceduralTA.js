// ProceduralTA is licensed under GNU General Public License v3.0.

import {GameLog, logTypes} from './modules/GameLog.js';
import InputHandler from './modules/InputHandler.js';
import MiniMap from './modules/MiniMap.js';
import {Monster} from "./modules/Monster.js";
import Player from './modules/Player.js';
import World from './modules/World.js';

export const gameData = {};

gameData.isElectron = navigator.userAgent.indexOf('Electron') > -1;

gameData.gameLog = new GameLog();
gameData.miniMap = new MiniMap();
gameData.player = new Player();
gameData.world = new World();

export function logMessage(messageContent, messageType) {
    gameData.gameLog.addMessage(messageContent, messageType);
}

export function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

export function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

$('body').on('keydown', event => {
    const inputBox = $('#input-box');
    inputBox.focus();

    if (event.keyCode === 13) {
        const input = inputBox.val().trim().toLowerCase();
        inputBox.val('');

        if (input) {
            gameData.gameLog.addMessage('> ' + input, logTypes.PLAYER);

            const isNewTurn = InputHandler(input);
            const y = gameData.player.y;
            const x = gameData.player.x;

            if (!gameData.world.getRoom(y, x)) {
                gameData.world.addRoom(y, x);
                gameData.gameLog.addMessage(gameData.world.getRoom(y, x).getRoomInfo(), logTypes.GAME);
            }

            if (isNewTurn) {
                for (const thing of gameData.world.getRoom(y, x).contents) {
                    if (thing instanceof Monster) {
                        if (thing.playerInteraction(gameData.player)) {
                            logMessage('--- GAME OVER ---', logTypes.SYSTEM);
                            inputBox.prop('disabled', true);
                            inputBox.attr('placeholder', 'Thanks for playing!');
                        }
                    }
                }
            }

            gameData.miniMap.update();

            console.log(gameData);
        }
    }
});