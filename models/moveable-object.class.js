/**
 * Base class for all objects that can move, fall due to gravity,
 * and update their hitbox dynamically. Extends DrawableObject.
 */
class MoveableObject extends DrawableObject {

    /**
     * Called once the world reference is assigned.
     * Starts gravity simulation for the object.
     */
    initAfterWorldSet() {
        this.applyGravity();
    }

    /**
     * Starts the gravity loop, applying vertical movement
     * at a fixed interval using the world's tracked timers.
     */
    applyGravity() {
        this.gravityInterval = this.world.setIntervalTracked(() => {
            this.applyGravityStep();
        }, 1000 / 25);
    }

    /**
     * Applies one step of gravity:
     * - moves the object vertically
     * - reduces vertical speed
     * - stops falling when reaching the ground
     */
    applyGravityStep() {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;

        if (!this.isAboveGround()) {
            this.speedY = 0;
        }
    }

    /**
     * Determines whether the object is above the ground level.
     * Throwable objects always return true to allow arc movement.
     *
     * @returns {boolean} True if the object is above ground.
     */
    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 180;
    }

    /**
     * Updates the real hitbox frame using offset‑adjusted values.
     */
    getRealFrame() {
        this.calculateRealX();
        this.calculateRealY();
        this.calculateRealWidth();
        this.calculateRealHeight();
    }

    /**
     * Calculates the hitbox's X position based on the object's offset.
     */
    calculateRealX() {
        this.rX = this.x + this.offset.left;
    }

    /**
     * Calculates the hitbox's Y position based on the object's offset.
     */
    calculateRealY() {
        this.rY = this.y + this.offset.top;
    }

    /**
     * Calculates the hitbox width based on the object's offset.
     */
    calculateRealWidth() {
        this.rWidth = this.width - this.offset.left - this.offset.right;
    }

    /**
     * Calculates the hitbox height based on the object's offset.
     */
    calculateRealHeight() {
        this.rHeight = this.height - this.offset.top - this.offset.bottom;
    }

    /**
     * Moves the object continuously to the right using a tracked interval.
     */
    moveRight() {
        this.world.setIntervalTracked(() => {
            this.x += this.speed;
        }, 1000 / 60);
    }

    /**
     * Moves the object continuously to the left using a tracked interval.
     */
    moveLeft() {
        this.moveInterval = this.world.setIntervalTracked(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    /**
     * Stops any active movement interval.
     */
    stopMoving() {
        clearInterval(this.moveInterval);
    }

    /**
     * Plays an animation by cycling through the provided image list.
     *
     * @param {string[]} images - Array of image paths for the animation.
     */
    playAnimation(images) {
        const index = this.currentImage % images.length;
        const path = images[index];

        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Updates the object's position based on movement direction,
     * unless the object is dead or has no energy.
     */
    updatePosition() {
        if (this.dead || this.energy <= 0) return;
        if (this.speed === 0) return;

        this.applyMovementDirection();
    }

    /**
     * Applies horizontal movement depending on the facing direction.
     */
    applyMovementDirection() {
        if (this.otherDirection) {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }
    }
}