/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import Thing from './Thing.js';
import {getRandomElement} from '../../game.js';

// noinspection JSUnfilteredForInLoop
export default class Armor extends Thing {

    constructor() {
        super();
        let armor = this.pickRandomNewArmor();
        if (armor) {
            this.name = armor.name;
            this.defense = armor.defense;
            this.isVisible = true;
        }
    }


    pickRandomNewArmor() {
        let availableArmors = [];
        for (const armorIndex in ARMORS) {
            if (!hasArmorBeenGenerated[ARMORS[armorIndex].name]) {
                availableArmors.push(ARMORS[armorIndex]);
            }
        }
        if (availableArmors.length > 0) {
            return getRandomElement(availableArmors);
        }
        return undefined;
    }

    static getDefenseByName(name) {
        return ARMORS.find(armor => armor.name === name).defense;
    }
}

export const hasArmorBeenGenerated = {
    "Helmet": false,
    "Bucker": false,
    "Shield": false,
    "Gauntlet": false,
    "Amulet": false,
    "Boots": false
}

export const ARMORS =
    [
        {
            "name": "Helmet",
            "defense": 3
        },
        {
            "name": "Shield",
            "defense": 4
        },
        {
            "name": "Gauntlet",
            "defense": 2
        },
        {
            "name": "Amulet",
            "defense": 2
        },
        {
            "name": "Boots",
            "defense": 1
        },
    ]
