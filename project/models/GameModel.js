export class GameModel {
    /**
     * Holds all mutable game state. No logic lives here — controllers read and
     * write these properties directly.
     * @param {number} maxHP               - starting and maximum HP value
     * @param {number} maxCollectedBales   - maximum hay bales the wagon can carry
     * @param {number} minColisionDamage   - minimum damage dealt on a rock collision
     * @param {number} maxColisionDamage   - maximum damage dealt on a rock collision
     * @param {number} healHP              - HP restored per bale when dropping off
     */
    constructor(maxHP, maxCollectedBales, minColisionDamage, maxColisionDamage, healHP) {
        this.maxHP               = maxHP;
        this.hp                  = maxHP;
        this.score               = 0;
        this.gameOver            = false;
        this.collectedBalesCount = 0;
        this.maxCollectedBales   = maxCollectedBales;
        this.balesDropped        = 0;
        this.instantDamage       = 0;
        this.instantHeal         = 0;
        this.isInsideRing        = false;
        this.hasStartedMoving    = false;

        this.minColisionDamage     = minColisionDamage;
        this.maxColisionDamage     = maxColisionDamage;
        this.healHP                = healHP;
        this.healthDrainInterval   = 1000;
        this.collisionCooldown     = 1500;
        this.damageDisplayDuration = 1500;
        this.healDisplayDuration   = 1500;

        this._lastSecondTime = 0;
        this._cooldowns      = {};

        this.hayBales       = [];
        this.rocks          = [];
        this.flowers        = [];
        this._placedObjects = [];
    }
}
