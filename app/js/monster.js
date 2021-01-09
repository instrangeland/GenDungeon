// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const monsterSpecies = {
    ZOMBIE: 'Zombie',
    SKELETON: 'Skeleton'
};

/**
 * A monster in a room.
 * @class
 */
class Monster {
    /**
     * Creates a monster.
     * @param species The species of the monster
     */
    constructor(species) {
        this.species = species;
        this.hp = 2;
        this.strength = 1;
    }
}