/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import {getRandInt, getRandomElement} from '../../game.js';
import Thing from './Thing.js';

/**
 * A piece of food in a room.
 */
export default class Curiosity extends Thing {
    constructor(name, description, shortDescription) {
        super(name);
        this.shortDescription = shortDescription
        this.description = description
        this.isVisible = true;
    }

    /**
     * Generates a random food name.
     * @return {string} The name of the food
     */
    getDescription() {
        return this.description;
    }
    getShortDescription() {
        return this.shortDescription;
    }
}