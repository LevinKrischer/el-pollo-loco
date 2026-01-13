/**
 * A small chicken enemy with simple left‑movement behavior and
 * a basic walking/death animation cycle. Inherits hit detection
 * and damage logic from HitableObject.
 */
class ChickenSmall extends HitableObject {

    constructor() {
        super().loadImage(ImageHub.chickenSmall.walking[0]);
        this.loadImages(this.imgsWalking);
        this.loadImages(this.imgsDead);

        // Random spawn position and speed
        this.x = 200 + Math.random() * 3500;
        this.speed = 0.15 + Math.random() * 0.4;
    }

    /**
     * Called once the world reference is assigned.
     * Starts movement and animation loops.
     */
    initAfterWorldSet() {
        this.animate();
    }

    /**
     * Starts the chicken's movement and animation loop.
     * Moves left continuously and begins frame updates.
     */
    animate() {
        this.moveLeft();
        this.startAnimationLoop();
    }

    /**
     * Runs the animation loop, switching between walking frames
     * and the death animation depending on the chicken's state.
     */
    startAnimationLoop() {
        this.world.setIntervalTracked(() => {
            if (this.isDead()) {
                this.playAnimation(this.imgsDead);
            } else {
                this.playWalkingFrame();
            }
        }, 200);
    }

    /**
     * Advances the walking animation by selecting the next frame
     * from the walking sprite list.
     */
    playWalkingFrame() {
        const index = this.currentImage % this.imgsWalking.length;
        const path = this.imgsWalking[index];

        this.img = this.imageCache[path];
        this.currentImage++;
    }

    /**
     * Returns whether the chicken is dead (energy depleted).
     *
     * @returns {boolean} True if the chicken has no energy left.
     */
    isDead() {
        return this.energy <= 0;
    }
}
