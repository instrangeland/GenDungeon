// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

/**
 * A map in which the game takes place.
 * @class
 */
class GameMap {
    /**
     * Creates a map.
     */
    constructor() {
        this.addRoom(0, 0);
    }

    /**
     * Adds a room to the map.
     * @param {number} y The y-coordinate of the room
     * @param  {number}x The x-coordinate of the room
     * @return The map
     */
    addRoom(y, x) {
        if (!this[y]) {
            this[y] = {};
        }
        if (!this[y][x]) {
            this[y][x] = new Room();
            this[y][x].addMonster(monsterSpecies.ZOMBIE).addMonster(monsterSpecies.SKELETON);
        }
        return this;
    }
}