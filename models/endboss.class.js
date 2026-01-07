class Endboss extends HitableObject {

    imgsWalking = ImageHub.endboss.walking;
    imgsDead = ImageHub.endboss.dead;
    imgsAlert = ImageHub.endboss.alert;
    imgsHurt = ImageHub.endboss.hurt;
    imgsAttack = ImageHub.endboss.attack;
    currentImage = 0;
    height = 400;
    width = 350; 
    y = 50;

    constructor() {
        super().loadImage(ImageHub.endboss.alert[0]);
        this.loadImages(this.imgsAlert);
        this.x = 3000;
        this.speed = 2;
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.playAnimation(this.imgsAlert);
        }, 200);
    }

}