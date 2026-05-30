export class GameModel {
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
