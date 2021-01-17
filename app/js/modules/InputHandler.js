// ProceduralTA is licensed under GNU General Public License v3.0.

import {logTypes} from './GameLog.js';
import {gameData, logMessage} from '../ProceduralTA.js';
import Verb from './Verb.js';

let question = '';

export default function InputHandler(input) {
    const player = gameData.player;
    const room = gameData.world.getRoom(player.y, player.x);
    let inputArray = input.split(' ');

    // the
    inputArray = inputArray.filter(word => !'a,an,the'.split(',').includes(word));
    if (!inputArray.length) {
        logMessage('Unknown command.', logTypes.ALERT);
        return false;
    }

    // go
    inputArray = inputArray.filter(word => !'go,move,run,sprint,walk,dash,slide'.split(',').includes(word));
    if (!inputArray.length) {
        logMessage('Where do you want to go?', logTypes.GAME);
        return false;
    }

    // help
    if (Verb('help,what,?', inputArray, () => {
        logMessage(`Hello! You are playing a text adventure. You can type commands like "attack zombie" to do things.
            Here are some useful commands to help you out:
            north, south, east, west
            attack [something]
            take [something]
            use [something]
            
            There are lots of other things you can do, try to experiment!`, logTypes.GAME);
    })) return false;

    // info
    if (Verb('info,me,myself,i,player,user,information,hp,stats,health', inputArray, () => {
        logMessage(`You currently have ${player.hp} HP.`, logTypes.GAME);
    })) return false;

    // north
    if (Verb('north,n,northward,northern,up,upward,upwards', inputArray, () => {
        logMessage('You move north.', logTypes.MOVEMENT);
        player.y++;
    })) return true;

    // south
    if (Verb('south,s,southward,southern,down,downward,downwards', inputArray, () => {
        logMessage('You move south.', logTypes.MOVEMENT);
        player.y--;
    })) return true;

    // east
    if (Verb('east,e,eastward,eastern,right', inputArray, () => {
        logMessage('You move east.', logTypes.MOVEMENT);
        player.x++;
    })) return true;

    // west
    if (Verb('west,w,westward,western,left', inputArray, () => {
        logMessage('You move west.', logTypes.MOVEMENT);
        player.x--;
    })) return true;

    const lookAliases = 'look,l,search,inspect,view,see,observe';
    const lookAtAliases = 'at,around,towards,for';

    // look
    if (Verb(lookAliases, inputArray, () => {
        logMessage(room.getRoomInfo(player), logTypes.GAME);
    })) return false;

    // look around
    if (Verb(`${lookAliases} around`, inputArray, () => {
        logMessage(room.getRoomInfo(player), logTypes.GAME);
    })) return false;

    // look at room
    if (Verb(`${lookAliases} ${lookAtAliases} room,here`, inputArray, () => {
        logMessage(room.getRoomInfo(player), logTypes.GAME);
    })) return false;

    // look at
    if (Verb(`${lookAliases} ${lookAtAliases}`, inputArray, () => {
        logMessage('What do you want to look at?', logTypes.GAME);
        logMessage('(Try: look at thing)', logTypes.ALERT);
        question = 'look';
    })) return false;

    // look [#]
    if (Verb(`${lookAliases} #`, inputArray, args => {
        logMessage(room.getThingInfo(args[0]), logTypes.GAME);
    })) return false;

    // look at [#]
    if (Verb(`${lookAliases} ${lookAtAliases} #`, inputArray, args => {
        logMessage(room.getThingInfo(args[0]), logTypes.GAME);
    })) return false;

    const attackAliases = 'attack,h,hit,punch,kick,whack,yeet,hurt,damage,smack,kill,murder,slaughter,slap,bite,shoot,stab,pwn,destroy,obliterate';

    // attack
    if (Verb(attackAliases, inputArray, () => {
        logMessage('What do you want to attack?', logTypes.GAME);
        logMessage('(Try: attack thing)', logTypes.ALERT);
        question = 'attack';
    })) return false;

    // attack [#]
    if (Verb(`${attackAliases} #`, inputArray, args => {
        logMessage(room.attackMonster(player, args[0]), logTypes.COMBAT);
    })) return true;

    // credits
    if (Verb('credit,credits,proceduralta,julian,author,about', inputArray, () => {
        logMessage(`ProceduralTA is an open source text adventure.
        https://github.com/jlachniet/ProceduralTA`, logTypes.GAME);
    })) return false;

    input = inputArray.join(' ');

    if (question === 'look') {
        logMessage(room.getThingInfo(input), logTypes.GAME);
    } else if (question === 'attack') {
        logMessage(room.attackMonster(player, input), logTypes.COMBAT);
        question = '';
        return true;
    } else {
        if (room.getThing(input)) {
            logMessage(room.getThingInfo(input), logTypes.GAME);
        } else {
            logMessage('Unknown command.', logTypes.ALERT);
        }
    }

    // ?
    logMessage('Unknown command.', logTypes.ALERT);
    return false;
}