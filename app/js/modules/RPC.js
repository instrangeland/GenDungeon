/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import {isElectron} from '../game.js';

/**
 * A handler for Discord Rich Presence state changes.
 */
export default class RPC {
    /**
     * Update the status to show the player moving to a room.
     * @param {string} roomDescription A description of the room
     */
    static updateRoom(roomDescription) {
        if (isElectron) {
            window.api.send('drpc', `Exploring ${roomDescription.toLowerCase()}.`);
        }
    }

    /**
     * Update the status to show the player attacking a monster.
     * @param {string} monsterName The name of the monster
     */
    static updateAttack(monsterName) {
        if (isElectron) {
            window.api.send('drpc', `Attacking a ${monsterName.toLowerCase()}.`);
        }
    }

    /**
     * Update the status to show the player killing a monster.
     * @param {string} monsterName The name of the monster
     */
    static updateKilled(monsterName) {
        if (isElectron) {
            window.api.send('drpc', `Killing a ${monsterName.toLowerCase()}.`);
        }
    }

    /**
     * Update the status to show the player taking a thing.
     * @param {string} thingName The name of the thing
     */
    static updateTake(thingName) {
        if (isElectron) {
            window.api.send('drpc', `Taking a ${thingName.toLowerCase()}.`);
        }
    }

    /**
     * Update the status to show the player dying.
     */
    static updateDead() {
        if (isElectron) {
            window.api.send('drpc', 'Dead. 😢');
        }
    }
}
