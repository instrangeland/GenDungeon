// ProceduralTA is licensed under GNU General Public License v3.0.

/**
 * A thing in a room.
 * @module Thing
 * @class
 */
export class Thing {
    constructor(name) {
        this.name = name;
    }

    /**
     * Gets a description of the thing.
     * @return {string}
     */
    getDescription() {
        return `A ${this.name.toLowerCase()}.`;
    }

    /**
     * Gets a short formatted description of the thing for use in "look".
     * @return {string}
     */
    getShortDescription() {
        return this.name;
    }
}
