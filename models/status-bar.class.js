class StatusBar extends DrawableObject {

    imgsStatusHealth = ImageHub.statusBar.health;
    imgsStatusCoins = ImageHub.statusBar.coins;
    imgsStatusBottles = ImageHub.statusBar.bottle;
    imgStatusBossHealth = ImageHub.statusBar.endboss;
    percentage = 50;

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
     * @param {number} _percentage - New percentage value (0â€“100).
     * @param {string[]} _type - Array of image paths for the bar.
     */
     setPercentage(_percentage, _type) {
        this.percentage = _percentage;
        this.loadImage(_type[this.resolveImageIndexForPercentage()]);
    }

    /**
     * Returns the image array index that matches the current percentage
     * using fixed thresholds: 0, 20, 40, 60, 80, 100.
     * @returns {number} Index between 0 and 5.
     */
     resolveImageIndexForPercentage() {
        if (this.percentage == 100) return 5;
        if (this.percentage >= 80) return 4;
        if (this.percentage >= 60) return 3;
        if (this.percentage >= 40) return 2;
        if (this.percentage >= 20) return 1;
        return 0;
    }
}

