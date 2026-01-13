/**
 * A throwable bottle that can idle‑animate, rotate while thrown,
 * and play a splash animation when exploding. Inherits physics,
 * animation utilities, and world‑tracked timers from ThrowableObject.
 */
class Bottle extends ThrowableObject {

    isExploded = false;
    isThrown = false;

    imgsSplash = ImageHub.bottle.splash;
    imgsBottleNormal = ImageHub.bottle.normal;
    imgsBottleRotation = ImageHub.bottle.rotating;

    soundBreak = SoundHub.sfx.collectibles.bottleBreak;

    offset = {
        top: 10,
        right: 10,
        bottom: 8,
        left: 10
    };

    /**
     * Creates a new bottle at the given world coordinates and loads
     * all required animation frames.
     *
     * @param {number} x - Horizontal world position.
     * @param {number} y - Vertical world position.
     */
    constructor(x, y) {
        super();
        this.loadImage(this.imgsBottleNormal[0]);
        this.loadImages(this.imgsBottleNormal);
        this.loadImages(this.imgsSplash);
        this.loadImages(this.imgsBottleRotation);
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 80;
    }

    /**
     * Called once the world reference is assigned.
     * Starts the bottle's animation loop.
     */
    initAfterWorldSet() {
        this.animate();
    }

    /**
     * Triggers the explosion sequence:
     * - marks the bottle as exploded
     * - plays the breaking sound
     * - stops movement and physics
     * - resets animation state
     * - schedules deletion after a short delay
     */
    explode() {
        this.isExploded = true;

        SoundManager.play(this.soundBreak);

        clearInterval(this.throwInterval);
        clearInterval(this.gravityInterval);

        this.speed = 0;
        this.speedY = 0;
        this.currentImage = 0;
        this.isThrown = false;

        this.world.setTimeoutTracked(() => {
            this.markedForDeletion = true;
        }, 400);
    }

    /**
     * Starts the main animation loop, switching between:
     * - splash animation (exploded)
     * - rotation animation (thrown)
     * - idle animation (default)
     */
    animate() {
        let idleTimer = 0;

        this.world.setIntervalTracked(() => {
            if (this.isExploded) return this.animateSplash();
            if (this.isThrown) return this.animateThrow();
            idleTimer = this.animateIdle(idleTimer);
        }, 60);
    }

    /**
     * Plays the idle animation in timed intervals.
     *
     * @param {number} timer - Accumulated idle time.
     * @returns {number} Updated timer value.
     */
    animateIdle(timer) {
        if (timer >= 300) {
            this.playAnimation(this.imgsBottleNormal);
            return 0;
        }
        return timer + 60;
    }

    /**
     * Plays the rotation animation while the bottle is thrown.
     */
    animateThrow() {
        this.playAnimation(this.imgsBottleRotation);
    }

    /**
     * Plays the splash animation after the bottle explodes.
     */
    animateSplash() {
        this.playAnimation(this.imgsSplash);
    }
}