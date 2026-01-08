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
    isEndboss = true;
    hitsToKill = 5;
    hitsTaken = 0;
    lastHit = 0;
    dead = false;
    activated = false;


    offset = {
        top: 20,
        right: 20,
        bottom: 0,
        left: 40
    }

    constructor() {
        super().loadImage(ImageHub.endboss.alert[0]);
        this.loadImages(this.imgsAlert);
        this.loadImages(this.imgsDead);
        this.loadImages(this.imgsHurt);
        this.loadImages(this.imgsWalking);
        this.x = 3000;
        this.speed = 0;
        this.startLoops();
    }

    startLoops() {
        setInterval(() => this.updateAnimation(), 100);
    }

    startMoving() {
        this.speed = 4;     
        this.otherDirection = false; 
        this.moveLeft();
    }

    isDead() {
        return this.dead;
    }


    updateAnimation() {
        if (this.dead)
            return this.playAnimation(this.imgsDead);

        if (this.isHurt())
            return this.playAnimation(this.imgsHurt);

        if (this.speed !== 0)
            return this.playAnimation(this.imgsWalking);

        this.playAnimation(this.imgsAlert);
    }
}