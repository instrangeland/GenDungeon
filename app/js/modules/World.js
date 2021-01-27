/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import Room from './Room.js';

/**
 * A world in which a game takes place.
 */
export default class World {
    constructor() {
        this.contents = {};
        this.addRoom(0, 0);
    }

    /**
     * Adds a room at a given coordinate pair.
     * @param {number} y The y-coordinate
     * @param {number} x The x-coordinate
     */
    addRoom(y, x) {
        if (!this.contents[y]) {
            this.contents[y] = {};
        }
        if (!this.contents[y][x]) {
            this.contents[y][x] = new Room(y, x);
        }
    }

    /**
     * Gets a room at a given coordinate pair.
     * @param {number} y The y-coordinate
     * @param {number} x The x-coordinate
     * @return {undefined|Room} The room
     */
    getRoom(y, x) {
        if (!this.contents[y]) {
            this.addRoom(y, x);
        }
        if (!this.contents[y][x]) {
            this.addRoom(y, x);
        }
        return this.contents[y][x];
    }
}