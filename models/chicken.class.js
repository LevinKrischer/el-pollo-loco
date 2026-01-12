class Chicken extends HitableObject {
    imgsWalking = ImageHub.chicken.walking;
    imgsDead = ImageHub.chicken.dead;
    currentImage = 0;
    height = 60;
    width = 60;
    y = 365;
    energy = 1;

    offset = { top: 0, right: 0, bottom: 10, left: 0 };

    constructor() {
        super();
        this.loadImage(ImageHub.chicken.walking[0]);
        this.loadImages(this.imgsWalking);
        this.loadImages(this.imgsDead);
        this.x = 400 + Math.random() * 3000;
        this.speed = 0.15 + Math.random() * 0.5;
    }

    initAfterWorldSet() {
        this.animate();
    }

    animate() {
        this.moveLeft();
        this.startAnimationLoop();
    }

    startAnimationLoop() {
        this.world.setIntervalTracked(() => {
            if (this.isDead()) {
                this.playAnimation(this.imgsDead);
                return;
            }
            this.playWalkingFrame();
        }, 200);
    }

    playWalkingFrame() {
        const index = this.currentImage % this.imgsWalking.length;
        const path = this.imgsWalking[index];

        this.img = this.imageCache[path];
        this.currentImage++;
    }

    isDead() {
        return this.energy <= 0;
    }
}
