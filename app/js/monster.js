// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const monsterSpecies = {
    ZOMBIE: 'Zombie',
    SKELETON: 'Skeleton'
};

Object.freeze(monsterSpecies);

class Monster {
    constructor(type) {
        this.species = type;
        this.hp = 2;
    }
}