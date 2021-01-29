/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import game from '../game.js';
import Monster from "./things/Monster.js";
import Food from "./things/Food.js";
import Weapon from "./things/Weapon.js";
import Armor from './things/Armor.js';

/**
 * A minimap in the corner of the game.
 */
export default class MiniMap {
    static init() {
        this.dimension = 4;

        for (let y = this.dimension; y >= -this.dimension; y--) {
            const minimapTable = $('#minimap');

            minimapTable.append(`<tr></tr>`);
            for (let x = -this.dimension; x <= this.dimension; x++) {
                if (y === 0 && x === 0) {
                    minimapTable.children().last().append(`<td class="0_0 player"></td>`);
                } else {
                    minimapTable.children().last().append(`<td class="${y}_${x}"></td>`);
                }
            }
        }
    }

    /**
     * Updates the minimap.
     */
    static update() {
        $('td')
            .removeClass('danger')
            .removeClass('explored')
            .removeClass('collectable')
            .removeClass('origin')
            .removeClass('player')
            .removeClass('void');

        for (let y = game.player.y - this.dimension; y <= game.player.y + this.dimension; y++) {
            for (let x = game.player.x - this.dimension; x <= game.player.x + this.dimension; x++) {
                const room = game.world.getRoom(y, x);
                const box = $(`.${y - game.player.y}_${x - game.player.x}`);
                if (room.isExplored) {
                    if (y === game.player.y && x === game.player.x) {
                        box.addClass('player');
                    } else if (y === 0 && x === 0) {
                        box.addClass('origin');
                    } else if (!room.isActive) {
                        box.addClass('void');
                    } else if (room.contents.filter(thing => thing instanceof Monster).length > 0) {
                        box.addClass('danger');
                    } else if (room.contents.filter(thing => thing instanceof Food
                        || thing instanceof Weapon
                        || thing instanceof Armor
                    ).length > 0) {
                        box.addClass('collectable');
                    } else {
                        box.addClass('explored');
                    }
                }
            }
        }
    }
}