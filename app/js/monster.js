// ProceduralTA is licensed under GNU General Public License v3.0.

'use strict';

const monsterSpecies = {
    ZOMBIE: 'Zombie',
    SKELETON: 'Skeleton'
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
     * @param {string} species The species of the monster
     */
    constructor(species) {
        // What type of monster this is
        this.species = species;

        // What state the monster is in
        this.state = monsterStates.PASSIVE;

        // How many hit points the monster has
        this.hp = 2;

        // The average amount of damage an attack from this monster does
        this.strength = 2;

        // How much damage the attack can vary by
        this.strengthVariance = 1;

        // How often an attack hits
        this.attackAccuracy = 0.85;

        // The chance for the monster to switch from passive to aggressive
        this.aggression = 0.75;
    }

    /**
     * Creates an interaction between a player and a monster.
     * @param player The player to interact with
     * @return {boolean} Whether the interaction resulted in player death
     */
    playerInteraction(player) {
        if (this.state === monsterStates.PASSIVE) {
            if (Math.random() < this.aggression) {
                this.state = monsterStates.ATTACKING;
                logMessage(`- The ${this.species} sees you.`, logTypes.GAME);
            }
        } else {
            if (Math.random() < this.attackAccuracy) {
                const damage = this.strength + getRandInt(-this.strengthVariance, this.strengthVariance);
                if (monsterAttacksPlayer(player, this, damage)) {
                    logMessage(`- The ${this.species} attacks you for ${damage} damage.`, logTypes.COMBAT);
                    logMessage(`Your HP is now: ${player.hp}`, logTypes.GAME);
                } else {
                    logMessage(`- The ${this.species} attacks you for ${damage} damage, killing you.`, logTypes.ERROR);
                    return true;
                }
            }
        }
        return false;
    }
}