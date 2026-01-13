/**
 * Represents a complete game level, containing all world objects such as
 * enemies, clouds, background layers, bottles, and coins. The level acts
 * as a structured container that the World class uses to spawn and manage
 * all entities during gameplay.
 */
class Level {

    /**
     * Creates a new level with the given sets of world objects.
     *
     * @param {HitableObject[]} _enemies - All enemies that appear in the level.
     * @param {MoveableObject[]} _clouds - Cloud objects used for background motion.
     * @param {DrawableObject[]} _backgroundObjects - Parallax background layers.
     * @param {ThrowableObject[]} _bottles - Bottles placed in the level.
     * @param {MoveableObject[]} _coins - Collectible coins.
     */
    constructor(_enemies, _clouds, _backgroundObjects, _bottles, _coins) {
        this.enemies = _enemies;
        this.clouds = _clouds;
        this.backgroundObjects = _backgroundObjects;
        this.bottles = _bottles;
        this.coins = _coins;
    }
}