class PickupManager {
    bottleCount = 0;
    coinCount = 0;

    /**
     * @param {World} world - The game world.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks whether the character collides with any bottle.
     */
    checkBottlePickup() {
        this.world.character.getRealFrame();
        this.world.level.bottles.forEach((bottle, index) => {
            bottle.getRealFrame();
            if (this.world.character.isColliding(bottle)) {
                this.handleBottlePickup(index);
            }
        });
    }

    /**
     * Handles bottle pickup and updates bottle UI.
     *
     * @param {number} index - Index of the bottle in the array.
     */
    handleBottlePickup(index) {
        if (this.bottleCount >= this.world.maxBottleInventory) return;

        SoundManager.play(this.world.soundBottleCollect);
        this.bottleCount++;
        this.world.level.bottles.splice(index, 1);
        this.world.uiManager.updateBottleStatusBar(
            this.bottleCount,
            this.world.maxBottleInventory
        );
    }

    /**
     * Checks whether the character collides with any coin.
     */
    checkCoinPickup() {
        this.world.character.getRealFrame();
        this.world.level.coins.forEach((coin, index) => {
            coin.getRealFrame();
            if (this.world.character.isColliding(coin)) {
                this.handleCoinPickup(index);
            }
        });
    }

    /**
     * Handles coin pickup and updates coin UI.
     *
     * @param {number} index - Index of the coin in the array.
     */
    handleCoinPickup(index) {
        SoundManager.play(this.world.soundCoinCollect);
        this.coinCount++;
        this.world.level.coins.splice(index, 1);
        this.world.uiManager.updateCoinStatusBar(
            this.coinCount,
            this.world.maxCoins
        );
    }
}
