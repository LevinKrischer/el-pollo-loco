class World {
    character = new Character();
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    gameStopped = false;

    maxBottles = 7;
    coinCount = 0;
    maxCoins = 20;
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

    // --- SOUND REFERENCES ---
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

        this.level = createLevel1();   // ⬅️ jedes Mal ein frisches Level1

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
            this.level.bottles.push(new Bottle(x, y));
        }
    }

    checkBottleHits() {
        this.flyingBottles.forEach(bottle => {
            if (bottle.isExploded) return;

            bottle.getRealFrame();

            for (let enemy of this.level.enemies) {
                enemy.getRealFrame();

                if (!enemy.isDead() && bottle.isColliding(enemy)) {
                    bottle.explode();

                    if (enemy instanceof Endboss) {
                        enemy.lastHit = Date.now();
                        enemy.hitsTaken++;

                        SoundManager.play(this.soundEndbossHurt);

                        const percentage =
                            ((enemy.hitsToKill - enemy.hitsTaken) / enemy.hitsToKill) * 100;

                        const bossBar = this.statusBar[this.statusBar.length - 1];
                        bossBar.setPercentage(percentage, ImageHub.statusBar.endboss);

                        if (enemy.hitsTaken >= enemy.hitsToKill) {
                            enemy.die();
                        }
                    } else {
                        enemy.die();
                    }

                    return;
                }
            }
        });

        this.flyingBottles = this.flyingBottles.filter(b => !b.markedForDeletion);
    }

    spawnCoins() {
        const coinHeights = [350, 300, 250, 200, 150];

        for (let i = 0; i < 20; i++) {
            const x = 200 + Math.random() * 3000;
            const y = coinHeights[Math.floor(Math.random() * coinHeights.length)];
            this.level.coins.push(new Coin(x, y));
        }
    }

    run() {
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
                if (this.bottleCount < this.maxBottles) {
                    SoundManager.play(this.soundBottleCollect);

                    this.bottleCount++;
                    this.level.bottles.splice(index, 1);

                    this.updateBottleStatusBar();
                }
            }
        });
    }

    checkCoinPickup() {
        this.character.getRealFrame();

        this.level.coins.forEach((coin, index) => {
            coin.getRealFrame();

            if (this.character.isColliding(coin)) {
                SoundManager.play(this.soundCoinCollect);

                this.coinCount++;
                this.level.coins.splice(index, 1);

                this.updateCoinStatusBar();
            }
        });
    }

    checkThrowObjects() {
        const now = Date.now();

        if (this.character.isHurt()) return;

        if (Keyboard.D && this.bottleCount > 0 && now - this.lastThrowTime >= this.throwCooldown) {
            SoundManager.play(this.soundBottleThrow);

            const offsetX = this.character.otherDirection ? -20 : 20;

            const bottle = new Bottle(
                this.character.x + offsetX,
                this.character.y + 80
            );

            bottle.world = this;                 // ⭐ WICHTIG
            if (bottle.initAfterWorldSet) {
                bottle.initAfterWorldSet();      // ⭐ WICHTIG
            }

            bottle.throw(this.character.otherDirection);


            this.flyingBottles.push(bottle);
            this.bottleCount--;

            // ⭐ WICHTIG: Cooldown setzen!
            this.lastThrowTime = now;

            // ⭐ IdleLong abbrechen
            this.character.lastMoveTime = now;

            this.updateBottleStatusBar();
        }
    }


    updateBottleStatusBar() {
        const percentage = (this.bottleCount / this.maxBottles) * 100;
        this.statusBar[2].setPercentage(percentage, this.statusBar[2].imgsStatusBottles);
    }

    updateCoinStatusBar() {
        const percentage = (this.coinCount / this.maxCoins) * 100;
        this.statusBar[1].setPercentage(percentage, this.statusBar[1].imgsStatusCoins);
    }

    checkCollisions() {
        this.character.getRealFrame();

        this.level.enemies.forEach(enemy => {
            enemy.getRealFrame();

            if (!enemy.isDead() && this.character.isColliding(enemy)) {
                if (enemy.isEndboss) return;

                const isFalling = this.character.speedY < 0;

                if (isFalling) {
                    enemy.die();
                    this.character.speedY = 12;
                    this.character.wasOnGround = false;
                    this.character.lastMoveTime = Date.now();
                    return;
                }

                if (enemy.isDead()) return;

                if (!this.character.isAboveGround()) {
                    this.character.hit();
                    this.statusBar[0].setPercentage(
                        this.character.energy,
                        this.statusBar[0].imgsStatusHealth
                    );
                }
            }
        });
    }

    checkEndbossTrigger() {
        const boss = this.level.enemies.find(e => e.isEndboss);
        if (!boss || boss.activated) return;

        if (this.character.x > 2500) {
            boss.activated = true;
            boss.preparing = true;

            if (!boss.alertSoundPlayed) {
                SoundManager.play(this.soundEndbossAlert);
                boss.alertSoundPlayed = true;
            }

            this.statusBar.push(
                new StatusBar(ImageHub.statusBar.endboss, this.canvas.width - 240, 0, true)
            );

            setTimeout(() => {
                boss.preparing = false;
                boss.speed = 4;
            }, 2000);
        }
    }

    checkEndbossAttack() {
        const boss = this.level.enemies.find(e => e.isEndboss);
        if (!boss || boss.dead) return;

        const distance = Math.abs(boss.x - this.character.x);

        if (distance < boss.attackRange) {
            boss.speed = 0;
        }
    }

    draw() {
        if (this.gameStopped) return;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.level.enemies.forEach(enemy => enemy.updatePosition());

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);
        this.addObjectsToMap(this.level.bottles);

        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.flyingBottles);
        this.addObjectsToMap(this.level.coins);

        this.ctx.translate(-this.camera_x, 0);

        this.addObjectsToMap(this.statusBar);

        requestAnimationFrame(() => this.draw());
    }

    removeDeadEnemies() {
        this.level.enemies = this.level.enemies.filter(e => !e.markedForDeletion);
    }

    addObjectsToMap(objects) {
        objects.forEach(o => this.addToMap(o));
    }

    addToMap(movObj) {
        if (movObj.otherDirection) {
            this.ctx.save();
            this.ctx.translate(movObj.x + movObj.width, 0);
            this.ctx.scale(-1, 1);

            const originalX = movObj.x;
            movObj.x = 0;
            movObj.draw(this.ctx);
            movObj.x = originalX;

            this.ctx.restore();
        } else {
            movObj.draw(this.ctx);
        }
    }

    setWorld() {
        // Character
        this.character.world = this;
        if (this.character.initAfterWorldSet) {
            this.character.initAfterWorldSet();
        }

        // Enemies (Chicken, ChickenSmall, Endboss)
        this.level.enemies.forEach(enemy => {
            enemy.world = this;
            if (enemy.initAfterWorldSet) {
                enemy.initAfterWorldSet();
            }
        });

        // Clouds
        this.level.clouds.forEach(cloud => {
            cloud.world = this;
            if (cloud.initAfterWorldSet) {
                cloud.initAfterWorldSet();
            }
        });

        // Background Objects
        this.level.backgroundObjects.forEach(bg => {
            bg.world = this;
            if (bg.initAfterWorldSet) {
                bg.initAfterWorldSet();
            }
        });

        this.level.clouds.forEach(cloud => {
            cloud.world = this;
            if (cloud.initAfterWorldSet)
                cloud.initAfterWorldSet();
        });

        // Bottles on the ground
        this.level.bottles.forEach(bottle => {
            bottle.world = this;
            if (bottle.initAfterWorldSet) {
                bottle.initAfterWorldSet();
            }
        });

        // Coins
        this.level.coins.forEach(coin => {
            coin.world = this;
            if (coin.initAfterWorldSet) {
                coin.initAfterWorldSet();
            }
        });
    }


    stopGame() {
        this.gameStopped = true;

        this.intervals.forEach(id =>
            clearInterval(id));
        this.intervals = [];

        this.timeouts.forEach(id =>
            clearTimeout(id)); 
            this.timeouts = [];
        
        cancelAnimationFrame(this.animationFrameId);
    }

}
