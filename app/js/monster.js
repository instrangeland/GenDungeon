// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const monsterSpecies = {
    ZOMBIE: 'Zombie',
    SKELETON: 'Skeleton'
};

Object.freeze(monsterSpecies);

class Monster {
    constructor(species) {
        this.species = species;
        this.hp = 2;
        this.strength = 1;
    }
}