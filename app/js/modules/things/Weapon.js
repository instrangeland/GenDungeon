// ProceduralTA is licensed under GNU General Public License v3.0.

import {getRandInt, getRandomElement} from '../../game.js';
import Thing from './Thing.js';

/**
 * A weapon in a room.
 */
export default class Weapon extends Thing {
    constructor() {
        super();
        this.name = this.generateName();
        this.isVisible = true;
        this.strengthBoost = getRandInt(1, 2) - 0.5;
    }

    /**
     * Generates a random weapon name.
     * @return {string} The weapon name
     */
    generateName() {
        const weapons = [
            'Sword',
            'Bow'
        ];

        return getRandomElement(weapons);
    }
}