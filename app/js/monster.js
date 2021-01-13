// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const monsterTypes = {
    ZOMBIE: {},
    SKELETON: {}
};

const monsterStates = {
    PASSIVE: 0,
    ATTACKING: 1
};

/**
 * A monster in a room.
 * @class
 */
class Monster {
    /**
     * Creates a monster.
     * @param {Object} monster The species of the monster
     */
    constructor(monster) {
        // What type of monster this is
        this.species = monster.species;

        // What state the monster is in
        this.state = monsterStates.PASSIVE;

        // How many hit points the monster has
        this.hp = monster.hp;

        // The average amount of damage an attack from this monster does
        this.strength = monster.strength;

        // How much damage the attack can vary by
        this.strengthVariance = monster.strengthVariance;

        // How often an attack hits
        this.attackAccuracy = monster.attackAccuracy;

        // The chance for the monster to switch from passive to aggressive
        this.aggression = monster.aggression;
    }

    /**
     * Creates an interaction between a player and a monster.
     * @param {Player} player The player to interact with
     * @return {boolean} Whether the interaction resulted in player death
     */
    playerInteraction(player) {
        if (this.state === monsterStates.PASSIVE) {
            if (Math.random() < this.aggression) {
                this.state = monsterStates.ATTACKING;
                logMessage(`- The ${this.species} sees you.`, logTypes.COMBAT);
            }
        } else {
            if (Math.random() < this.attackAccuracy) {
                const attack = monsterAttacksPlayer(player, this);
                if (attack.playerDied) {
                    logMessage(`- The ${this.species} attacks you for ${attack.damage} damage.`, logTypes.COMBAT);
                    logMessage(`Your HP is now: ${player.hp}`, logTypes.GAME);
                } else {
                    logMessage(`- The ${this.species} attacks you for ${attack.damage} damage, killing you.`, logTypes.ALERT);
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * Gets a description of the monster and some other information.
     * @return {string} A description of the monster
     */
    getInfo() {
        const description = [];
        description.push(`A ${this.species.toLowerCase()} with ${this.hp} HP.`);
        description.push(`It does an average of ${this.strength} damage, and is about ${this.attackAccuracy * 100}% accurate.`);
        return description.join(' ');
    }
}

monsterTypes.ZOMBIE = {
    species: 'Zombie',
    hp: 2,
    strength: 2,
    strengthVariance: 0,
    attackAccuracy: 0.5,
    aggression: 0.85
}

monsterTypes.SKELETON = {
    species: 'Skeleton',
    hp: 4,
    strength: 3,
    strengthVariance: 1,
    attackAccuracy: 0.75,
    aggression: 0.75
}

monsterTypes.SPIDER = {
    species: 'Spider',
    hp: 3,
    strength: 2,
    strengthVariance: 0,
    attackAccuracy: 0.95,
    aggression: 0.95
}

monsterTypes.VAMPIRE = {
    species: 'Vampire',
    hp: 5,
    strength: 3,
    strengthVariance: 2,
    attackAccuracy: 1,
    aggression: 0.5
}

monsterTypes.GOBLIN = {
    species: 'Goblin',
    hp: 2,
    strength: 2,
    strengthVariance: 1,
    attackAccuracy: 0.65,
    aggression: 0.8
}

monsterTypes.GHOST = {
    species: 'Ghost',
    hp: 8,
    strength: 3,
    strengthVariance: 1,
    attackAccuracy: 1,
    aggression: 0.2
}