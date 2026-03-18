class UIManager {

    constructor(world) {
        this.world = world;
        this.statusBar = [
            new StatusBar(ImageHub.statusBar.health, 40, 0, true),
            new StatusBar(ImageHub.statusBar.coins, 40, 45, false),
            new StatusBar(ImageHub.statusBar.bottle, 40, 90, false)
        ];
    }

    /**
     * Updates the bottle status bar.
     * @param {number} bottleCount - Current bottle count.
     * @param {number} maxBottleInventory - Max bottle inventory.
     */
     updateBottleStatusBar(bottleCount, maxBottleInventory) {
        const percentage = (bottleCount / maxBottleInventory) * 100;
        this.statusBar[2].setPercentage(percentage,this.statusBar[2].imgsStatusBottles);
    }

    /**
     * Updates the coin status bar.
     * @param {number} coinCount - Current coin count.
     * @param {number} maxCoins - Max coin count.
     */
     updateCoinStatusBar(coinCount, maxCoins) {
        const percentage = (coinCount / maxCoins) * 100;
        this.statusBar[1].setPercentage(percentage,this.statusBar[1].imgsStatusCoins);
    }

    /**
     * Updates the health status bar based on current character health.
     */
     updateHealthStatusBar() {
        const percentage =
            (this.world.character.energy / this.world.character.maxEnergy) * 100;
        this.statusBar[0].setPercentage( percentage, this.statusBar[0].imgsStatusHealth);
    }

    /**
     * Adds the endboss status bar once.
     */
     addEndbossStatusBar() {
        if (this.statusBar.length > 3) return;
        if (typeof setGameplayButtonsVisibility === 'function') setGameplayButtonsVisibility(false);
        this.statusBar.push(this.createEndbossStatusBarInstance());
    }

    /**
     * Creates and returns a fully configured endboss status bar instance,
     * positioned at the right edge of the canvas.
     * @returns {StatusBar} The endboss health bar.
     */
     createEndbossStatusBarInstance() {
        return new StatusBar(
            ImageHub.statusBar.endboss,
            this.world.canvas.width - 240,
            0,
            true
        );
    }

    /**
     * Updates the endboss status bar.
     * @param {Endboss} boss - Endboss instance.
     */
     updateEndbossStatusBar(boss) {
        const percentage = ((boss.hitsToKill - boss.hitsTaken) / boss.hitsToKill) * 100;
        const bossBar = this.statusBar[this.statusBar.length - 1];
        bossBar.setPercentage(percentage, ImageHub.statusBar.endboss);
    }
}
