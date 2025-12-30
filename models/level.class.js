class Level {
    enemies;
    clouds;
    backgroundObjects;
    level_end_x = 2900;

    constructor(_enemies, _clouds, _backgroundObjects) {
        this.enemies = _enemies;
        this.clouds = _clouds;
        this.backgroundObjects = _backgroundObjects;
    }
}