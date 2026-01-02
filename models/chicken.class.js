class Chicken extends MoveableObject {
    imgsWalking = ImageHub.chicken.walking;
    imgsDead = ImageHub.chicken.dead;
    currentImage = 0;
    height = 60;
    width = 60; 
    y = 365;

    constructor() {
        super().loadImage(ImageHub.chicken.walking[0]);
        this.loadImages(this.imgsWalking);
        this.x = 200 + Math.random() * 500;
        this.speed = 0.15 + Math.random () * 0.5;
        this.animate();
    }

    animate() {
        this.moveLeft();
        setInterval(() => {
            let index = this.currentImage % this.imgsWalking.length;
            let path = this.imgsWalking[index];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 200);
    }
}

