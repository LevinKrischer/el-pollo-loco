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

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.level = createLevel1();

        this.setWorld();
        this.spawnBottles();
        this.spawnCoins();
    }

    start() {
        this.draw();
        this.run();
    }

    setIntervalTracked(fn, time) {
        const id = setInterval(fn, time);
        this.intervals.push(id);
        return id;
    }

    setTimeoutTracked(callback, time) {
        const id = setTimeout(callback, time);
        this.timeouts.push(id);
        return id;
    }

    spawnBottles() {
    for (let i = 0; i < this.maxBottles; i++) {
        const x = 200 + Math.random() * 2400;
        const y = 350;

        const bottle = new Bottle(x, y);
        this.assignWorld(bottle);
        this.level.bottles.push(bottle);
    }
}

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

    run() {
        this.startMainLoop();
        this.startBossLoop();
    }

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

    startBossLoop() {
        this.interval2 = this.setIntervalTracked(() => {
            if (this.gameStopped) return;

            const boss = this.level.enemies.find(e => e.isEndboss && !e.dead);
            if (boss) boss.updateBehavior(this.character);
        }, 100);
    }

    checkBottlePickup() {
        this.character.getRealFrame();
        this.level.bottles.forEach((bottle, index) => {
            bottle.getRealFrame();
            if (this.character.isColliding(bottle)) {
                this.handleBottlePickup(index);
            }
        });
    }

    handleBottlePickup(index) {
        if (this.bottleCount >= this.maxBottles) return;

        SoundManager.play(this.soundBottleCollect);
        this.bottleCount++;
        this.level.bottles.splice(index, 1);
        this.updateBottleStatusBar();
    }

    checkCoinPickup() {
        this.character.getRealFrame();
        this.level.coins.forEach((coin, index) => {
            coin.getRealFrame();
            if (this.character.isColliding(coin)) {
                this.handleCoinPickup(index);
            }
        });
    }

    handleCoinPickup(index) {
        SoundManager.play(this.soundCoinCollect);
        this.coinCount++;
        this.level.coins.splice(index, 1);
        this.updateCoinStatusBar();
    }

    checkThrowObjects() {
        const now = Date.now();
        if (this.character.isHurt()) return;

        const canThrow =
            Keyboard.D &&
            this.bottleCount > 0 &&
            now - this.lastThrowTime >= this.throwCooldown;

        if (canThrow) this.throwBottle(now);
    }

    throwBottle(now) {
        SoundManager.play(this.soundBottleThrow);

        const bottle = this.createThrownBottle();
        this.initThrownBottle(bottle);
        this.registerBottleThrow(bottle, now);
    }

    createThrownBottle() {
        const offsetX = this.character.otherDirection ? -20 : 20;
        const x = this.character.x + offsetX;
        const y = this.character.y + 80;

        return new Bottle(x, y);
    }

    initThrownBottle(bottle) {
        bottle.world = this;
        if (bottle.initAfterWorldSet) bottle.initAfterWorldSet();
        bottle.throw(this.character.otherDirection);
    }

    registerBottleThrow(bottle, now) {
        this.flyingBottles.push(bottle);
        this.bottleCount--;
        this.lastThrowTime = now;
        this.character.lastMoveTime = now;
        this.updateBottleStatusBar();
    }

    updateBottleStatusBar() {
        const percentage = (this.bottleCount / this.maxBottles) * 100;
        this.statusBar[2].setPercentage(
            percentage,
            this.statusBar[2].imgsStatusBottles
        );
    }

    updateCoinStatusBar() {
        const percentage = (this.coinCount / this.maxCoins) * 100;
        this.statusBar[1].setPercentage(
            percentage,
            this.statusBar[1].imgsStatusCoins
        );
    }

    checkCollisions() {
        this.character.getRealFrame();
        this.level.enemies.forEach(enemy => {
            enemy.getRealFrame();
            this.handleEnemyCollision(enemy);
        });
    }

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

    handleStompKill(enemy) {
        enemy.die();
        this.character.speedY = 12;
        this.character.wasOnGround = false;
        this.character.lastMoveTime = Date.now();
    }

    handleEnemyHitsPlayer() {
        if (this.character.isAboveGround()) return;

        this.character.hit();
        this.statusBar[0].setPercentage(
            this.character.energy,
            this.statusBar[0].imgsStatusHealth
        );
    }

    checkBottleHits() {
        this.flyingBottles.forEach(bottle => {
            if (bottle.isExploded) return;

            bottle.getRealFrame();
            this.checkBottleHitEnemies(bottle);
        });

        this.flyingBottles =
            this.flyingBottles.filter(b => !b.markedForDeletion);
    }

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

    handleBottleHitEnemy(enemy) {
        if (enemy instanceof Endboss) {
            this.handleEndbossHit(enemy);
        } else {
            enemy.die();
        }
    }

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

    checkEndbossTrigger() {
        const boss = this.level.enemies.find(e => e.isEndboss);
        if (!boss || boss.activated) return;

        if (this.character.x > 2500) {
            this.activateEndboss(boss);
        }
    }

    activateEndboss(boss) {
        boss.activated = true;
        boss.preparing = true;

        this.playEndbossAlert(boss);
        this.addEndbossStatusBar();
        this.scheduleEndbossStart(boss);
    }

    playEndbossAlert(boss) {
        if (boss.alertSoundPlayed) return;

        SoundManager.play(this.soundEndbossAlert);
        boss.alertSoundPlayed = true;
    }

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

    scheduleEndbossStart(boss) {
        setTimeout(() => {
            boss.preparing = false;
            boss.speed = 4;
        }, 2000);
    }

    checkEndbossAttack() {
        const boss = this.level.enemies.find(e => e.isEndboss);
        if (!boss || boss.dead) return;

        const distance = Math.abs(boss.x - this.character.x);
        if (distance < boss.attackRange) boss.speed = 0;
    }

    draw() {
        if (this.gameStopped) return;

        this.prepareFrame();
        this.drawWorld();
        this.drawUI();
        this.scheduleNextFrame();
    }

    prepareFrame() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.translate(this.camera_x, 0);
        this.level.enemies.forEach(e => e.updatePosition());
    }

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

    drawUI() {
        this.addObjectsToMap(this.statusBar);
    }

    scheduleNextFrame() {
        requestAnimationFrame(() => this.draw());
    }

    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(
            e => !e.markedForDeletion
        );
    }

    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

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

    setWorld() {
        this.assignWorld(this.character);

        this.level.enemies.forEach(e => this.assignWorld(e));
        this.level.clouds.forEach(c => this.assignWorld(c));
        this.level.backgroundObjects.forEach(bg => this.assignWorld(bg));
        this.level.clouds.forEach(c => this.assignWorld(c));
        this.level.bottles.forEach(b => this.assignWorld(b));
        this.level.coins.forEach(c => this.assignWorld(c));
    }

    assignWorld(obj) {
        obj.world = this;
        if (obj.initAfterWorldSet) obj.initAfterWorldSet();
    }

    stopGame() {
        this.gameStopped = true;

        this.intervals.forEach(id => clearInterval(id));
        this.intervals = [];

        this.timeouts.forEach(id => clearTimeout(id));
        this.timeouts = [];

        cancelAnimationFrame(this.animationFrameId);
    }
}
