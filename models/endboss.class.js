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

        if (this.isHurt())
            return this.playAnimation(this.imgsHurt);

        if (this.isAttacking)
            return this.playAnimation(this.imgsAttack);

        // 🔧 Fix: Während der 2s-Startphase → Alert
        if (this.preparing)
            return this.playAnimation(this.imgsAlert);

        if (this.speed !== 0)
            return this.playAnimation(this.imgsWalking);

        this.playAnimation(this.imgsAlert);
    }

    updateBehavior(character) {
        if (this.dead) return;

        // 🔧 Fix: Boss aktiviert, aber noch in der 2s-Startphase
        if (this.preparing) {
            this.speed = 0;
            return;
        }

        // Boss noch nicht aktiviert → stehen bleiben
        if (!this.activated) {
            this.speed = 0;
            return;
        }

        const dx = this.x - character.x;
        const distance = Math.abs(dx);

        // Blickrichtung
        this.otherDirection = dx < 0;

        // In Schlagreichweite → stehen bleiben + angreifen
        if (distance < this.attackRange) {
            this.speed = 0;
            this.attack(character);
            return;
        }

        // Außerhalb der Reichweite → hinterherlaufen
        if (!this.isAttacking) {
            this.speed = 4;
        }
    }
}
