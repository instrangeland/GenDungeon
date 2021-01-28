/*
 * GenDungeon is licensed under GNU General Public License v3.0.
 */

import game, {isElectron} from '../game.js';
import {GameLog, logTypes} from './GameLog.js';
import Verb from './Verb.js';

let question;

/**
 * Handles given user input.
 * @param {string} input The input to handle
 * @return {boolean} Whether the input causes the player to use a turn
 */
export default function InputHandler(input) {
    let questionCopy = question;
    question = '';

    let inputArray = input.split(' ');
    let verb;
    const player = game.player;
    const room = game.world.getRoom(player.y, player.x);


    /* - ACCESSORY WORDS - */
    const articles = 'a,an,the';
    const goAliases = 'go,move,run,sprint,walk,dash,slide';


    // the
    inputArray = inputArray.filter(word => !articles.split(',').includes(word));
    if (!inputArray.length) {
        GameLog.addMessage('Unknown command.', logTypes.ALERT);
        return false;
    }

    // go
    inputArray = inputArray.filter(word => !goAliases.split(',').includes(word));
    if (!inputArray.length) {
        GameLog.addMessage('Where do you want to go?', logTypes.GAME);
        return false;
    }


    /* - STATIC VERBS - */
    const helpAliases = 'help,?,what';
    const creditsAliases = 'credit,credits,gendungeon,julian,author,about';
    const jumpAliases = 'jump,bounce,spring';


    // help
    if (Verb.check(helpAliases, inputArray, () => {
        GameLog.addMessage(`Hello! You are playing a text adventure. You can type commands like "attack zombie" to do things.
        
            Here are some useful commands to help you out:
            
            north, south, east, west
            attack [something]
            take [something]
            
            There are lots of other things you can do, try to experiment!`, logTypes.GAME);
    }).matched) return false;

    // credits
    if (Verb.check(creditsAliases, inputArray, () => {
        GameLog.addMessage(`GenDungeon is an open source text adventure.
        
        https://github.com/jlachniet/GenDungeon`, logTypes.GAME);
    }).matched) return false;

    // jump
    if (Verb.check(jumpAliases, inputArray, () => {
        GameLog.addMessage('You jump in the air, and fall back down.', logTypes.GAME);
    }).matched) return false;


    /* - META - */
    const restartAliases = 'restart,reset,newgame';


    // restart
    if (Verb.check(restartAliases, inputArray, () => {
        if (!isElectron) {
            localStorage.clear();
        } else {
            window.api.send('resetGame');
        }
        location.reload();
        GameLog.addMessage('Restarting...', logTypes.SYSTEM);
    }).matched) return false;


    /* - INFO - */
    const infoAliases = 'info,i,me,myself,player,user,information,hp,stats,health';
    const lookAliases = 'look,l,search,inspect,view,see,observe,ls,dir';
    const lookAtAliases = 'at,around,towards,for';


    // info
    if (Verb.check(infoAliases, inputArray, () => {
        GameLog.addMessage(`You currently have ${player.hp} HP, and are strength ${player.strength}.`, logTypes.GAME);
    }).matched) return false;

    // look
    if (Verb.check(lookAliases, inputArray, () => {
        GameLog.addMessage(room.getRoomInfo(), logTypes.GAME);
    }).matched) return false;

    // look around
    if (Verb.check(`${lookAliases} around`, inputArray, () => {
        GameLog.addMessage(room.getRoomInfo(), logTypes.GAME);
    }).matched) return false;

    // look at room
    if (Verb.check(`${lookAliases} ${lookAtAliases} room,here`, inputArray, () => {
        GameLog.addMessage(room.getRoomInfo(), logTypes.GAME);
    }).matched) return false;

    // look at
    if (Verb.check(`${lookAliases} ${lookAtAliases}`, inputArray, () => {
        GameLog.addMessage('What do you want to look at?', logTypes.GAME);
        GameLog.addMessage('(Try: look at thing)', logTypes.ALERT);
        question = 'look';
    }).matched) return false;

    // look [#]
    if (Verb.check(`${lookAliases} #`, inputArray, args => {
        GameLog.addMessage(room.getThingInfo(args[0]), logTypes.GAME);
    }).matched) return false;

    // look at [#]
    if (Verb.check(`${lookAliases} ${lookAtAliases} #`, inputArray, args => {
        GameLog.addMessage(room.getThingInfo(args[0]), logTypes.GAME);
    }).matched) return false;


    /* - MOVEMENT - */
    const backAliases = 'back,b,backwards,previous';
    const northAliases = 'north,n,northward,northern,up,upward,upwards';
    const southAliases = 'south,s,southward,southern,down,downward,downwards';
    const eastAliases = 'east,e,eastward,eastern,right';
    const westAliases = 'west,w,westward,western,left';


    // back
    verb = Verb.check(backAliases, inputArray, () => {
        return player.moveBack();
    });
    if (verb.matched) {
        return verb.usedTurn;
    }

    // north
    verb = Verb.check(northAliases, inputArray, () => {
        return player.move(1, 0, 'north');
    });
    if (verb.matched) {
        return verb.usedTurn;
    }

    // south
    verb = Verb.check(southAliases, inputArray, () => {
        return player.move(-1, 0, 'south');
    });
    if (verb.matched) {
        return verb.usedTurn;
    }

    // east
    verb = Verb.check(eastAliases, inputArray, () => {
        return player.move(0, 1, 'east');
    });
    if (verb.matched) {
        return verb.usedTurn;
    }

    // west
    verb = Verb.check(westAliases, inputArray, () => {
        return player.move(0, -1, 'west');
    });
    if (verb.matched) {
        return verb.usedTurn;
    }


    /* - COMBAT - */
    const attackAliases = 'attack,h,hit,punch,kick,whack,yeet,hurt,damage,smack,kill,murder,slaughter,slap,bite,shoot,stab,pwn,destroy,obliterate';


    // attack
    if (Verb.check(attackAliases, inputArray, () => {
        GameLog.addMessage('What do you want to attack?', logTypes.GAME);
        GameLog.addMessage('(Try: attack thing)', logTypes.ALERT);
        question = 'attack';
    }).matched) return false;

    // attack [#]
    verb = Verb.check(`${attackAliases} #`, inputArray, args => {
        return room.attackThing(player, args[0]);
    });
    if (verb.matched) {
        return verb.usedTurn;
    }


    /* - OBJECT INTERACTION - */
    const takeAliases = 'take,t,get,steal,grab,pick,collect,use,eat';


    // take
    if (Verb.check(takeAliases, inputArray, () => {
        GameLog.addMessage('What do you want to take?', logTypes.GAME);
        GameLog.addMessage('(Try: take thing)', logTypes.ALERT);
        question = 'take';
    }).matched) return false;

    // take [#]
    verb = Verb.check(`${takeAliases} #`, inputArray, args => {
        return room.takeThing(player, args[0]);
    });
    if (verb.matched) {
        return verb.usedTurn;
    }


    /* - QUESTIONS - */


    input = inputArray.join(' ');

    // look -> [#]
    if (questionCopy === 'look') {
        GameLog.addMessage(room.getThingInfo(input), logTypes.GAME);
        return false;
    }

    // attack -> [#]
    if (questionCopy === 'attack') {
        return room.attackThing(player, input);
    }

    // take -> [#]
    if (questionCopy === 'take') {
        return room.takeThing(player, input);
    }

    // [#]
    if (room.getThing(input)) {
        GameLog.addMessage(room.getThingInfo(input), logTypes.GAME);
        return false;
    }


    /* - ANYTHING ELSE - */


    GameLog.addMessage('Unknown command.', logTypes.ALERT);
    return false;

}