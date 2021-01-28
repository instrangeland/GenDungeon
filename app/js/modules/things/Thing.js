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

    static getArticle(word) {
        let article = window.indefiniteArticle(word);
        return article.charAt(0).toUpperCase() + article.slice(1);
    }

    /**
     * Gets a description of the thing.
     * @return {string} The description
     */
    getDescription() {
        return `${Thing.getArticle(this.name)} ${this.name.toLowerCase()}.`;
    }

    /**
     * Gets a short formatted description of the thing for use in "look".
     * @return {string} The short description
     */
    getShortDescription() {
        return this.name;
    }
}
