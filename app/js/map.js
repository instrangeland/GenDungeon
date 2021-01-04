// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

class GameMap {
    constructor() {
        this.addRoom(0, 0);
    }

    addRoom(y, x) {
        if (!this[y]) {
            this[y] = {};
        }
        if (!this[y][x]) {
            this[y][x] = new Room();
            this[y][x].addMonster('Zombie', 10);
            this[y][x].addMonster('Skeleton', 5);
        }
    }
}