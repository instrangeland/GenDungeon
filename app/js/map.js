// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

/**
 * The map of the game.
 */
class GameMap {
    constructor() {
        this.addRoom(0, 0);
    }

    /**
     * Adds a room to the map.
     * @param y {number}    the y-coordinate of the room
     * @param x {number}    the x-coordinate of the room
     */
    addRoom(y, x) {
        if (!this[y]) {
            this[y] = {};
        }
        if (!this[y][x]) {
            this[y][x] = new Room();
            this[y][x].addMonster(monsterSpecies.ZOMBIE);
            this[y][x].addMonster(monsterSpecies.SKELETON);
        }
    }
}