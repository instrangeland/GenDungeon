// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const minimapTable = $('#minimap');

$(() => {
    for (let y = 4; y >= -4; y--) {
        minimapTable.append(`<tr></tr>`);
        for (let x = -4; x <= 4; x++) {
            if (y === 0 && x === 0) {
                minimapTable.children().last().append(`<td class="0_0 player"></td>`)
            } else {
                minimapTable.children().last().append(`<td class="${y}_${x}"></td>`);
            }
        }
    }
});

/**
 * A minimap in the UI.
 * @class
 */
class Minimap {
    /**
     * Updates a minimap
     */
    update() {
        $("td")
            .removeClass('danger')
            .removeClass('explored')
            .removeClass('origin')
            .removeClass('player');

        for (let y = gameData.player.y - 4; y <= gameData.player.y + 4; y++) {
            for (let x = gameData.player.x - 4; x <= gameData.player.x + 4; x++) {
                const room = gameData.map.getRoom(y, x);
                const box = $(`.${y - gameData.player.y}_${x - gameData.player.x}`);
                if (room) {
                    if (y === gameData.player.y && x === gameData.player.x) {
                        box.addClass('player');
                    } else if (y === 0 && x === 0) {
                        box.addClass('origin');
                    } else if (room.monsters.length > 0) {
                        box.addClass('danger');
                    } else {
                        box.addClass('explored');
                    }
                }
            }
        }
    }
}