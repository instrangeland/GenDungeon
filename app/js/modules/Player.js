// ProceduralTA is licensed under GNU General Public License v3.0.

import {gameData, logMessage} from "../ProceduralTA.js";
import {logTypes} from "./GameLog.js";

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
            this.y += yOffset;
            this.x += xOffset;
            logMessage(`You go ${directionName}.`, logTypes.MOVEMENT);
            return true;
        }
        logMessage(`You can't go ${directionName}, there's a wall there.`, logTypes.ALERT);
        return false;
    }
}