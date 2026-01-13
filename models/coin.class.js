/**
 * A collectible coin that rotates continuously.
 * Inherits movement and animation utilities from MoveableObject.
 */
class Coin extends MoveableObject {

    width = 80;
    height = 80;

    offset = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };

    /**
     * Creates a new coin at the given world coordinates and loads
     * all rotation animation frames.
     *
     * @param {number} x - Horizontal world position.
     * @param {number} y - Vertical world position.
     */
    constructor(x, y) {
        super();
        this.loadImage(ImageHub.coin.rotating[0]);
        this.loadImages(ImageHub.coin.rotating);
        this.x = x;
        this.y = y;
    }

    /**
     * Called once the world reference is assigned.
     * Starts the rotation animation loop.
     */
    initAfterWorldSet() {
        this.animate();
    }

    /**
     * Plays the rotating animation in a timed loop.
     */
    animate() {
        this.world.setIntervalTracked(() => {
            this.playAnimation(ImageHub.coin.rotating);
        }, 200);
    }
}