// ProceduralTA is licensed under GNU General Public License v3.0.

import {gameData, logMessage} from '../ProceduralTA.js';
import {logTypes} from './GameLog.js';
import {Verb} from './Verb.js';

let question;

/**
 * Handles given user input.
 * @param {string} input The input to handle
 * @return {boolean} Whether the input causes the player to use a turn
 */
export function InputHandler(input) {
    let inputArray = input.split(' ');
    let verb;
    const player = gameData.player;
    const room = gameData.world.getRoom(player.y, player.x);

    const articles = 'a,an,the';
    const goAliases = 'go,move,run,sprint,walk,dash,slide';
    const helpAliases = 'help,what,?';
    const creditsAliases = 'credit,credits,proceduralta,julian,author,about';
    const infoAliases = 'info,me,myself,i,player,user,information,hp,stats,health';
    const northAliases = 'north,n,northward,northern,up,upward,upwards';
    const southAliases = 'south,s,southward,southern,down,downward,downwards';
    const eastAliases = 'east,e,eastward,eastern,right';
    const westAliases = 'west,w,westward,western,left';
    const lookAliases = 'look,l,search,inspect,view,see,observe';
    const lookAtAliases = 'at,around,towards,for';
    const attackAliases = 'attack,h,hit,punch,kick,whack,yeet,hurt,damage,smack,kill,murder,slaughter,slap,bite,shoot,stab,pwn,destroy,obliterate';
    const takeAliases = 'take,get,steal,grab,pick';

    /* verb = new Verb('hello', inputArray, () => {
        logMessage('world', logTypes.GAME);
        return false;
    }); if (verb.matched) {
        return verb.usedTurn;
    } */

    // the
    inputArray = inputArray.filter(word => !articles.split(',').includes(word));
    if (!inputArray.length) {
        logMessage('Unknown command.', logTypes.ALERT);
        return false;
    }

    // go
    inputArray = inputArray.filter(word => !goAliases.split(',').includes(word));
    if (!inputArray.length) {
        logMessage('Where do you want to go?', logTypes.GAME);
        return false;
    }

    // help
    if (Verb(helpAliases, inputArray, () => {
        logMessage(`Hello! You are playing a text adventure. You can type commands like "attack zombie" to do things.
        
            Here are some useful commands to help you out:
            
            north, south, east, west
            attack [something]
            take [something]
            use [something]
            
            There are lots of other things you can do, try to experiment!`, logTypes.GAME);
    }).matched) return false;

    // credits
    if (Verb(creditsAliases, inputArray, () => {
        logMessage(`ProceduralTA is an open source text adventure.
        
        https://github.com/jlachniet/ProceduralTA`, logTypes.GAME);
    }).matched) return false;

    // info
    if (Verb(infoAliases, inputArray, () => {
        logMessage(`You currently have ${player.hp} HP.`, logTypes.GAME);
    }).matched) return false;

    // north
    if (Verb(northAliases, inputArray, () => {
        logMessage('You move north.', logTypes.MOVEMENT);
        player.y++;
    }).matched) return true;

    // south
    if (Verb(southAliases, inputArray, () => {
        logMessage('You move south.', logTypes.MOVEMENT);
        player.y--;
    }).matched) return true;

    // east
    if (Verb(eastAliases, inputArray, () => {
        logMessage('You move east.', logTypes.MOVEMENT);
        player.x++;
    }).matched) return true;

    // west
    if (Verb(westAliases, inputArray, () => {
        logMessage('You move west.', logTypes.MOVEMENT);
        player.x--;
    }).matched) return true;

    // look
    if (Verb(lookAliases, inputArray, () => {
        logMessage(room.getRoomInfo(), logTypes.GAME);
    }).matched) return false;

    // look around
    if (Verb(`${lookAliases} around`, inputArray, () => {
        logMessage(room.getRoomInfo(), logTypes.GAME);
    }).matched) return false;

    // look at room
    if (Verb(`${lookAliases} ${lookAtAliases} room,here`, inputArray, () => {
        logMessage(room.getRoomInfo(), logTypes.GAME);
    }).matched) return false;

    // look at
    if (Verb(`${lookAliases} ${lookAtAliases}`, inputArray, () => {
        logMessage('What do you want to look at?', logTypes.GAME);
        logMessage('(Try: look at thing)', logTypes.ALERT);
        question = 'look';
    }).matched) return false;

    // look [#]
    if (Verb(`${lookAliases} #`, inputArray, args => {
        logMessage(room.getThingInfo(args[0]), logTypes.GAME);
    }).matched) return false;

    // look at [#]
    if (Verb(`${lookAliases} ${lookAtAliases} #`, inputArray, args => {
        logMessage(room.getThingInfo(args[0]), logTypes.GAME);
    }).matched) return false;

    // attack
    if (Verb(attackAliases, inputArray, () => {
        logMessage('What do you want to attack?', logTypes.GAME);
        logMessage('(Try: attack thing)', logTypes.ALERT);
        question = 'attack';
    }).matched) return false;

    // attack [#]
    verb = new Verb(`${attackAliases} #`, inputArray, args => {
        let attackResponse = room.attackThing(player, args[0]);
        logMessage(attackResponse.description, logTypes.COMBAT);
        return attackResponse.success;
    });
    if (verb.matched) {
        return verb.usedTurn;
    }

    // take
    if (Verb(takeAliases, inputArray, () => {
        logMessage('What do you want to take?', logTypes.GAME);
        logMessage('(Try: take thing)', logTypes.ALERT);
        question = 'take';
    }).matched) return false;

    // take [#]
    verb = new Verb(`${takeAliases} #`, inputArray, args => {
        let takeResponse = room.takeThing(player, args[0]);
        logMessage(takeResponse.description, logTypes.GAME);
        return takeResponse.success;
    });
    if (verb.matched) {
        return verb.usedTurn;
    }

    input = inputArray.join(' ');

    if (question === 'look') {
        logMessage(room.getThingInfo(input), logTypes.GAME);
        question = '';
        return false;

    } else if (question === 'attack') {
        let attackResponse = room.attackThing(player, input);
        logMessage(attackResponse.description, logTypes.COMBAT);
        question = '';
        return attackResponse.success;

    } else if (question === 'take') {
        let takeResponse = room.takeThing(player, input);
        logMessage(takeResponse.description, logTypes.COMBAT);
        question = '';
        return takeResponse.success;

    } else {
        if (room.getThing(input)) {
            logMessage(room.getThingInfo(input), logTypes.GAME);
            question = '';
            return false;
        }
        logMessage('Unknown command.', logTypes.ALERT);
        return false;
    }
}