// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const map = {};

/**
 * Creates a new room at given coordinates
 * @param {Number} x The x coordinate
 * @param {Number} y The y coordinate
 */
function newRoom(x, y) {
    // If the x coordinate doesn't exist yet in the map, create it
    if (!map[x])
        map[x] = {};

    // Create the room
    map[x][y] = {
        monsters: []
    };

    // Add monsters to the room
    map[x][y].monsters.push({
        name: 'Zombie',
        hp: 10
    });
    map[x][y].monsters.push({
        name: 'Skeleton',
        hp: 5
    });
}

/**
 * Prints information about the monsters in a room
 * @param {Object} room The room to check
 * @returns {string} A formatted string listing the monsters in the room
 */
function getMonsters(room) {
    let monsterDescriptions = '';

    // For each monster, append a description to the string
    for (const [index, monster] of room.monsters.entries())
        monsterDescriptions += '\n' + (index + 1) + ') ' + monster.name + ' - ' + monster.hp + ' HP';

    return monsterDescriptions;
}

/**
 * Prints information about a given object
 * @param room The room to check for the object
 * @param name The name of the object
 * @returns {(string|boolean)} A formatted string of the object if it exists, or false if it doesn't
 */
function getObject(room, name) {
    for (const monster of room.monsters)
        if (monster.name.toLowerCase() === name)
            return 'You are looking at: ' + monster.name;
    return false;
}

// Create starting room
newRoom(0, 0);