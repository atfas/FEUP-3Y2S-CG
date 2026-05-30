export class GameController {
    constructor(scene, maxHP, maxCollectedBales, colisionDamage, healHP) {
        this.scene = scene;

        this.hp = maxHP;
        this.score = 0;
        this.gameOver = false;
        this.collectedBalesCount = 0;
        this.maxCollectedBales= maxCollectedBales;
        this.balesDropped = 0;
        this.instantDamage = 0;
        this.colisionDamage = colisionDamage;
        this.instantHeal = 0;
        this.healHP = healHP;
        this.isInsideRing = false;
        this.hasStartedMoving = false;

        this._lastSecondTime = 0;
        this._cooldowns = {};
    }

    update(t) {
        if (this.gameOver) return;

        if (!this.hasStartedMoving && this.scene.wagon.speed > 0)
            this.hasStartedMoving = true;

        if (this.hasStartedMoving) {
            if (t - this._lastSecondTime >= 1000) {
                this.hp = Math.max(0, this.hp - 1);
                this.score++;
                this._lastSecondTime = t;
                if (this.hp <= 0) this._triggerGameOver("Out of health");
            }
        } else {
            this._lastSecondTime = t;
        }

        const s = this.scene;
        const wx = s.wagon.posX * 3;
        const wz = s.wagon.posZ * 3;

        this.isInsideRing = s.barnRing.contains(wx, wz);

        for (const rock of s.rocks) {
            if (Math.hypot(wx - rock.x, wz - rock.z) < rock.r) {
                const key = rock.x + "_" + rock.z;
                const now = Date.now();
                if (!this._cooldowns[key] || now - this._cooldowns[key] > 1500) {
                    this._cooldowns[key] = now;
                    this.takeDamage(this.colisionDamage);
                    if (this.hp <= 0) this._triggerGameOver("Crashed into Rock");
                }
            }
        }
    }

    takeDamage() {
        this.hp = Math.max(0, this.hp - this.colisionDamage);
        this.instantDamage = this.colisionDamage;
        setTimeout(() => { this.instantDamage = 0; }, 1500);
    }

    gainHp() {
        const amount = this.collectedBalesCount * this.healHP;
        this.hp = Math.min(100, this.hp + amount);
        this.instantHeal = amount;
        setTimeout(() => { this.instantHeal = 0; }, 1500);
    }

    tryPickUpBale() {
        if (this.gameOver) return;
        const s = this.scene;
        const wx = s.wagon.posX * 3;
        const wz = s.wagon.posZ * 3;

        if(this.collectedBalesCount >= this.maxCollectedBales) return;
        for (let i = 0; i < s.balesList.length; i++) {
            const bale = s.balesList[i];
            if (!bale.active) continue;
            if (bale.ring.contains(wx, wz)) {
                bale.active = false;
                this.collectedBalesCount++;
                break;
            }
        }
    }

    tryDropOffBales() {
        if (this.gameOver || !this.isInsideRing || this.collectedBalesCount === 0) return;
        this.balesDropped += this.collectedBalesCount;
        this.gainHp();
        this.collectedBalesCount = 0;
    }

    _triggerGameOver(reason) {
        this.gameOver = true;
        alert(`Game Over! ${reason}. Final Score: ${this.score}`);
    }
}
