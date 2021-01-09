// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

/**
 * Handles user input
 * @param {string} input The user input
 * @return {string|string[]} The response to the input
 */
function handleInput(input) {
    let inputArray = input.trim().toLowerCase().split(' ');

    inputArray = inputArray.filter(word => word !== 'a')
        .filter(word => word !== 'an')
        .filter(word => word !== 'the');

    const player = gameData.player;
    const room = gameData.map[player.y][player.x];

    nextWord('go');

    if (nextWord('north')) {
        player.y++;
        return 'You move north.';
    }
    if (nextWord('south')) {
        player.y--;
        return 'You move south.';
    }
    if (nextWord('east')) {
        player.x++;
        return 'You move east.';
    }
    if (nextWord('west')) {
        player.x--;
        return 'You move west.';
    }

    if (nextWord('look')) {
        if (nextWord('around') || !remainingWords()) {
            return room.getInfo(player);
        }
        if (nextWord('at') && !remainingWords()) {
            return ['What do you want to look at?', '(Try: look at thing)'];
        }
        const thing = room.getMonster(remainingWords());
        if (thing) {
            return `You are looking at: ${thing.species}.`;
        }
        return 'That doesn\'t exist here.';
    }

    if (nextWord('attack')) {
        if (!remainingWords()) {
            return ['What do you want to attack?', '(Try: attack thing)'];
        }
        const monster = room.getMonster(remainingWords());
        if (monster) {
            if (playerAttacksMonster(player, monster, player.strength)) {
                return `You did 1 damage, taking its HP down to ${monster.hp}.`;
            }
            room.removeMonster(remainingWords());
            return `You did 1 damage. The ${monster.species.toLowerCase()} is now dead.`;
        }
        return 'That doesn\'t exist here.';
    }

    const thing = room.getMonster(remainingWords());
    if (thing) {
        return `You are looking at: ${thing.species}.`;
    }

    return null;

    /**
     * Checks whether a given words matches the next word in the input, and removes it if it does.
     * @param {string} match The word to compare against
     * @return {boolean} Whether the words match
     */
    function nextWord(match) {
        const word = inputArray[0];
        if (word === match) {
            inputArray.shift();
        }
        return word === match;
    }

    /**
     * Gets all remaining words in the input.
     * @return {string} The remaining words
     */
    function remainingWords() {
        return inputArray.join(' ');
    }
}