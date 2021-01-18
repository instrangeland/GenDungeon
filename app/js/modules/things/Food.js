// ProceduralTA is licensed under GNU General Public License v3.0.

import {getRandomElement, getRandInt} from "../../ProceduralTA.js";
import {Thing} from './Thing.js';

/**
 * A piece of food in a room.
 * @module Food
 * @class
 */
export class Food extends Thing {
    constructor() {
        super();
        this.name = this.generateName();
        this.healing = getRandInt(1, 4);
    }

    /**
     * Generates a random food name.
     * @return {string}
     */
    generateName() {
        const foods = [
            'Apple',
            'Orange',
            'Banana'
        ];

        return getRandomElement(foods);
    }

    /**
     * Gets a description of the food.
     * @return {string}
     */
    getDescription() {
        return `A ${this.name.toLowerCase()}.`;
    }

    /**
     * Gets a short formatted description of the food for use in "look".
     * @return {string}
     */
    getShortDescription() {
        return this.name;
    }
}