export class GameController {
    /**
     * @param {GameModel} gameModel - holds all game state (hp, score, bales, etc.)
     * @param {Wagon} wagon - the player-controlled wagon object
     * @param {Ring} barnRing - the drop-off zone around the barn
     * @param {InputController} inputController - tracks keyboard input per frame
     */
    constructor(gameModel, wagon, barnRing, inputController) {
        this.model   = gameModel;
        this.wagon   = wagon;
        this.barnRing = barnRing;
        this.input   = inputController;
    }

    /**
     * Main per-frame update: processes input, drains health over time once the
     * wagon starts moving, checks whether the wagon is inside the barn ring, and
     * detects collisions with rocks (applying cooldown so a single rock can't
     * deal damage every frame).
     * @param {number} t - current timestamp in milliseconds
     */
    update(t) {

        if (!this.model.gameOver) {
            if (this.input.wasJustPressed('KeyP')) this.tryPickUpBale();
            if (this.input.wasJustPressed('KeyL')) this.tryDropOffBales();
        }
        this.input.endFrame();

        if (this.model.gameOver) return;

        if (!this.model.hasStartedMoving && this.wagon.speed > 0)
            this.model.hasStartedMoving = true;

        if (this.model.hasStartedMoving) {
            if (t - this.model._lastSecondTime >= this.model.healthDrainInterval) {
                this.model.hp = Math.max(0, this.model.hp - 1);
                this.model.score++;
                this.model._lastSecondTime = t;
                if (this.model.hp <= 0) this._triggerGameOver("Out of health");
            }
        } else {
            this.model._lastSecondTime = t;
        }

        this.model.isInsideRing = this.barnRing.contains(this.wagon.x, this.wagon.z);

        for (const rock of this.model.rocks) {
            if (Math.hypot(this.wagon.x - rock.x, this.wagon.z - rock.z) < rock.r) {
                const key = rock.x + "_" + rock.z;
                const now = Date.now();
                if (!this.model._cooldowns[key] || now - this.model._cooldowns[key] > this.model.collisionCooldown) {
                    this.model._cooldowns[key] = now;
                    this.takeDamage();
                    if (this.model.hp <= 0) this._triggerGameOver("Crashed into Rock");
                }
            }
        }
    }

    /**
     * Applies a random amount of damage (between minColisionDamage and
     * maxColisionDamage) to the wagon's HP and briefly surfaces it via
     * instantDamage so the HUD can flash the value.
     */
    takeDamage() {

        const damage = Math.round(this.model.minColisionDamage + Math.random() * (this.model.maxColisionDamage - this.model.minColisionDamage));
        this.model.hp = Math.max(0, this.model.hp - damage);
        this.model.instantDamage = damage;
        setTimeout(() => { this.model.instantDamage = 0; }, this.model.damageDisplayDuration);
    }

    /**
     * Restores HP proportional to the number of bales currently on the wagon
     * (collectedBalesCount × healHP), capped at maxHP, and briefly surfaces
     * the heal amount via instantHeal so the HUD can flash the value.
     */
    gainHp() {

        const amount = this.model.collectedBalesCount * this.model.healHP;
        this.model.hp = Math.min(this.model.maxHP, this.model.hp + amount);
        this.model.instantHeal = amount;
        setTimeout(() => { this.model.instantHeal = 0; }, this.model.healDisplayDuration);
    }

    /**
     * Attempts to pick up the first hay bale whose ring contains the wagon's
     * current position. Picks up at most one bale per press and respects the
     * maximum carry capacity (maxCollectedBales).
     */
    tryPickUpBale() {

        if (this.model.gameOver) return;
        if (this.model.collectedBalesCount >= this.model.maxCollectedBales) return;
        for (let i = 0; i < this.model.hayBales.length; i++) {
            const bale = this.model.hayBales[i];
            if (bale.ring.contains(this.wagon.x, this.wagon.z)) {
                this.model.hayBales.splice(i, 1);
                this.model.collectedBalesCount++;
                this.wagon.carriedHayBales = this.model.collectedBalesCount;
                break;
            }
        }
    }

    /**
     * Drops off all carried bales at the barn: requires the wagon to be inside
     * the barn ring and to be carrying at least one bale. Heals HP, resets the
     * carry count, and triggers a bale respawn if the field is now empty.
     */
    tryDropOffBales() {

        if (this.model.gameOver || !this.model.isInsideRing || this.model.collectedBalesCount === 0) return;
        this.model.balesDropped += this.model.collectedBalesCount;
        this.gainHp();
        const dropped = this.model.collectedBalesCount;
        this.model.collectedBalesCount = 0;
        this.wagon.carriedHayBales = 0;
        if(this.model.hayBales.length == 0) this._spawnController.respawnBales(this.model.scene);
    }

    /**
     * Wires in the spawn controller after construction so that tryDropOffBales
     * can trigger bale respawns without creating a circular dependency at init time.
     * @param {SpawnController} spawnController
     */
    setSpawnController(spawnController) {
        this._spawnController = spawnController;
    }

    // Proxy getters for dat.GUI bindings in MyInterface
    get hp()                  { return this.model.hp; }
    get score()               { return this.model.score; }
    get instantDamage()       { return this.model.instantDamage; }
    get instantHeal()         { return this.model.instantHeal; }
    get collectedBalesCount() { return this.model.collectedBalesCount; }
    get balesDropped()        { return this.model.balesDropped; }

    /**
     * Sets the gameOver flag and shows a blocking alert with the cause and the
     * player's final score, halting all further game logic.
     * @param {string} reason - human-readable cause of death shown in the alert
     */
    _triggerGameOver(reason) {
        this.model.gameOver = true;
        alert(`Game Over! ${reason}. Final Score: ${this.model.score}`);
    }
}
