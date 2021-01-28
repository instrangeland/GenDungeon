/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import game from '../game.js';
import {GameLog, logTypes} from './GameLog.js';
import RPC from './RPC.js';

/**
 * A playable character.
 */
export default class Player {
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
        if (game.world.getRoom(this.y + yOffset, this.x + xOffset).isActive) {
            this.previousY = this.y;
            this.previousX = this.x;
            this.y += yOffset;
            this.x += xOffset;
            RPC.updateRoom(game.world.getRoom(this.y, this.x).description);
            GameLog.addMessage(`You go ${directionName}.`, logTypes.MOVEMENT);
            return true;
        }
        GameLog.addMessage(`You can't go ${directionName}, there's a wall there.`, logTypes.ALERT);
        return false;
    }

    /**
     * Tries to move the player to the previous location.
     * @return {boolean} Whether the player moved
     */
    moveBack() {
        if (this.previousX === null) {
            GameLog.addMessage('You can\'t go back right now.', logTypes.ALERT);
            return false;
        }
        this.y = this.previousY;
        this.x = this.previousX;
        this.previousY = null;
        this.previousX = null;
        GameLog.addMessage('You go back to the previous room.', logTypes.MOVEMENT);
        return true;
    }
}