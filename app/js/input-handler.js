// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

/*

Shorthand commands:

n, e, s, w = Directional movement
h = Attack (hit)
l = Look

 */

/**
 * Handles user input
 * @param {string} input The user input
 */
function handleInput(input) {
    let inputArray = input.trim().toLowerCase().split(' ');

    inputArray = inputArray.filter(word => word !== 'a')
        .filter(word => word !== 'an')
        .filter(word => word !== 'the');

    const player = gameData.player;
    const room = gameData.map[player.y][player.x];

    nextWord('go,move,run,sprint,walk,dash,slide'); // Remove if first word
    if (!remainingWords()) {
        logMessage('Where do you want to go?', logTypes.GAME);
        return;
    }

    if (nextWord('help,?,what')) {
        logMessage(`Hello! You are playing a text adventure. You can type commands like "attack zombie" to do things.
            Here are some useful commands to help you out:

            north, south, east, west
            attack [something]
            take [something]
            use [something]
            
            There are lots of other things you can do, try to experiment!`, logTypes.GAME);
        return;
    }

    if (nextWord('info,me,myself,i,player,user,information,hp,stats,health')) {
        logMessage(`You currently have ${player.hp} HP.`, logTypes.GAME);
        return;
    }

    if (nextWord('north,n,northward,northern,up,upward,upwards')) {
        player.y++;
        logMessage('You move north.', logTypes.GAME);
        return;
    }
    if (nextWord('south,s,southward,southern,down,downward,downwards')) {
        player.y--;
        logMessage('You move south.', logTypes.GAME);
        return;
    }
    if (nextWord('east,e,eastward,eastern,right')) {
        player.x++;
        logMessage('You move east.', logTypes.GAME);
        return;
    }
    if (nextWord('west,w,westward,western,left')) {
        player.x--;
        logMessage('You move west.', logTypes.GAME);
        return;
    }

    if (nextWord('look,l,search,inspect,view,see,observe')) {
        if (nextWord('around,here,room') || !remainingWords()) {
            logMessage(room.getInfo(player), logTypes.GAME);
            return;
        }
        if (nextWord('at,toward,towards,for') && !remainingWords()) {
            logMessage('What do you want to look at?', logTypes.GAME);
            logMessage('(Try: look at thing)', logTypes.ALERT);
            return;
        }
        const thing = room.getMonster(remainingWords());
        if (thing) {
            logMessage(thing.getInfo(), logTypes.GAME);
            return;
        }
        logMessage('That doesn\'t exist here.', logTypes.GAME);
        return;
    }

    if (nextWord('attack,h,hit,punch,kick,whack,yeet,hurt,damage,smack,kill,murder,slaughter,slap,bite,shoot,stab,pwn,destroy,obliterate')) {
        if (!remainingWords()) {
            logMessage('What do you want to attack?', logTypes.GAME);
            logMessage('(Try: attack thing)', logTypes.ALERT);
            return;
        }
        const monster = room.getMonster(remainingWords());
        if (monster) {
            if (playerAttacksMonster(player, monster, player.strength)) {
                logMessage(`You attack the ${monster.species.toLowerCase()} for ${player.strength} damage, taking its HP down to ${monster.hp}.`, logTypes.GAME);
                return;
            }
            room.removeMonster(remainingWords());
            logMessage(`You attack the ${monster.species.toLowerCase()} for ${player.strength} damage, killing it.`, logTypes.GAME);
            return;
        }
        logMessage('That doesn\'t exist here.', logTypes.GAME);
        return;
    }

    if (nextWord('take,grab,get')) {
        if (room.getMonster(remainingWords())) {
            logMessage('You can\'t take that.', logTypes.GAME);
            return;
        }
        logMessage('That doesn\'t exist here.', logTypes.GAME);
        return;
    }

    if (nextWord('use,eat,drink,consume,taste')) {
        logMessage('That you don\'t have that.', logTypes.GAME);
        return;
    }

    if (nextWord('credit,credits,proceduralta,julian,author,about')) {
        logMessage(`ProceduralTA is an open source text adventure.
        https://github.com/jlachniet/ProceduralTA`, logTypes.GAME);
        return;
    }

    const thing = room.getMonster(remainingWords());
    if (thing) {
        logMessage(thing.getInfo(), logTypes.GAME);
        return;
    }

    logMessage('Unknown command.', logTypes.ALERT);

    /**
     * Checks whether given word(s) matches the next word in the input, and remove them if it does.
     * @param {string} match The word(s) to compare against, separated by commas
     * @return {boolean} Whether the word(s) match
     */
    function nextWord(match) {
        if (match.split(',').includes(inputArray[0])) {
            inputArray.shift();
            return true;
        }
        return false;
    }

    /**
     * Gets all remaining words in the input.
     * @return {string} The remaining words
     */
    function remainingWords() {
        return inputArray.join(' ');
    }
}