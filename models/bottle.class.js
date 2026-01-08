class Bottle extends ThrowableObject {

    isExploded = false;

    imgsSplash = ImageHub.bottle.splash;
    imgBottleNormal = ImageHub.bottle.normal[0];

    offset = {
        top: 10,
        right: 10,
        bottom: 8,
        left: 10
    };

    constructor(x, y) {
        super(x, y);
        this.loadImages(this.imgsSplash);
        this.loadImage(this.imgBottleNormal);
        this.animate();
    }

    explode() {
        this.isExploded = true;

        // horizontale Bewegung stoppen
        clearInterval(this.throwInterval);

        // GRAVITY STOPPEN
        clearInterval(this.gravityInterval);

        this.speed = 0;
        this.speedY = 0;
        this.currentImage = 0;
        console.log("Bottle explodiert bei X:", this.x, "Y:", this.y);

        setTimeout(() => {
            this.markedForDeletion = true;
        }, 400);
    }



    animate() {
        setInterval(() => {
            if (this.isExploded) {
                this.playAnimation(this.imgsSplash);
            }
        }, 80);
    }

}