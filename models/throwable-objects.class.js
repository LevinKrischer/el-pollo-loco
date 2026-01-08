class ThrowableObject extends MoveableObject {

    imgBottleNormal = ImageHub.bottle.normal;
    imgsBottleRotating = ImageHub.bottle.rotating;
    imgsBottleSplash = ImageHub.bottle.splash;

    constructor(x, y) {
        super();
        this.loadImage(this.imgBottleNormal);
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 80;

        this.throw();
    }

    throw() {
        this.speedY = 25;
        this.applyGravity();

        setInterval(() => {
            this.x += 10;
        }, 25);
    }
}
