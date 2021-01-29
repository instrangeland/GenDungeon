/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import game from '../game.js';
import {GameLog, logTypes} from './GameLog.js';
import RPC from './RPC.js';
import Armor, {ARMORS, hasArmorBeenGenerated} from './things/Armor.js';
import {ARMOR_CHANCE} from "./Values.js";

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


        this.playerHasArmorType = {
            "Helmet": false,
            "Bucker": false,
            "Shield": false,
            "Gauntlet": false,
            "Amulet": false,
            "Boots": false
        }
    }

    /**
     * Tries to move a player by a certain offset.
     * @param {number} yOffset The y-offset
     * @param {number} xOffset The x-offset
     * @param {string} directionName
     * @return {boolean} Whether the player moved
     */
    move(yOffset, xOffset, directionName) {
        let roomToMoveTo = game.world.getRoom(this.y + yOffset, this.x + xOffset);
        if (roomToMoveTo.isActive) {
            if (!roomToMoveTo.isExplored) {
                if (game.seed.quick() > ARMOR_CHANCE) {
                    let armor = new Armor();
                    if (armor.name) {
                        roomToMoveTo.contents.push(armor);
                        hasArmorBeenGenerated[armor.name] = true;
                    }
                }
            }
            this.previousY = this.y;
            this.previousX = this.x;
            this.y += yOffset;
            this.x += xOffset;
            RPC.updateRoom(game.world.getRoom(this.y, this.x).description);
            GameLog.addMessage(`You go ${directionName}.`, logTypes.MOVEMENT);
            if (roomToMoveTo.distance > game.score["distance"]) {
                game.score["distance"] = roomToMoveTo.distance;
            }
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

    hasArmor() {
        for (const armor in this.playerHasArmorType) {
            if (!this.playerHasArmorType.hasOwnProperty(armor)) continue;
            if (this.playerHasArmorType[armor]) {
                return true;
            }
        }
        return false;
    }

    getTotalDefense() {
        let total = 0;
        for (const armor in this.playerHasArmorType) {
            if (!this.playerHasArmorType.hasOwnProperty(armor)) continue;
            if (this.playerHasArmorType[armor]) {
                total += ARMORS.find(anArmor => anArmor.name === armor).defense;
            }
        }
        return total;
    }
}