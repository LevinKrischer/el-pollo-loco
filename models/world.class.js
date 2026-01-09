class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
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
    throwCooldown = 500; // 0,5 Sekunden
    alertSoundPlayed = false;

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;

        this.setWorld();
        this.spawnBottles();
        this.spawnCoins();

        this.draw();
        this.run();
    }

    spawnBottles() {
        for (let i = 0; i < this.maxBottles; i++) {
            const x = 200 + Math.random() * 2400;
            const y = 350;
            this.level.bottles.push(new Bottle(x, y));
        }
    }

    checkBottleHits() {
        this.flyingBottles.forEach((bottle) => {

            if (bottle.isExploded) return;

            bottle.getRealFrame();

            for (let enemy of this.level.enemies) {
                enemy.getRealFrame();

                if (!enemy.isDead() && bottle.isColliding(enemy)) {

                    bottle.explode();

                    if (enemy instanceof Endboss) {

                        // ❗ Hurt-State aktivieren
                        enemy.lastHit = Date.now();

                        enemy.hitsTaken++;
                        SoundManager.play(SoundHub.endboss.hurt, 1);

                        const percentage = ((enemy.hitsToKill - enemy.hitsTaken) / enemy.hitsToKill) * 100;

                        const bossBar = this.statusBar[this.statusBar.length - 1];
                        bossBar.setPercentage(percentage, ImageHub.statusBar.endboss);

                        if (enemy.hitsTaken >= enemy.hitsToKill) {
                            enemy.die();
                        }

                    } else {
                        // ❗ Alle anderen Gegner (Chicken, ChickenSmall, etc.)
                        enemy.die();
                    }

                    // ❗ WICHTIG: Keine weiteren Kollisionen prüfen
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

            // Zufällige Höhe auswählen
            const y = coinHeights[Math.floor(Math.random() * coinHeights.length)];

            this.level.coins.push(new Coin(x, y));
        }
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkBottlePickup();
            this.checkThrowObjects();
            this.checkCoinPickup();
            this.checkBottleHits();
            this.removeDeadEnemies();
            this.checkEndbossTrigger();
            this.checkEndbossAttack();
        }, 100);
        setInterval(() => { const boss = this.level.enemies.find(e => e.isEndboss); if (boss) { boss.updateBehavior(this.character); } }, 100);
    }

    checkBottlePickup() {
        this.character.getRealFrame();

        this.level.bottles.forEach((bottle, index) => {
            bottle.getRealFrame();

            if (this.character.isColliding(bottle)) {

                if (this.bottleCount < this.maxBottles) {

                    // 💡 Collect-Sound
                    SoundManager.play(SoundHub.collectibles.bottle, 0.4);

                    this.bottleCount++;
                    this.level.bottles.splice(index, 1);

                    this.updateBottleStatusBar();
                    console.log("Flasche eingesammelt!");

                } else {
                    console.log("Inventar voll – Flasche bleibt liegen");
                }
            }
        });
    }


    checkCoinPickup() {
        this.character.getRealFrame();

        this.level.coins.forEach((coin, index) => {
            coin.getRealFrame();

            if (this.character.isColliding(coin)) {

                // 💰 Coin-Sound
                SoundManager.play(SoundHub.collectibles.coin, 0.4);

                this.coinCount++;
                this.level.coins.splice(index, 1);

                this.updateCoinStatusBar();
                console.log("Coin eingesammelt!");
            }
        });
    }


    checkThrowObjects() {
        const now = Date.now();

        // ❗ Pepe darf NICHT werfen, wenn er verletzt ist
        if (this.character.isHurt()) return;

        // ❗ Cooldown prüfen
        if (Keyboard.D && this.bottleCount > 0 && now - this.lastThrowTime >= this.throwCooldown) {

            // ❗ Throw-Sound (GENAU hier!)
            SoundManager.play(SoundHub.collectibles.bottleThrow, 0.4);

            // ❗ Startposition abhängig von Blickrichtung
            let offsetX = this.character.otherDirection ? -20 : 20;

            let bottle = new Bottle(
                this.character.x + offsetX,
                this.character.y + 80
            );

            // ❗ Richtung an Bottle übergeben
            bottle.throw(this.character.otherDirection);

            this.flyingBottles.push(bottle);
            this.bottleCount--;

            this.lastThrowTime = now;

            this.updateBottleStatusBar();
        }
    }


    updateBottleStatusBar() {
        const percentage = (this.bottleCount / this.maxBottles) * 100;
        this.statusBar[2].setPercentage(percentage, this.statusBar[2].imgsStatusBottles);
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

            if (!enemy.isDead() && this.character.isColliding(enemy)) {

                // ❗ Endboss verursacht KEINEN Kontaktschaden
                if (enemy.isEndboss) return;

                const isFalling = this.character.speedY < 0;

                if (isFalling && !enemy.isEndboss) {
                    enemy.die();
                    console.log("STOMP! Gegner besiegt");
                    return;
                }

                if (enemy.isDead()) return;

                // SCHADEN (nur wenn NICHT gestomped)
                this.character.hit();
                this.statusBar[0].setPercentage(
                    this.character.energy,
                    this.statusBar[0].imgsStatusHealth
                );
                console.log("Pepe wurde getroffen");
            }
        });
    }

    checkEndbossTrigger() {
        // Endboss aus enemies holen
        const boss = this.level.enemies.find(e => e.isEndboss);

        // Falls noch nicht gespawnt oder nicht gefunden → abbrechen
        if (!boss) return;

        // Wenn Boss schon aktiviert wurde → nichts tun
        if (boss.activated) return;

        // Trigger-Position
        if (!boss.activated && this.character.x > 2500) {

            boss.activated = true;
            boss.preparing = true;

            // 🔊 ALERT-SOUND nur einmal
            if (!boss.alertSoundPlayed) {
                SoundManager.play(SoundHub.endboss.alert, 0.7);
                boss.alertSoundPlayed = true;
            }

            // Endboss-Statusbar einblenden
            this.statusBar.push(
                new StatusBar(ImageHub.statusBar.endboss, this.canvas.width - 200, 0, true)
            );

            // Nach 2 Sekunden beginnt der Boss zu laufen
            setTimeout(() => {
                boss.preparing = false;
                boss.speed = 4;
            }, 2000);
        }
    }


    checkEndbossAttack() {
        const boss = this.level.enemies.find(e => e.isEndboss);
        if (!boss || boss.dead) return;

        const pepe = this.character;

        const distance = Math.abs(boss.x - pepe.x);

        // Wenn Pepe in Reichweite ist → stehen bleiben + angreifen
        if (distance < boss.attackRange) {
            boss.speed = 0;
        }
    }

    checkEndbossBehavior() {
        const boss = this.level.enemies.find(e => e.isEndboss);
        if (boss) boss.updateBehavior(this.character);
    }

    draw() {
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

        requestAnimationFrame(() => this.draw()
        );
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
        this.character.world = this;
    }
}