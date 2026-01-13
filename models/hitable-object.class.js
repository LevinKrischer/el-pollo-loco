/**
 * Base class for all objects that can take damage, die,
 * and trigger hit or death effects. Extends MoveableObject.
 */
class HitableObject extends MoveableObject {

    energy = 100;
    lastHit = 0;
    dead = false;
    deathSoundPlayed = false;
    deathAnimationDuration = 1500;

    soundEndbossHurt = SoundHub.sfx.endboss.hurt;
    soundEndbossDead = SoundHub.sfx.endboss.dead;

    soundChickenDead1 = SoundHub.sfx.chicken.dead1;
    soundChickenDead2 = SoundHub.sfx.chicken.dead2;

    offset = { top: 0, right: 0, bottom: 0, left: 0 };

    /**
     * Applies damage to the object unless it is currently in a hurt state.
     * Triggers hit effects when appropriate.
     *
     * @param {number} [amount=2] - Amount of damage to apply.
     */
    hit(amount = 2) {
        if (this.isHurt()) return;

        this.energy -= amount;

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.handleHitEffects();
        }
    }

    /**
     * Handles sound and state changes when the object is hit.
     * Plays different sounds depending on the object type.
     */
    handleHitEffects() {
        this.lastHit = Date.now();

        if (this instanceof Character) {
            SoundManager.play(this.soundHurt);
            SoundManager.stop(this.walkSound);
            SoundManager.stop(this.snoreSound);
        }

        if (this.isEndboss) {
            SoundManager.play(this.soundEndbossHurt);
        }
    }

    /**
     * Returns whether the object is currently in a hurt state.
     * Hurt state lasts for 1 second after being hit.
     *
     * @returns {boolean} True if the object is hurt.
     */
    isHurt() {
        const timePassed = (Date.now() - this.lastHit) / 1000;
        return timePassed < 1;
    }

    /**
     * Returns whether the object is dead.
     *
     * @returns {boolean} True if energy is zero or the dead flag is set.
     */
    isDead() {
        return this.dead || this.energy <= 0;
    }

    /**
     * Calculates the real hitbox frame based on the object's offset.
     * Used for collision detection.
     */
    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rWidth = this.width - this.offset.left - this.offset.right;
        this.rHeight = this.height - this.offset.top - this.offset.bottom;
    }

    /**
     * Checks whether this object is colliding with another hitbox.
     *
     * @param {HitableObject} hitObj - The other object to test collision against.
     * @returns {boolean} True if the hitboxes overlap.
     */
    isColliding(hitObj) {
        return (
            this.rX + this.rWidth > hitObj.rX &&
            this.rX < hitObj.rX + hitObj.rWidth &&
            this.rY + this.rHeight > hitObj.rY &&
            this.rY < hitObj.rY + hitObj.rHeight
        );
    }

    /**
     * Kills the object, plays death sounds, triggers endboss logic,
     * stops movement, and schedules deletion.
     */
    die() {
        this.energy = 0;
        this.dead = true;
        this.speed = 0;

        if (!this.deathSoundPlayed) {
            this.handleDeathSound();
            this.handleEndbossDeath();
            this.deathSoundPlayed = true;
        }

        this.stopMovement();
        this.scheduleDeletion();
    }

    /**
     * Plays the appropriate death sound depending on the object type.
     */
    handleDeathSound() {
        if (this instanceof Chicken) {
            SoundManager.play(this.soundChickenDead1);
        } else if (this instanceof ChickenSmall) {
            SoundManager.play(this.soundChickenDead2);
        }
    }

    /**
     * Handles the special death sequence for the endboss,
     * including animation, sound, and triggering the win screen.
     */
    handleEndbossDeath() {
        if (!(this instanceof Endboss)) return;

        SoundManager.play(this.soundEndbossDead);
        console.log("Boss dead:", this.world, this.world?.gameStopped);

        this.playAnimation(this.imgsDead);

        this.world.setTimeoutTracked(() => {
            if (!this.world.gameStopped) {
                this.world.stopGame();
                toggleEndScreen('win');
            }
        }, this.deathAnimationDuration);
    }

    /**
     * Stops any active movement interval.
     */
    stopMovement() {
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }
    }

    /**
     * Schedules the object for deletion after a delay.
     */
    scheduleDeletion() {
        this.world.setTimeoutTracked(() => {
            this.markedForDeletion = true;
        }, 5000);
    }
}