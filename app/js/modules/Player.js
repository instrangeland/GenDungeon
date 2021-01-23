// ProceduralTA is licensed under GNU General Public License v3.0.

import {gameData, logMessage} from '../ProceduralTA.js';
import {logTypes} from './GameLog.js';
import rpc from './RPC.js';

/**
 * A playable character.
 * @module Player
 * @class
 */
export class Player {
    constructor() {
        this.x = 0;
        this.y = 0;
        this.hp = 10;
        this.strength = 2;

        this.previousY = null;
        this.previousX = null;
    }

    /**
     * Tries to move a player by a certain offset.
     * @param {number} yOffset The y-offset
     * @param {number} xOffset The x-offset
     * @param {string} directionName
     * @return {boolean} Whether the player moved
     */
    move(yOffset, xOffset, directionName) {
        if (gameData.world.getRoom(this.y + yOffset, this.x + xOffset).isActive) {
            this.previousY = this.y;
            this.previousX = this.x;
            this.y += yOffset;
            this.x += xOffset;
            rpc.updateRoom(gameData.world.getRoom(this.y, this.x).description);
            logMessage(`You go ${directionName}.`, logTypes.MOVEMENT);
            return true;
        }
        logMessage(`You can't go ${directionName}, there's a wall there.`, logTypes.ALERT);
        return false;
    }

    /**
     * Tries to move the player to the previous location.
     * @return {boolean} Whether the player moved
     */
    moveBack() {
        if (this.previousX === null) {
            logMessage('You can\'t go back right now.', logTypes.ALERT);
            return false;
        }
        this.y = this.previousY;
        this.x = this.previousX;
        this.previousY = null;
        this.previousX = null;
        logMessage('You go back to the previous room.', logTypes.MOVEMENT);
        return true;
    }
}