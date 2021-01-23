// ProceduralTA is licensed under GNU General Public License v3.0.

import {gameData} from "../ProceduralTA.js";
import {Monster} from "./things/Monster.js";
import {Food} from "./things/Food.js";

/**
 * A minimap in the corner of the game.
 * @module MiniMap
 * @class
 */
export class MiniMap {
    constructor() {
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
    update() {
        $("td")
            .removeClass('danger')
            .removeClass('explored')
            .removeClass('origin')
            .removeClass('player')
            .removeClass('void');

        for (let y = gameData.player.y - this.dimension; y <= gameData.player.y + this.dimension; y++) {
            for (let x = gameData.player.x - this.dimension; x <= gameData.player.x + this.dimension; x++) {
                const room = gameData.world.getRoom(y, x);
                const box = $(`.${y - gameData.player.y}_${x - gameData.player.x}`);
                if (room.isExplored) {
                    if (y === gameData.player.y && x === gameData.player.x) {
                        box.addClass('player');
                    } else if (y === 0 && x === 0) {
                        box.addClass('origin');
                    } else if (!room.isActive) {
                        box.addClass('void');
                    } else if (room.contents.filter(
                        thing => thing instanceof Monster || thing instanceof Food
                    ).length > 0) {
                        box.addClass('danger');
                    } else {
                        box.addClass('explored');
                    }
                }
            }
        }
    }
}