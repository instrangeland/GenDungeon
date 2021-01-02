'use strict';

let map = {};

function newRoom(x, y) {
    if (map[x] === undefined)
        map[x] = {};
    map[x][y] = {};
    map[x][y].monsters = [];

    // For now just create these same two monsters in every room
    let monster = {};
    monster.name = "Zombie";
    monster.hp = 10;
    map[x][y].monsters.push(monster);

    monster = {};
    monster.name = "Skeleton";
    monster.hp = 5;
    map[x][y].monsters.push(monster);
}

// Pretty print a list of monsters
function getMonsters(room) {
    let monsterDescriptions = '';
    for (const [index, monster] of room.monsters.entries())
        monsterDescriptions += '\n' + (index + 1) + ') ' + monster.name + ' - ' + monster.hp + ' HP';
    return monsterDescriptions;
}

// Pretty print an object description
function getObject(room, name) {
    for (const monster of room.monsters)
        if (monster.name.toLowerCase() === name)
            return 'You are looking at: ' + monster.name;
    return false;
}

// Create starting room
newRoom(0, 0);