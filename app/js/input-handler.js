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
 * @return {string|string[]} The response to the input
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
        return 'Where do you want to go?';
    }

    if (nextWord('help,?,what')) {
        return `Hello! You are playing a text adventure. You can type commands like "attack zombie" to do things.
            Here are some useful commands to help you out:

            north, south, east, west
            attack [something]
            take [something]
            use [something]
            
            There are lots of other things you can do, try to experiment!`;
    }

    if (nextWord('info,me,myself,i,player,user,information,hp,stats,health')) {
        return `You currently have ${player.hp} HP.`;
    }

    if (nextWord('north,n,northward,northern,up,upward,upwards')) {
        player.y++;
        return 'You move north.';
    }
    if (nextWord('south,s,southward,southern,down,downward,downwards')) {
        player.y--;
        return 'You move south.';
    }
    if (nextWord('east,e,eastward,eastern,right')) {
        player.x++;
        return 'You move east.';
    }
    if (nextWord('west,w,westward,western,left')) {
        player.x--;
        return 'You move west.';
    }

    if (nextWord('look,l,search,inspect,view,see,observe')) {
        if (nextWord('around,here,room') || !remainingWords()) {
            return room.getInfo(player);
        }
        if (nextWord('at,toward,towards,for') && !remainingWords()) {
            return ['What do you want to look at?', '(Try: look at thing)'];
        }
        const thing = room.getMonster(remainingWords());
        if (thing) {
            return thing.getInfo();
        }
        return 'That doesn\'t exist here.';
    }

    if (nextWord('attack,h,hit,punch,kick,whack,yeet,hurt,damage,smack,kill,murder,slaughter,slap,bite,shoot,stab,pwn,destroy,obliterate')) {
        if (!remainingWords()) {
            return ['What do you want to attack?', '(Try: attack thing)'];
        }
        const monster = room.getMonster(remainingWords());
        if (monster) {
            if (playerAttacksMonster(player, monster, player.strength)) {
                return `You attack the ${monster.species.toLowerCase()} for ${player.strength} damage, taking its HP down to ${monster.hp}.`;
            }
            room.removeMonster(remainingWords());
            return `You attack the ${monster.species.toLowerCase()} for ${player.strength} damage, killing it.`;
        }
        return 'That doesn\'t exist here.';
    }

    if (nextWord('take,grab,get')) {
        if (room.getMonster(remainingWords())) {
            return 'You can\'t take that.';
        }
        return 'That doesn\'t exist here.';
    }

    if (nextWord('use,eat,drink,consume,taste')) {
        return 'That you don\'t have that.';
    }

    if (nextWord('credit,credits,proceduralta,julian,author,about')) {
        return `ProceduralTA is an open source text adventure.
        https://github.com/jlachniet/ProceduralTA`;
    }

    const thing = room.getMonster(remainingWords());
    if (thing) {
        return thing.getInfo();
    }

    return null;

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