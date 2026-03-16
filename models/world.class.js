/**
 * The main game controller responsible for rendering, updating,
 * spawning objects, handling collisions, and managing the entire
 * game world state.
 */
class World {
    character = new Character();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    gameStopped = false;

    maxBottleInventory = 5;
    bottleSpawnCount = 12;
    maxCoins = 15;

    uiManager;
    pickupManager;
    collisionManager;
    bottleManager;
    endbossManager;

    soundBottleCollect = SoundHub.sfx.collectibles.bottle;
    soundBottleThrow = SoundHub.sfx.collectibles.bottleThrow;
    soundCoinCollect = SoundHub.sfx.collectibles.coin;
    soundEndbossHurt = SoundHub.sfx.endboss.hurt;
    soundEndbossAlert = SoundHub.sfx.endboss.alert;
    intervals = [];
    timeouts = [];

    /**
     * Initializes the world, loads the level, assigns world references,
     * and spawns initial bottles and coins.
     *
     * @param {HTMLCanvasElement} canvas - The canvas to render on.
     * @param {Keyboard} keyboard - The keyboard input handler.
     */
    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.level = createLevel1();
        this.uiManager = new UIManager(this);
        this.pickupManager = new PickupManager(this);
        this.collisionManager = new CollisionManager(this);
        this.bottleManager = new BottleManager(this);
        this.endbossManager = new EndbossManager(this);

        this.setWorld();
        this.spawnBottles();
        this.spawnCoins();
    }

    /**
     * Starts the rendering loop and the game logic loops.
     */
    start() {
        this.draw();
        this.run();
    }

    /**
     * Creates a tracked interval so it can be cleared when the game stops.
     *
     * @param {Function} fn - The function to run repeatedly.
     * @param {number} time - Interval duration in ms.
     * @returns {number} The interval ID.
     */
    setIntervalTracked(fn, time) {
        const id = setInterval(fn, time);
        this.intervals.push(id);
        return id;
    }

    /**
     * Creates a tracked timeout so it can be cleared when the game stops.
     *
     * @param {Function} callback - The function to run once.
     * @param {number} time - Timeout duration in ms.
     * @returns {number} The timeout ID.
     */
    setTimeoutTracked(callback, time) {
        const id = setTimeout(callback, time);
        this.timeouts.push(id);
        return id;
    }

    /**
     * Spawns bottles at random positions throughout the level.
     */
    spawnBottles() {
        for (let i = 0; i < this.bottleSpawnCount; i++) {
            const x = 200 + Math.random() * 2400;
            const y = 350;

            const bottle = new Bottle(x, y);
            this.assignWorld(bottle);
            this.level.bottles.push(bottle);
        }
    }

    /**
     * Spawns coins at random positions and heights.
     */
    spawnCoins() {
        const heights = [350, 300, 250, 200, 150];

        for (let i = 0; i < 20; i++) {
            const x = 200 + Math.random() * 3000;
            const y = heights[Math.floor(Math.random() * heights.length)];

            const coin = new Coin(x, y);
            this.assignWorld(coin);
            this.level.coins.push(coin);
        }
    }

    /**
     * Starts the main game loops: world logic and boss behavior.
     */
    run() {
        this.startMainLoop();
        this.startBossLoop();
    }

    /**
     * Main gameplay loop: handles collisions, pickups, throwing,
     * enemy removal, and boss triggers.
     */
    startMainLoop() {
        this.interval1 = this.setIntervalTracked(() => {
            if (this.gameStopped) return;

            this.collisionManager.checkCollisions();
            this.pickupManager.checkBottlePickup();
            this.bottleManager.checkThrowObjects();
            this.pickupManager.checkCoinPickup();
            this.bottleManager.checkBottleHits();
            this.collisionManager.removeDeadEnemies();
            this.endbossManager.checkEndbossTrigger();
            this.endbossManager.checkEndbossAttack();
        }, 100);
    }

    /**
     * Loop that updates the endboss behavior independently.
     */
    startBossLoop() {
        this.interval2 = this.setIntervalTracked(() => {
            if (this.gameStopped) return;

            this.endbossManager.updateBehavior();
        }, 100);
    }

    /**
     * Updates the health status bar based on the character's current health.
     */
    updateHealthStatusBar() {
        this.uiManager.updateHealthStatusBar();
    }

    /**
     * Main rendering function: clears frame, draws world and UI,
     * and schedules the next frame.
     */
    draw() {
        if (this.gameStopped) return;

        this.prepareFrame();
        this.drawWorld();
        this.drawUI();
        this.scheduleNextFrame();
    }

    /**
     * Prepares the canvas for the next frame and updates enemy positions.
     */
    prepareFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.level.enemies.forEach(e => e.updatePosition());
    }

    /**
     * Draws all world objects in the correct order.
     */
    drawWorld() {
        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.bottleManager.flyingBottles);
        this.addObjectsToMap(this.level.coins);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws all UI elements such as status bars.
     */
    drawUI() {
        this.addObjectsToMap(this.uiManager.statusBar);
    }

    /**
     * Schedules the next animation frame.
     */
    scheduleNextFrame() {
        this.animationFrameId = requestAnimationFrame(() => this.draw());
    }

    /**
     * Draws an array of objects onto the canvas.
     * @param {DrawableObject[]} objects - Objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Draws a single object, flipping it horizontally if needed.
     * @param {DrawableObject} obj - The object to draw.
     */
    addToMap(obj) {
        if (obj.otherDirection) {
            this.ctx.save();
            this.ctx.translate(obj.x + obj.width, 0);
            this.ctx.scale(-1, 1);

            const originalX = obj.x;
            obj.x = 0;
            obj.draw(this.ctx);
            obj.x = originalX;

            this.ctx.restore();
        } else {
            obj.draw(this.ctx);
        }
    }

    /**
     * Assigns the world reference to all objects in the level.
     */
    setWorld() {
        this.assignWorld(this.character);
        this.updateHealthStatusBar();

        this.level.enemies.forEach(e => this.assignWorld(e));
        this.level.clouds.forEach(c => this.assignWorld(c));
        this.level.backgroundObjects.forEach(bg => this.assignWorld(bg));
        this.level.bottles.forEach(b => this.assignWorld(b));
        this.level.coins.forEach(c => this.assignWorld(c));
    }

    /**
     * Assigns the world reference to a single object and calls its init hook.
     *
     * @param {Object} obj - Any game object with a world reference.
     */
    assignWorld(obj) {
        obj.world = this;
        if (obj.initAfterWorldSet) obj.initAfterWorldSet();
    }

    /**
     * Stops the game completely by clearing all intervals, timeouts,
     * and animation frames.
     */
    stopGame() {
        this.gameStopped = true;

        this.intervals.forEach(id => clearInterval(id));
        this.intervals = [];

        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts = [];

        cancelAnimationFrame(this.animationFrameId);
    }
}