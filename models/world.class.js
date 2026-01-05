class World {
    character = new Character();
    level = level1;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    world;
    statusBar = new StatusBar;
    throwableObjects = [new ThrowableObject()];

    constructor(canvas, keyboard) {
        this.ctx = canvas.getContext('2d');
        this.canvas = canvas;
        this.keyboard = keyboard;
        this.draw();
        this.setWorld();
        this.run();
    }

    run() {
        setInterval(() => {
            this.checkCollisions();
            this.checkThrowObjects();
        }, 200);
    }

    checkThrowObjects() {
        if (Keyboard.D) {
            let bottle = new ThrowableObject(this.character.x + 50, this.character.y + 80)
            this.throwableObjects.push(bottle);
        }
    }

    checkCollisions() {
        this.level.enemies.forEach((enemy) => {
                if (this.character.isColliding(enemy)) {
                    this.character.hit();
                    this.statusBar.setPercentage(this.character.energy, this.statusBar.imgsStatusHealth);
                }
            })
    }

    generateBackground() {
        const layers = [
            ImageHub.background.air,
            ImageHub.background.third,
            ImageHub.background.second,
            ImageHub.background.first
        ];

        const objects = [];

        for (let i = 0; i < this.map_length; i++) {
            const x = i * 720;

            layers.forEach(layer => {
                // Falls ein Layer nur 1 Bild hat → immer Index 0
                const img = layer[i % layer.length];
                objects.push(new BackgroundObject(img, x));
            });
        }
        return objects;
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.level.backgroundObjects);
        this.addObjectsToMap(this.level.clouds);

        this.ctx.translate(-this.camera_x, 0);
        this.addToMap(this.statusBar);
        this.ctx.translate(this.camera_x, 0);
        this.addToMap(this.character);
        this.addObjectsToMap(this.level.enemies);
        this.addObjectsToMap(this.throwableObjects);

        this.ctx.translate(-this.camera_x, 0);

        requestAnimationFrame(() => {
            this.draw();
        });
    }

    addObjectsToMap(objects) {
        objects.forEach(o => {
            this.addToMap(o);
        });
    }

    addToMap(movObj) {
        if (movObj.otherDirection) {
            this.flipImage(movObj);
        }

        movObj.draw(this.ctx);
        movObj.drawFrame(this.ctx);

        if (movObj.otherDirection) {
            this.flipImageBack(movObj)
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

    
}