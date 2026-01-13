/**
 * A standard chicken enemy that walks left continuously and switches
 * between walking and death animations. Inherits hit detection and
 * damage logic from HitableObject.
 */
class Chicken extends HitableObject {

    imgsWalking = ImageHub.chicken.walking;
    imgsDead = ImageHub.chicken.dead;
    currentImage = 0;
    height = 60;
    width = 60;
    y = 365;
    energy = 1;

    offset = { top: 0, right: 0, bottom: 10, left: 0 };

    constructor() {
        super();
        this.loadImage(ImageHub.chicken.walking[0]);
        this.loadImages(this.imgsWalking);
        this.loadImages(this.imgsDead);

        // Random spawn position and movement speed
        this.x = 600 + Math.random() * 3000;
        this.speed = 0.15 + Math.random() * 0.5;
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
                return;
            }
            this.playWalkingFrame();
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