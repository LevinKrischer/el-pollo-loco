class BottleManager {
    flyingBottles = [];
    lastThrowTime = 0;
    throwCooldown = 500;

    /**
     * @param {World} world - The game world.
     */
     constructor(world) {
        this.world = world;
    }

    /**
     * Checks whether the player can throw a bottle.
     */
     checkThrowObjects() {
        const now = Date.now();
        if (this.world.character.isHurt()) return;
        const canThrow =
            Keyboard.D &&
            this.world.pickupManager.bottleCount > 0 &&
            now - this.lastThrowTime >= this.throwCooldown;
        if (canThrow) this.throwBottle(now);
    }

    /**
     * Executes the bottle throw sequence.
     * @param {number} now - Current timestamp.
     */
     throwBottle(now) {
        SoundManager.play(this.world.soundBottleThrow);
        const bottle = this.createThrownBottle();
        this.initThrownBottle(bottle);
        this.registerBottleThrow(bottle, now);
    }

    /**
     * Creates a new bottle at the character's throw position.
     * @returns {Bottle} The new bottle instance.
     */
     createThrownBottle() {
        const offsetX = this.world.character.otherDirection ? -20 : 20;
        const x = this.world.character.x + offsetX;
        const y = this.world.character.y + 80;
        return new Bottle(x, y);
    }

    /**
     * Initializes a thrown bottle with world and movement.
     * @param {Bottle} bottle - The bottle to initialize.
     */
     initThrownBottle(bottle) {
        bottle.world = this.world;
        if (bottle.initAfterWorldSet) bottle.initAfterWorldSet();
        bottle.throw(this.world.character.otherDirection);
    }

    /**
     * Registers the throw and updates inventory/UI.
     * @param {Bottle} bottle - The thrown bottle.
     * @param {number} now - Timestamp of the throw.
     */
     registerBottleThrow(bottle, now) {
        this.flyingBottles.push(bottle);
        this.world.pickupManager.bottleCount--;
        this.lastThrowTime = now;
        this.world.character.lastMoveTime = now;
        this.world.uiManager.updateBottleStatusBar(this.world.pickupManager.bottleCount, this.world.maxBottleInventory);
    }

    /**
     * Checks whether any thrown bottle hits an enemy.
     */
     checkBottleHits() {
        this.flyingBottles.forEach(bottle => {
            if (bottle.isExploded) return;
            bottle.getRealFrame();
            this.checkBottleHitEnemies(bottle);
        });
        this.flyingBottles = this.flyingBottles.filter(bottle => !bottle.markedForDeletion);
    }

    /**
     * Checks one thrown bottle against all enemies.
     * @param {Bottle} bottle - The bottle to test.
     */
     checkBottleHitEnemies(bottle) {
        for (const enemy of this.world.level.enemies) {
            enemy.getRealFrame();
            if (!enemy.isDead() && bottle.isColliding(enemy)) {
                if (enemy instanceof Endboss && enemy.isHurt()) {
                    continue;
                }
                bottle.explode();
                this.handleBottleHitEnemy(enemy);
                return;
            }
        }
    }

    /**
     * Handles the result of a bottle hitting an enemy.
     * @param {HitableObject} enemy - The enemy that was hit.
     */
     handleBottleHitEnemy(enemy) {
        if (enemy instanceof Endboss) {
            this.world.endbossManager.handleEndbossHit(enemy);
            return;
        }
        enemy.die();
    }
}

