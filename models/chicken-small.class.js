class ChickenSmall extends HitableObject {
    imgsWalking = ImageHub.chickenSmall.walking;
    imgsDead = ImageHub.chickenSmall.dead;
    currentImage = 0;
    height = 50;
    width = 50;
    y = 375;

    offset = {
        top: 5,
        right: 0,
        bottom: 0,
        left: 5
    }

    constructor() {
        super().loadImage(ImageHub.chickenSmall.walking[0]);
        this.loadImages(this.imgsWalking);
        this.loadImages(this.imgsDead);
        this.x = 200 + Math.random() * 3500;
        this.speed = 0.15 + Math.random() * 0.4;
        this.animate();
    }

    animate() {
        this.moveLeft();

        setInterval(() => {
            if (this.isDead()) {
                this.playAnimation(this.imgsDead);
            } else {
                let index = this.currentImage % this.imgsWalking.length;
                let path = this.imgsWalking[index];
                this.img = this.imageCache[path];
                this.currentImage++;
            }
        }, 200);
    }

    isDead() {
        return this.energy <= 0;
    }

}

