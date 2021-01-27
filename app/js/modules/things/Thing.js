/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

/**
 * A thing in a room.
 */
export default class Thing {
    constructor(name) {
        this.name = name;
        this.isVisible = false;
    }

    /**
     * Gets a description of the thing.
     * @return {string} The description
     */
    getDescription() {
        return `A ${this.name.toLowerCase()}.`;
    }

    /**
     * Gets a short formatted description of the thing for use in "look".
     * @return {string} The short description
     */
    getShortDescription() {
        return this.name;
    }
}
