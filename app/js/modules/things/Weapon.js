// ProceduralTA is licensed under GNU General Public License v3.0.

import {getRandInt, getRandomElement} from '../../app.js';
import {Thing} from './Thing.js';

/**
 * A weapon in a room.
 * @module Armor
 * @class
 */
export class Weapon extends Thing {
    constructor() {
        super();
        this.name = this.generateName();
        this.isListed = true;
        this.strengthBoost = getRandInt(1, 2) - 0.5;
    }

    /**
     * Generates a random weapon name.
     * @return {string}
     */
    generateName() {
        const weapons = [
            'Sword',
            'Bow'
        ];

        return getRandomElement(weapons);
    }
}