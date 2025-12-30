class World {
    character = new Character();
    enemies = level1.enemies;
    clouds = level1.clouds;
    backgroundObjects = level1.backgroundObjects;
    canvas;
    ctx;
    keyboard;
    camera_x = 0;
    world;

    constructor(canvas, keyboard) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.keyboard = keyboard;
        this.setWorld();
        this.run();
        this.draw();
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

    run() {
        setInterval(() => {
            this.checkKeyboard();
        }, 1000 / 60);
    }

    checkKeyboard() {
        if (this.keyboard.RIGHT) {
            this.character.moveRight();
        }
        if (this.keyboard.LEFT) {
            this.character.moveLeft();
        }
    }

    setWorld() {
        this.character.world = this;
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.translate(this.camera_x, 0);

        this.addObjectsToMap(this.backgroundObjects);
        this.addObjectsToMap(this.clouds);
        this.addToMap(this.character)
        this.addObjectsToMap(this.enemies);

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
            this.ctx.save();
            this.ctx.translate(movObj.width, 0);
            this.ctx.scale(-1, 1);
            movObj.x = movObj.x * -1;

        }

        this.ctx.drawImage(movObj.img, movObj.x, movObj.y, movObj.width, movObj.height)
        if (movObj.otherDirection) {
            movObj.x = movObj.x * -1;
            this.ctx.restore();

        }
    }
}