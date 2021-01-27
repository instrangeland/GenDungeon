/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import {getRandInt, getRandomElement} from '../../game.js';
import Thing from './Thing.js';

/**
 * A piece of food in a room.
 */
export default class Food extends Thing {
    constructor() {
        super();
        this.name = this.generateName();
        this.isVisible = true;
        this.healing = getRandInt(1, 4);
    }

    /**
     * Generates a random food name.
     * @return {string} The name of the food
     */
    generateName() {
        const foods = [
            'Apple',
            'Orange',
            'Banana'
        ];

        return getRandomElement(foods);
    }
}