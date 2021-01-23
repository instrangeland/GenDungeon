// ProceduralTA is licensed under GNU General Public License v3.0.

export default class RPC {
    static updateRoom(roomDescription) {
        window.api.send('drpc', `Exploring ${roomDescription.toLowerCase()}.`);
    }
    static updateAttack(monsterToAttack) {
        window.api.send('drpc', `Attacking a ${monsterToAttack.toLowerCase()}.`);
    }
    static updateKilled(monsterToAttack) {
        window.api.send('drpc', `Killed a ${monsterToAttack.toLowerCase()}.`);
    }
    static updateTake(thingToTake) {
        window.api.send('drpc', `Took a ${thingToTake.toLowerCase()}.`);
    }
    static updateDead() {
        window.api.send('drpc', `Died. :(`);
    }
}
