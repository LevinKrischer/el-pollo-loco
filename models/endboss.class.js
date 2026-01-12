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

    deathAnimationDuration = 1200;

    offset = { top: 20, right: 20, bottom: 0, left: 40 };

    constructor() {
        super();
        this.x = 3000;

        this.loadImage(this.imgsAlert[0]);
        this.loadImages(this.imgsAlert);
        this.loadImages(this.imgsDead);
        this.loadImages(this.imgsHurt);
        this.loadImages(this.imgsWalking);
        this.loadImages(this.imgsAttack);
    }

    initAfterWorldSet() {
        this.startLoops();
    }

    startLoops() {
        this.world.setIntervalTracked(() => this.updateAnimation(), 100);
    }

    isDead() {
        return this.dead;
    }

    isHurt() {
        return (Date.now() - this.lastHit) / 1000 < 2;
    }

    attack(character) {
        if (!this.canAttack || this.isAttacking || this.dead) return;

        this.beginAttack(character);
        this.scheduleAttackEnd();
        this.scheduleAttackCooldown();
    }

    beginAttack(character) {
        this.isAttacking = true;
        this.canAttack = false;
        this.speed = 0;

        character.hit(10);
    }

    scheduleAttackEnd() {
        this.world.setTimeoutTracked(() => {
            this.isAttacking = false;
        }, 600);
    }

    scheduleAttackCooldown() {
        this.world.setTimeoutTracked(() => {
            this.canAttack = true;
        }, this.attackCooldown);
    }

    updateAnimation() {
        if (this.dead) return this.playAnimation(this.imgsDead);
        if (this.isHurt()) return this.playHurtAnimation();
        if (this.isAttacking) return this.playAnimation(this.imgsAttack);
        if (this.preparing) return this.playAnimation(this.imgsAlert);
        if (this.speed !== 0) return this.playAnimation(this.imgsWalking);

        this.playAnimation(this.imgsAlert);
    }

    playHurtAnimation() {
        this.speed = 0;
        return this.playAnimation(this.imgsHurt);
    }

    updateBehavior(character) {
        if (this.dead) return;
        if (this.isHurt()) return this.pauseBehavior();
        if (this.preparing) return this.pauseBehavior();
        if (!this.activated) return this.pauseBehavior();

        this.handleMovementBehavior(character);
    }

    pauseBehavior() {
        this.speed = 0;
    }

    handleMovementBehavior(character) {
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
