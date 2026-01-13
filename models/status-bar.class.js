/**
 * A drawable status bar used to display values such as health,
 * collected coins, bottle count, or boss health. The bar updates
 * its displayed image based on the current percentage value.
 */
class StatusBar extends DrawableObject {

    imgsStatusHealth = ImageHub.statusBar.health;
    imgsStatusCoins = ImageHub.statusBar.coins;
    imgsStatusBottles = ImageHub.statusBar.bottle;
    imgStatusBossHealth = ImageHub.statusBar.endboss;

    percentage = 100;

    /**
     * Creates a new status bar of the given type at the specified position.
     * Loads all images for the bar and initializes its fill level.
     *
     * @param {string[]} type - Array of image paths representing bar states.
     * @param {number} x - Horizontal position on the screen.
     * @param {number} y - Vertical position on the screen.
     * @param {boolean} full - Whether the bar should start at 100%.
     */
    constructor(type, x, y, full) {
        super();
        this.type = type;
        this.loadImages(type);
        this.x = x;
        this.y = y;
        this.width = 200;
        this.height = 60;
        this.setPercentage(full ? 100 : 0, type);
    }

    /**
     * Updates the bar's percentage value and selects the appropriate
     * image based on predefined thresholds (0, 20, 40, 60, 80, 100).
     *
     * @param {number} _percentage - New percentage value (0–100).
     * @param {string[]} _type - Array of image paths for the bar.
     */
    setPercentage(_percentage, _type) {
        this.percentage = _percentage;

        if (this.percentage == 100) {
            this.loadImage(_type[5]);
        } else if (this.percentage > 80) {
            this.loadImage(_type[4]);
        } else if (this.percentage > 60) {
            this.loadImage(_type[3]);
        } else if (this.percentage > 40) {
            this.loadImage(_type[2]);
        } else if (this.percentage > 20) {
            this.loadImage(_type[1]);
        } else if (this.percentage == 0) {
            this.loadImage(_type[0]);
        }
    }
}
