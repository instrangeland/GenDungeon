// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

class Room {
    constructor() {
        this.monsters = [];
    }

    addMonster(name, hp) {
        this.monsters.push({
            name: name,
            hp: hp
        });
    }

    printMonsters() {
        let monsterDescriptions = '';
        for (const [index, monster] of this.monsters.entries()) {
            monsterDescriptions += `\n${(index + 1)}) ${monster.name} - ${monster.hp} HP`;
        }
        return monsterDescriptions;
    }

    printObject(name) {
        for (const monster of this.monsters) {
            if (monster.name.toLowerCase() === name) {
                return 'You are looking at: ' + monster.name;
            }
        }
        return false;
    }
}