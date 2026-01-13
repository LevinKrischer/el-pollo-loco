/**
 * Base class for all drawable game objects.
 * Provides image loading, caching, and drawing functionality.
 */
class DrawableObject {

    img;
    imageCache = {};
    x = 120;
    y = 250;
    currentImage = 0;
    height = 150;
    width = 100;

    /**
     * Loads a single image and assigns it as the object's current sprite.
     *
     * @param {string} path - Path to the image file.
     */
    loadImage(path) {
        this.img = new Image();
        this.img.src = path;
    }

    /**
     * Draws the object's current image onto the given canvas context.
     *
     * @param {CanvasRenderingContext2D} ctx - The rendering context to draw on.
     */
    draw(ctx) {
        ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }

    /**
     * Loads multiple images into the internal image cache for animation use.
     *
     * @param {string[]} arr - Array of image file paths.
     */
    loadImages(arr) {
        arr.forEach((path) => {
            const img = new Image();
            img.src = path;
            this.imageCache[path] = img;
        });
    }
}