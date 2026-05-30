export class GameController {
    constructor(scene, maxHP, maxCollectedBales, minColisionDamage, maxColisionDamage, healHP) {
        this.scene = scene;

        this.maxHP = maxHP;
        this.hp = maxHP;
        this.score = 0;
        this.gameOver = false;
        this.collectedBalesCount = 0;
        this.maxCollectedBales= maxCollectedBales;
        this.balesDropped = 0;
        this.instantDamage = 0;
        this.minColisionDamage = minColisionDamage;
        this.maxColisionDamage = maxColisionDamage;
        this.instantHeal = 0;
        this.healHP = healHP;
        this.isInsideRing = false;
        this.hasStartedMoving = false;

        this.healthDrainInterval   = 1000;
        this.collisionCooldown     = 1500;
        this.damageDisplayDuration = 1500;
        this.healDisplayDuration   = 1500;

        this._lastSecondTime = 0;
        this._cooldowns = {};
    }

    update(t) {
        if (this.gameOver) return;

        if (!this.hasStartedMoving && this.scene.wagon.speed > 0)
            this.hasStartedMoving = true;

        if (this.hasStartedMoving) {
            if (t - this._lastSecondTime >= this.healthDrainInterval) {
                this.hp = Math.max(0, this.hp - 1);
                this.score++;
                this._lastSecondTime = t;
                if (this.hp <= 0) this._triggerGameOver("Out of health");
            }
        } else {
            this._lastSecondTime = t;
        }

        this.isInsideRing = this.scene.barnRing.contains(this.scene.wagon.x, this.scene.wagon.z);

        for (const rock of this.scene.rocks) {
            if (Math.hypot(this.scene.wagon.x - rock.x, this.scene.wagon.z - rock.z) < rock.r) {
                const key = rock.x + "_" + rock.z;
                const now = Date.now();
                if (!this._cooldowns[key] || now - this._cooldowns[key] > this.collisionCooldown) {
                    this._cooldowns[key] = now;
                    this.takeDamage();
                    if (this.hp <= 0) this._triggerGameOver("Crashed into Rock");
                }
            }
        }
    }

    takeDamage() {
        const damage = Math.round(this.minColisionDamage + Math.random() * (this.maxColisionDamage - this.minColisionDamage));
        this.hp = Math.max(0, this.hp - damage);
        this.instantDamage = damage;
        setTimeout(() => { this.instantDamage = 0; }, this.damageDisplayDuration);
    }

    gainHp() {
        const amount = this.collectedBalesCount * this.healHP;
        this.hp = Math.min(this.maxHP, this.hp + amount);
        this.instantHeal = amount;
        setTimeout(() => { this.instantHeal = 0; }, this.healDisplayDuration);
    }

    tryPickUpBale() {
        if (this.gameOver) return;
        
        if(this.collectedBalesCount >= this.maxCollectedBales) return;
        for (let i = 0; i < this.scene.balesList.length; i++) {
            const bale = this.scene.balesList[i];
            if (bale.ring.contains(this.scene.wagon.x, this.scene.wagon.z)) {
                this.scene.balesList.splice(i,1);
                this.collectedBalesCount++;
                break;
            }
        }
    }

    tryDropOffBales() {
        if (this.gameOver || !this.isInsideRing || this.collectedBalesCount === 0) return;
        this.balesDropped += this.collectedBalesCount;
        this.gainHp();
        const dropped = this.collectedBalesCount;
        this.collectedBalesCount = 0;
        this.scene.respawnBales(dropped);
    }

    _triggerGameOver(reason) {
        this.gameOver = true;
        alert(`Game Over! ${reason}. Final Score: ${this.score}`);
    }
}
