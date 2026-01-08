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


    statusBar = [
        new StatusBar(ImageHub.statusBar.health, 40, 0, true),
        new StatusBar(ImageHub.statusBar.coins, 40, 45, false),
        new StatusBar(ImageHub.statusBar.bottle, 40, 90, false)
    ];

    bottleCount = 0;
    flyingBottles = [];

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
        for (let i = 0; i < 15; i++) {
            const x = 200 + Math.random() * 3000;
            const y = 350;
            this.level.bottles.push(new Bottle(x, y));
        }
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
            this.removeDeadEnemies();

        }, 100);
    }

    checkBottlePickup() {
        this.character.getRealFrame();

        this.level.bottles.forEach((bottle, index) => {
            bottle.getRealFrame();

            if (this.character.isColliding(bottle)) {

                if (this.bottleCount < this.maxBottles) {
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
                this.coinCount++;
                this.level.coins.splice(index, 1);

                this.updateCoinStatusBar();
                console.log("Coin eingesammelt!");
            }
        });
    }



    checkThrowObjects() {
        if (Keyboard.D && this.bottleCount > 0) {

            let bottle = new ThrowableObject(
                this.character.x + 50,
                this.character.y + 80
            );

            this.flyingBottles.push(bottle);
            this.bottleCount--;

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
    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

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
            this.flipImage(movObj);
        }

        movObj.draw(this.ctx);

        if (movObj.otherDirection) {
            this.flipImageBack(movObj);
        }
    }

    flipImage(movObj) {
        this.ctx.save();
        this.ctx.translate(movObj.width, 0);
        this.ctx.scale(-1, 1);
        movObj.x = movObj.x * -1;
    }

    flipImageBack(movObj) {
        movObj.x = movObj.x * -1;
        this.ctx.restore();
    }

    setWorld() {
        this.character.world = this;
    }
}