/**
 * Base class for all objects that can be thrown by the player.
 * Extends HitableObject to support collisions, damage, and gravity.
 */
class ThrowableObject extends HitableObject {

    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    /**
     * Creates a new throwable object at the given world coordinates.
     *
     * @param {number} x - Horizontal world position.
     * @param {number} y - Vertical world position.
     */
    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 80;
    }

    /**
     * Initiates the throwing motion:
     * - marks the object as thrown
     * - applies upward velocity
     * - starts gravity simulation
     * - moves horizontally depending on the facing direction
     *
     * @param {boolean} facingLeft - Whether the throw direction is left.
     */
    throw(facingLeft) {
        this.isThrown = true;

        this.speedY = 15;
        this.applyGravity();

        const direction = facingLeft ? -10 : 10;

        this.throwInterval = this.world.setIntervalTracked(() => {
            this.x += direction;
        }, 25);
    }
}
