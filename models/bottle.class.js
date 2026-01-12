class Bottle extends ThrowableObject {

    isExploded = false;
    isThrown = false;

    imgsSplash = ImageHub.bottle.splash;
    imgsBottleNormal = ImageHub.bottle.normal;
    imgsBottleRotation = ImageHub.bottle.rotating;

    soundBreak = SoundHub.sfx.collectibles.bottleBreak;

    offset = {
        top: 10,
        right: 10,
        bottom: 8,
        left: 10
    };

    constructor(x, y) {
        super();
        this.loadImage(this.imgsBottleNormal[0]);
        this.loadImages(this.imgsBottleNormal);
        this.loadImages(this.imgsSplash);
        this.loadImages(this.imgsBottleRotation);
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
        this.isThrown = false;

        this.world.setTimeoutTracked(() => {
            this.markedForDeletion = true;
        }, 400);
    }

    animate() {
        let idleTimer = 0;

        this.world.setIntervalTracked(() => {
            if (this.isExploded) return this.animateSplash();
            if (this.isThrown) return this.animateThrow();
            idleTimer = this.animateIdle(idleTimer);
        }, 60);
    }

    animateIdle(timer) {
        if (timer >= 300) {
            this.playAnimation(this.imgsBottleNormal);
            return 0;
        }
        return timer + 60;
    }

    animateThrow() { this.playAnimation(this.imgsBottleRotation); }
    animateSplash() { this.playAnimation(this.imgsSplash); }
}