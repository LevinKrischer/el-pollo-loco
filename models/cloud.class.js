/**
 * A simple background cloud that continuously moves left across the screen.
 * Inherits movement behavior from MoveableObject.
 */
class Cloud extends MoveableObject {

    constructor() {
        super();
        this.loadImage("assets/img/5_background/layers/4_clouds/1.png");

        // Random horizontal spawn position
        this.x = Math.random() * 3600;
    }

    /**
     * Called once the world reference is assigned.
     * Starts the cloud's movement animation.
     */
    initAfterWorldSet() {
        this.animate();
    }

    /**
     * Moves the cloud left continuously.
     */
    animate() {
        this.moveLeft();
    }
}