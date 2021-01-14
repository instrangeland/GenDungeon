// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

let question = '';

/**
 * Handles user input
 * @param {string} input The user input
 */
function handleInput(input) {
    let inputArray = input.trim().toLowerCase().split(' ');

    const player = gameData.player;
    const room = gameData.map[player.y][player.x];

    inputArray = inputArray.filter(word => !'a,an,the'.split(',').includes(word));
    if (!inputArray.length) {
        logMessage('Unknown command.', logTypes.ALERT);
        return;
    }

    /* go */
    inputArray = inputArray.filter(word => !'go,move,run,sprint,walk,dash,slide'.split(',').includes(word));
    if (!inputArray.length) {
        logMessage('Where do you want to go?', logTypes.GAME);
        return;
    }

    /* help */
    if (command('help,what,?', inputArray, () => {
        logMessage(`Hello! You are playing a text adventure. You can type commands like "attack zombie" to do things.
            Here are some useful commands to help you out:

            north, south, east, west
            attack [something]
            take [something]
            use [something]
            
            There are lots of other things you can do, try to experiment!`, logTypes.GAME);
    })) return;

    /* info */
    if (command('info,me,myself,i,player,user,information,hp,stats,health', inputArray, () => {
        logMessage(`You currently have ${player.hp} HP.`, logTypes.GAME);
    })) return;

    /* north */
    if (command('north,n,northward,northern,up,upward,upwards', inputArray, () => {
        logMessage('You move north.', logTypes.MOVEMENT);
        player.y++;
    })) return;

    /* south */
    if (command('south,s,southward,southern,down,downward,downwards', inputArray, () => {
        logMessage('You move south.', logTypes.MOVEMENT);
        player.y--;
    })) return;

    /* east */
    if (command('east,e,eastward,eastern,right', inputArray, () => {
        logMessage('You move east.', logTypes.MOVEMENT);
        player.x++;
    })) return;

    /* west */
    if (command('west,w,westward,western,left', inputArray, () => {
        logMessage('You move west.', logTypes.MOVEMENT);
        player.x--;
    })) return;

    const lookAliases = 'look,l,search,inspect,view,see,observe';
    const lookAtAliases = 'at,around,towards,for';

    /* look */
    if (command(lookAliases, inputArray, () => {
        logMessage(room.getInfo(player), logTypes.GAME);
    })) return;

    /* look around */
    if (command(`${lookAliases} around`, inputArray, () => {
        logMessage(room.getInfo(player), logTypes.GAME);
    })) return;

    /* look at room */
    if (command(`${lookAliases} ${lookAtAliases} room,here`, inputArray, () => {
        logMessage(room.getInfo(player), logTypes.GAME);
        question = 'look';
    })) return;

    /* look at */
    if (command(`${lookAliases} ${lookAtAliases}`, inputArray, () => {
        logMessage('What do you want to look at?', logTypes.GAME);
        logMessage('(Try: look at thing)', logTypes.ALERT);
        question = 'look';
    })) return;

    /* look [#] */
    if (command(`${lookAliases} #`, inputArray, args => {
        logMessage(room.getMonsterInfo(args[0]), logTypes.GAME);
    })) return;

    /* look at [#] */
    if (command(`${lookAliases} ${lookAtAliases} #`, inputArray, args => {
        logMessage(room.getMonsterInfo(args[0]), logTypes.GAME);
    })) return;

    const attackAliases = 'attack,h,hit,punch,kick,whack,yeet,hurt,damage,smack,kill,murder,slaughter,slap,bite,shoot,stab,pwn,destroy,obliterate';

    /* attack */
    if (command(attackAliases, inputArray, () => {
        logMessage('What do you want to attack?', logTypes.GAME);
        logMessage('(Try: attack thing)', logTypes.ALERT);
        question = 'attack';
    })) return;

    /* attack [#] */
    if (command(`${attackAliases} #`, inputArray, args => {
        logMessage(room.playerAttacksMonster(args[0], player), logTypes.COMBAT);
    })) return;

    /* credits */
    if (command('credit,credits,proceduralta,julian,author,about', inputArray, () => {
        logMessage(`ProceduralTA is an open source text adventure.
        https://github.com/jlachniet/ProceduralTA`, logTypes.GAME);
    })) return;

    const inputJoined = inputArray.join(' ');
    const monster = room.getMonster(inputJoined);

    /* [#] */

    if (question === 'look') {
        logMessage(room.getMonsterInfo(inputJoined), logTypes.GAME);
    } else if (question === 'attack') {
        logMessage(room.playerAttacksMonster(inputJoined, player), logTypes.COMBAT);
    } else {
        if (monster) {
            logMessage(room.getMonsterInfo(inputJoined), logTypes.GAME);
        } else {
            logMessage('Unknown command.', logTypes.ALERT);
        }
    }

    question = '';
}