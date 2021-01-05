// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const monsterTypes = {
    ZOMBIE: 'Zombie',
    SKELETON: 'Skeleton'
};

Object.freeze(monsterTypes);

class Monster {
    constructor(type) {
        this.type = type;
        this.hp = 5;
    }
}