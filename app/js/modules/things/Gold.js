/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import {getRandInt, getRandomElement} from '../../game.js';
import Thing from './Thing.js';

/**
 * A piece of food in a room.
 */
export default class Gold extends Thing {
    constructor() {
        super();
        this.amount = this.generateGold();
        this.isVisible = true;
        this.name = this.generateName();
        this.isGrabbable = true;
    }
    getDescription() {
        return `${this.name.toLowerCase()}.`;
    }

    /**
     * Generates a random food name.
     * @return {number} The name of the food
     */
    generateGold() {
        return getRandInt(10,80);
    }
    generateName() {
        return "gold";
    }
    getShortDescription() {
        return this.amount.toString() + " gold";
    }
    getDescription() {
        return `${this.amount} gold. Its illustrious sparkle brings you great joy.`;
    }
}

