// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

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

    inputArray = inputArray.filter(word => !'go,move,run,sprint,walk,dash,slide'.split(',').includes(word));
    if (!inputArray.length) {
        logMessage('Where do you want to go?', logTypes.GAME);
        return;
    }

    if (command('help,what,?', inputArray, () => {
        logMessage(`Hello! You are playing a text adventure. You can type commands like "attack zombie" to do things.
            Here are some useful commands to help you out:

            north, south, east, west
            attack [something]
            take [something]
            use [something]
            
            There are lots of other things you can do, try to experiment!`, logTypes.GAME);
    })) return;

    if (command('info,me,myself,i,player,user,information,hp,stats,health', inputArray, () => {
        logMessage(`You currently have ${player.hp} HP.`, logTypes.GAME);
    })) return;

    if (command('north,n,northward,northern,up,upward,upwards', inputArray, () => {
        logMessage('You move north.', logTypes.GAME);
        player.y++;
    })) return;

    if (command('south,s,southward,southern,down,downward,downwards', inputArray, () => {
        logMessage('You move south.', logTypes.GAME);
        player.y--;
    })) return;

    if (command('east,e,eastward,eastern,right', inputArray, () => {
        logMessage('You move east.', logTypes.GAME);
        player.x++;
    })) return;

    if (command('west,w,westward,western,left', inputArray, () => {
        logMessage('You move west.', logTypes.GAME);
        player.x--;
    })) return;

    const lookAliases = 'look,l,search,inspect,view,see,observe';
    const lookAtAliases = 'at,around,towards,for';

    if (command(lookAliases, inputArray, () => {
        logMessage(room.getInfo(player), logTypes.GAME);
    })) return;

    if (command(`${lookAliases} ${lookAtAliases}`, inputArray, () => {
        logMessage('What do you want to look at?', logTypes.GAME);
        logMessage('(Try: look at thing)', logTypes.ALERT);
    })) return;

    if (command(`${lookAliases} #`, inputArray, args => {
        logMessage(room.getMonsterInfo(args[0]), logTypes.GAME);
    })) return;

    if (command(`${lookAliases} ${lookAtAliases} #`, inputArray, args => {
        logMessage(room.getMonsterInfo(args[0]), logTypes.GAME);
    })) return;

    const attackAliases = 'attack,h,hit,punch,kick,whack,yeet,hurt,damage,smack,kill,murder,slaughter,slap,bite,shoot,stab,pwn,destroy,obliterate';

    if (command(attackAliases, inputArray, () => {
        logMessage('What do you want to attack?', logTypes.GAME);
        logMessage('(Try: attack thing)', logTypes.ALERT);
    })) return;

    console.log(`${attackAliases} #`);

    if (command(`${attackAliases} #`, inputArray, args => {
        logMessage(room.playerAttacksMonster(args[0], player), logTypes.COMBAT);
    })) return;

    if (command('credit,credits,proceduralta,julian,author,about', inputArray, () => {
        logMessage(`ProceduralTA is an open source text adventure.
        https://github.com/jlachniet/ProceduralTA`, logTypes.GAME);
    })) return;

    const species = inputArray.join(' ');
    const monster = room.getMonster(species);

    if (monster) {
        logMessage(room.getMonsterInfo(species), logTypes.GAME);
    } else {
        logMessage('Unknown command.', logTypes.ALERT);
    }
}