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
    attackRange = 80;
    isAttacking = false;
    canAttack = true;
    attackCooldown = 1500;
    preparing = false;

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
        this.loadImages(this.imgsAttack);
        this.x = 3000;
        this.speed = 0;
        this.startLoops();
    }

    startLoops() {
        setInterval(() => this.updateAnimation(), 100);
    }

    isDead() {
        return this.dead;
    }

    isHurt() {
        return (Date.now() - this.lastHit) / 1000 < 2;
    }

    attack(character) {
        if (!this.canAttack || this.isAttacking || this.dead) return;

        this.isAttacking = true;
        this.canAttack = false;
        this.speed = 0;

        character.hit(10);

        setTimeout(() => {
            this.isAttacking = false;
        }, 600);

        setTimeout(() => {
            this.canAttack = true;
        }, this.attackCooldown);
    }

    updateAnimation() {
        if (this.dead)
            return this.playAnimation(this.imgsDead);

        if (this.isHurt()) {
            this.speed = 0;
            return this.playAnimation(this.imgsHurt);
        }

        if (this.isAttacking)
            return this.playAnimation(this.imgsAttack);

        if (this.preparing)
            return this.playAnimation(this.imgsAlert);

        if (this.speed !== 0)
            return this.playAnimation(this.imgsWalking);

        this.playAnimation(this.imgsAlert);
    }

    updateBehavior(character) {
        if (this.dead) return;

        // ❗ Wenn Boss verletzt ist → Verhalten pausieren
        if (this.isHurt()) {
            this.speed = 0;
            return;
        }

        if (this.preparing) {
            this.speed = 0;
            return;
        }

        if (!this.activated) {
            this.speed = 0;
            return;
        }

        const dx = this.x - character.x;
        const distance = Math.abs(dx);

        this.otherDirection = dx < 0;

        if (distance < this.attackRange) {
            this.speed = 0;
            this.attack(character);
            return;
        }

        if (!this.isAttacking) {
            this.speed = 4;
        }
    }

}
