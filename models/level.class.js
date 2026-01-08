class Level {
    enemies;
    clouds;
    backgroundObjects;
    bottles;
    coins;
    level_end_x = 2800;

    constructor(_enemies, _clouds, _backgroundObjects, _bottles, _coins) {
        this.enemies = _enemies;
        this.clouds = _clouds;
        this.backgroundObjects = _backgroundObjects;
        this.bottles = _bottles;
        this.coins = _coins;
    }
}
