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

    maxBottles = 10;
    coinCount = 0;
    maxCoins = 15;
    bottleCount = 0;
    flyingBottles = [];

    statusBar = [
        new StatusBar(ImageHub.statusBar.health, 40, 0, true),
        new StatusBar(ImageHub.statusBar.coins, 40, 45, false),
        new StatusBar(ImageHub.statusBar.bottle, 40, 90, false)
    ];

    lastThrowTime = 0;
    throwCooldown = 500;
    alertSoundPlayed = false;

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
        for (let i = 0; i < this.maxBottles; i++) {
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

            this.checkCollisions();
            this.checkBottlePickup();
            this.checkThrowObjects();
            this.checkCoinPickup();
            this.checkBottleHits();
            this.removeDeadEnemies();
            this.checkEndbossTrigger();
            this.checkEndbossAttack();
        }, 100);
    }

    /**
     * Loop that updates the endboss behavior independently.
     */
    startBossLoop() {
        this.interval2 = this.setIntervalTracked(() => {
            if (this.gameStopped) return;

            const boss = this.level.enemies.find(e => e.isEndboss && !e.dead);
            if (boss) boss.updateBehavior(this.character);
        }, 100);
    }

    /**
     * Checks whether the character collides with any bottle.
     */
    checkBottlePickup() {
        this.character.getRealFrame();
        this.level.bottles.forEach((bottle, index) => {
            bottle.getRealFrame();
            if (this.character.isColliding(bottle)) {
                this.handleBottlePickup(index);
            }
        });
    }

    /**
     * Handles bottle pickup: plays sound, increases count,
     * removes bottle, updates UI.
     *
     * @param {number} index - Index of the bottle in the array.
     */
    handleBottlePickup(index) {
        if (this.bottleCount >= this.maxBottles) return;

        SoundManager.play(this.soundBottleCollect);
        this.bottleCount++;
        this.level.bottles.splice(index, 1);
        this.updateBottleStatusBar();
    }

    /**
     * Checks whether the character collides with any coin.
     */
    checkCoinPickup() {
        this.character.getRealFrame();
        this.level.coins.forEach((coin, index) => {
            coin.getRealFrame();
            if (this.character.isColliding(coin)) {
                this.handleCoinPickup(index);
            }
        });
    }

    /**
     * Handles coin pickup: plays sound, increases count,
     * removes coin, updates UI.
     *
     * @param {number} index - Index of the coin in the array.
     */
    handleCoinPickup(index) {
        SoundManager.play(this.soundCoinCollect);
        this.coinCount++;
        this.level.coins.splice(index, 1);
        this.updateCoinStatusBar();
    }

    /**
     * Checks whether the player can throw a bottle.
     */
    checkThrowObjects() {
        const now = Date.now();
        if (this.character.isHurt()) return;

        const canThrow =
            Keyboard.D &&
            this.bottleCount > 0 &&
            now - this.lastThrowTime >= this.throwCooldown;

        if (canThrow) this.throwBottle(now);
    }

    /**
     * Executes the bottle throw sequence.
     *
     * @param {number} now - Current timestamp.
     */
    throwBottle(now) {
        SoundManager.play(this.soundBottleThrow);

        const bottle = this.createThrownBottle();
        this.initThrownBottle(bottle);
        this.registerBottleThrow(bottle, now);
    }

    /**
     * Creates a new bottle at the character's throw position.
     *
     * @returns {Bottle} The new bottle instance.
     */
    createThrownBottle() {
        const offsetX = this.character.otherDirection ? -20 : 20;
        const x = this.character.x + offsetX;
        const y = this.character.y + 80;

        return new Bottle(x, y);
    }

    /**
     * Initializes a thrown bottle by assigning world and starting movement.
     *
     * @param {Bottle} bottle - The bottle to initialize.
     */
    initThrownBottle(bottle) {
        bottle.world = this;
        if (bottle.initAfterWorldSet) bottle.initAfterWorldSet();
        bottle.throw(this.character.otherDirection);
    }

    /**
     * Registers the thrown bottle and updates counters and UI.
     *
     * @param {Bottle} bottle - The thrown bottle.
     * @param {number} now - Timestamp of the throw.
     */
    registerBottleThrow(bottle, now) {
        this.flyingBottles.push(bottle);
        this.bottleCount--;
        this.lastThrowTime = now;
        this.character.lastMoveTime = now;
        this.updateBottleStatusBar();
    }

    /**
     * Updates the bottle status bar based on current bottle count.
     */
    updateBottleStatusBar() {
        const percentage = (this.bottleCount / this.maxBottles) * 100;
        this.statusBar[2].setPercentage(
            percentage,
            this.statusBar[2].imgsStatusBottles
        );
    }

    /**
     * Updates the coin status bar based on current coin count.
     */
    updateCoinStatusBar() {
        const percentage = (this.coinCount / this.maxCoins) * 100;
        this.statusBar[1].setPercentage(
            percentage,
            this.statusBar[1].imgsStatusCoins
        );
    }

    /**
     * Checks collisions between the character and all enemies.
     */
    checkCollisions() {
        this.character.getRealFrame();
        this.level.enemies.forEach(enemy => {
            enemy.getRealFrame();
            this.handleEnemyCollision(enemy);
        });
    }

    /**
     * Handles collision logic between the character and a single enemy.
     *
     * @param {HitableObject} enemy - The enemy to check.
     */
    handleEnemyCollision(enemy) {
        if (enemy.isDead()) return;
        if (!this.character.isColliding(enemy)) return;
        if (enemy.isEndboss) return;

        const falling = this.character.speedY < 0;
        if (falling) {
            this.handleStompKill(enemy);
            return;
        }

        this.handleEnemyHitsPlayer();
    }

    /**
     * Handles killing an enemy by jumping on it.
     *
     * @param {HitableObject} enemy - The enemy to kill.
     */
    handleStompKill(enemy) {
        enemy.die();
        this.character.speedY = 12;
        this.character.wasOnGround = false;
        this.character.lastMoveTime = Date.now();
    }

    /**
     * Handles the player taking damage from an enemy.
     */
    handleEnemyHitsPlayer() {
        if (this.character.isAboveGround()) return;

        this.character.hit();
        this.statusBar[0].setPercentage(
            this.character.energy,
            this.statusBar[0].imgsStatusHealth
        );
    }

    /**
     * Checks whether any thrown bottle hits an enemy.
     */
    checkBottleHits() {
        this.flyingBottles.forEach(bottle => {
            if (bottle.isExploded) return;

            bottle.getRealFrame();
            this.checkBottleHitEnemies(bottle);
        });

        this.flyingBottles =
            this.flyingBottles.filter(b => !b.markedForDeletion);
    }

    /**
     * Checks a single bottle against all enemies.
     *
     * @param {Bottle} bottle - The bottle to test.
     */
    checkBottleHitEnemies(bottle) {
        for (let enemy of this.level.enemies) {
            enemy.getRealFrame();
            if (!enemy.isDead() && bottle.isColliding(enemy)) {
                bottle.explode();
                this.handleBottleHitEnemy(enemy);
                return;
            }
        }
    }

    /**
     * Handles the result of a bottle hitting an enemy.
     *
     * @param {HitableObject} enemy - The enemy that was hit.
     */
    handleBottleHitEnemy(enemy) {
        if (enemy instanceof Endboss) {
            this.handleEndbossHit(enemy);
        } else {
            enemy.die();
        }
    }

    /**
     * Handles damage logic when the endboss is hit by a bottle.
     *
     * @param {Endboss} enemy - The endboss instance.
     */
    handleEndbossHit(enemy) {
        enemy.lastHit = Date.now();
        enemy.hitsTaken++;
        SoundManager.play(this.soundEndbossHurt);

        const percentage =
            ((enemy.hitsToKill - enemy.hitsTaken) / enemy.hitsToKill) * 100;

        const bossBar = this.statusBar[this.statusBar.length - 1];
        bossBar.setPercentage(percentage, ImageHub.statusBar.endboss);

        if (enemy.hitsTaken >= enemy.hitsToKill) enemy.die();
    }

    /**
     * Checks whether the endboss should be activated.
     */
    checkEndbossTrigger() {
        const boss = this.level.enemies.find(e => e.isEndboss);
        if (!boss || boss.activated) return;

        if (this.character.x > 2500) {
            this.activateEndboss(boss);
        }
    }

    /**
     * Activates the endboss, plays alert sound, adds UI bar,
     * and schedules movement start.
     *
     * @param {Endboss} boss - The endboss instance.
     */
    activateEndboss(boss) {
        boss.activated = true;
        boss.preparing = true;

        this.playEndbossAlert(boss);
        this.addEndbossStatusBar();
        this.scheduleEndbossStart(boss);
    }

    /**
     * Plays the endboss alert sound once.
     *
     * @param {Endboss} boss - The endboss instance.
     */
    playEndbossAlert(boss) {
        if (boss.alertSoundPlayed) return;

        SoundManager.play(this.soundEndbossAlert);
        boss.alertSoundPlayed = true;
    }

    /**
     * Adds the endboss health bar to the UI.
     */
    addEndbossStatusBar() {
        this.statusBar.push(
            new StatusBar(
                ImageHub.statusBar.endboss,
                this.canvas.width - 240,
                0,
                true
            )
        );
    }

    /**
     * Schedules the endboss to begin moving after its alert animation.
     *
     * @param {Endboss} boss - The endboss instance.
     */
    scheduleEndbossStart(boss) {
        setTimeout(() => {
            boss.preparing = false;
            boss.speed = 4;
        }, 2000);
    }

    /**
     * Stops the boss from moving when close enough to the player.
     */
    checkEndbossAttack() {
        const boss = this.level.enemies.find(e => e.isEndboss);
        if (!boss || boss.dead) return;

        const distance = Math.abs(boss.x - this.character.x);
        if (distance < boss.attackRange) boss.speed = 0;
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
        this.addObjectsToMap(this.flyingBottles);
        this.addObjectsToMap(this.level.coins);
        this.ctx.translate(-this.camera_x, 0);
    }

    /**
     * Draws all UI elements such as status bars.
     */
    drawUI() {
        this.addObjectsToMap(this.statusBar);
    }

    /**
     * Schedules the next animation frame.
     */
    scheduleNextFrame() {
        requestAnimationFrame(() => this.draw());
    }

    /**
     * Removes enemies that have been marked for deletion.
     */
    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(
            e => !e.markedForDeletion
        );
    }

    /**
     * Draws an array of objects onto the canvas.
     *
     * @param {DrawableObject[]} objects - Objects to draw.
     */
    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    /**
     * Draws a single object, flipping it horizontally if needed.
     *
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

        this.level.enemies.forEach(e => this.assignWorld(e));
        this.level.clouds.forEach(c => this.assignWorld(c));
        this.level.backgroundObjects.forEach(bg => this.assignWorld(bg));
        this.level.clouds.forEach(c => this.assignWorld(c));
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