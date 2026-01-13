/**
 * Represents a static background layer used for parallax scrolling.
 * Inherits image‑loading and drawing behavior from DrawableObject.
 */
class BackgroundObject extends DrawableObject {

    /**
     * Creates a new background object at a given horizontal position.
     *
     * @param {string} imagePath - Path to the background image.
     * @param {number} x - Horizontal world position where the object is placed.
     */
    constructor(imagePath, x) {
        super().loadImage(imagePath);
        this.x = x;
        this.y = 0;
        this.width = 720;
        this.height = 480;
    }
}
