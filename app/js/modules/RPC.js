// ProceduralTA is licensed under GNU General Public License v3.0.

import {gameData} from '../ProceduralTA.js';

/**
 * A handler for Discord Rich Presence state changes.
 * @module RPC
 * @class
 */
export default class RPC {
    /**
     * Update the status to show the player moving to a room.
     * @param roomDescription A description of the room
     */
    static updateRoom(roomDescription) {
        if (gameData.isElectron) {
            window.api.send('drpc', `Exploring ${roomDescription.toLowerCase()}.`);
        }
    }

    /**
     * Update the status to show the player attacking a monster.
     * @param monsterName The name of the monster
     */
    static updateAttack(monsterName) {
        if (gameData.isElectron) {
            window.api.send('drpc', `Attacking a ${monsterName.toLowerCase()}.`);
        }
    }

    /**
     * Update the status to show the player killing a monster.
     * @param monsterName The name of the monster
     */
    static updateKilled(monsterName) {
        if (gameData.isElectron) {
            window.api.send('drpc', `Killing a ${monsterName.toLowerCase()}.`);
        }
    }

    /**
     * Update the status to show the player taking a thing.
     * @param thingName The name of the thing
     */
    static updateTake(thingName) {
        if (gameData.isElectron) {
            window.api.send('drpc', `Taking a ${thingName.toLowerCase()}.`);
        }
    }

    /**
     * Update the status to show the player dying.
     */
    static updateDead() {
        if (gameData.isElectron) {
            window.api.send('drpc', 'Dead. 😢');
        }
    }
}
