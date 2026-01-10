class Bottle extends ThrowableObject {

    isExploded = false;

    imgsSplash = ImageHub.bottle.splash;
    imgBottleNormal = ImageHub.bottle.normal[0];

    // --- SOUND REFERENCE ---
    soundBreak = SoundHub.sfx.collectibles.bottleBreak;

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

        SoundManager.play(this.soundBreak);

        clearInterval(this.throwInterval);
        clearInterval(this.gravityInterval);

        this.speed = 0;
        this.speedY = 0;
        this.currentImage = 0;

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
