class ThrowableObject extends MoveableObject {

imgBottleNormal = ImageHub.bottle.normal;
imgsBottleRotating = ImageHub.bottle.rotating;
imgsBottleSplash = ImageHub.bottle.splash;

    constructor() {
        super().loadImage(this.imgBottleNormal);
        this.x = 100;
        this.y = 100;
        this.height = 80;
        this.width = 80;
        this.throw(100, 100);
    }

    throw(x, y) {
        this.x = x;
        this.y = y;
        this.speedY = 30;
        this.applyGravity();
        setInterval(() => {
            this.x += 10;
        }, 25)
    }


}