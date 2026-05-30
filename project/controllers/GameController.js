export class GameController {
    constructor(gameModel, wagon, barnRing, inputController) {
        this.model   = gameModel;
        this.wagon   = wagon;
        this.barnRing = barnRing;
        this.input   = inputController;
    }

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

    takeDamage() {
        
        const damage = Math.round(this.model.minColisionDamage + Math.random() * (this.model.maxColisionDamage - this.model.minColisionDamage));
        this.model.hp = Math.max(0, this.model.hp - damage);
        this.model.instantDamage = damage;
        setTimeout(() => { this.model.instantDamage = 0; }, this.model.damageDisplayDuration);
    }

    gainHp() {
        
        const amount = this.model.collectedBalesCount * this.model.healHP;
        this.model.hp = Math.min(this.model.maxHP, this.model.hp + amount);
        this.model.instantHeal = amount;
        setTimeout(() => { this.model.instantHeal = 0; }, this.model.healDisplayDuration);
    }

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

    tryDropOffBales() {
        
        if (this.model.gameOver || !this.model.isInsideRing || this.model.collectedBalesCount === 0) return;
        this.model.balesDropped += this.model.collectedBalesCount;
        this.gainHp();
        const dropped = this.model.collectedBalesCount;
        this.model.collectedBalesCount = 0;
        this.wagon.carriedHayBales = 0;
        if(this.model.hayBales.length == 0) this._spawnController.respawnBales(this.model.scene);
    }

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

    _triggerGameOver(reason) {
        this.model.gameOver = true;
        alert(`Game Over! ${reason}. Final Score: ${this.model.score}`);
    }
}
