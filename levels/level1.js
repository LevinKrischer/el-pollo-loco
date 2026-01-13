/**
 * Creates and returns the configuration for Level 1 of the game.
 *
 * The level consists of:
 * - A set of enemies (Chickens, Small Chickens, Endboss)
 * - A set of clouds for parallax sky movement
 * - A sequence of background layers for multi‑layer parallax scrolling
 * - Empty arrays for collectibles and throwable objects (not used in Level 1)
 *
 * @returns {Level} A fully constructed Level instance containing all
 *                  enemies, clouds, and background objects for Level 1.
 */
function createLevel1() {
    return new Level(
        [
            // Enemies
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new Chicken(),
            new ChickenSmall(),
            new ChickenSmall(),
            new ChickenSmall(),
            new ChickenSmall(),
            new ChickenSmall(),
            new ChickenSmall(),
            new ChickenSmall(),
            new ChickenSmall(),
            new Endboss()
        ],
        [
            // Clouds
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud(),
            new Cloud()
        ],
        [
            // Background layers (parallax scrolling)
            new BackgroundObject(ImageHub.background.air[0], -720),
            new BackgroundObject(ImageHub.background.third[1], -720),
            new BackgroundObject(ImageHub.background.second[1], -720),
            new BackgroundObject(ImageHub.background.first[1], -720),

            new BackgroundObject(ImageHub.background.air[0], 0),
            new BackgroundObject(ImageHub.background.third[0], 0),
            new BackgroundObject(ImageHub.background.second[0], 0),
            new BackgroundObject(ImageHub.background.first[0], 0),

            new BackgroundObject(ImageHub.background.air[0], 720),
            new BackgroundObject(ImageHub.background.third[1], 720),
            new BackgroundObject(ImageHub.background.second[1], 720),
            new BackgroundObject(ImageHub.background.first[1], 720),

            new BackgroundObject(ImageHub.background.air[0], 1440),
            new BackgroundObject(ImageHub.background.third[0], 1440),
            new BackgroundObject(ImageHub.background.second[0], 1440),
            new BackgroundObject(ImageHub.background.first[0], 1440),

            new BackgroundObject(ImageHub.background.air[0], 2160),
            new BackgroundObject(ImageHub.background.third[1], 2160),
            new BackgroundObject(ImageHub.background.second[1], 2160),
            new BackgroundObject(ImageHub.background.first[1], 2160),

            new BackgroundObject(ImageHub.background.air[0], 2880),
            new BackgroundObject(ImageHub.background.third[0], 2880),
            new BackgroundObject(ImageHub.background.second[0], 2880),
            new BackgroundObject(ImageHub.background.first[0], 2880)
        ],
        [],
        []
    );
}