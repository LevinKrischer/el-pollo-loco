class ThrowableObject extends HitableObject {

    imgBottleNormal = ImageHub.bottle.normal;
    imgsBottleRotating = ImageHub.bottle.rotating;
    imgsBottleSplash = ImageHub.bottle.splash;

    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    constructor(x, y) {
        super();
        this.loadImage(this.imgBottleNormal);
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 80;
    }

    throw(facingLeft) {
        this.speedY = 25;
        this.applyGravity();

        const direction = facingLeft ? -10 : 10;

        this.throwInterval = this.world.setIntervalTracked(() => {
            this.x += direction;
        }, 25);
    }

}
