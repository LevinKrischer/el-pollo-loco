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
        super();
        this.loadImage(this.imgBottleNormal);
        this.loadImages(this.imgsSplash);
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 80;
    }

    initAfterWorldSet() {
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

        this.world.setTimeoutTracked(() => {
            this.markedForDeletion = true;
        }, 400);
    }

    animate() {
        this.world.setIntervalTracked(() => {
            if (this.isExploded) {
                this.playAnimation(this.imgsSplash);
            }
        }, 80);
    }
}
