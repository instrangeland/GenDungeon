// ProceduralTA is licensed under GNU General Public License v3.0.

import Room from './Room.js';

export default class World {
    constructor() {
        this.contents = {};
        this.addRoom(0, 0);
    }

    addRoom(y, x) {
        if (!this.contents[y]) {
            this.contents[y] = {};
        }
        if (!this.contents[y][x]) {
            this.contents[y][x] = new Room(y, x);
        }
    }

    getRoom(y, x) {
        if (!this.contents[y]) {
            return undefined;
        }
        return this.contents[y][x];
    }
}