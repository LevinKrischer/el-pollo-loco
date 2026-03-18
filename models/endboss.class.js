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
    baseChaseSpeed = 4;
    fastChaseSpeed = 7;
    currentChaseSpeed = 3;
    nextSpeedChangeAt = 0;
    minSpeedPhaseDuration = 700;
    maxSpeedPhaseDuration = 1600;
    fastSpeedChance = 0.4;
    isAttacking = false;
    canAttack = true;
    attackCooldown = 1000;
    hitInvulnerabilityDuration = 1500;
    hurtKnockbackDuration = 220;
    hurtRepositionDuration = 700;
    hurtKnockbackSpeed = 6;
    hurtRepositionSpeed = 2.5;
    hurtReengageSpeedBonus = 1;
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

    /**
     * Called once the world reference is assigned.
     * Starts the animation update loop.
     */
     initAfterWorldSet() {
        this.startLoops();
    }

    /**
     * Starts the periodic animation update loop.
     */
     startLoops() {
        this.world.setIntervalTracked(() => this.updateAnimation(), 100);
    }

    /**
     * Returns whether the endboss is dead.
     * @returns {boolean} True if the boss has been defeated.
     */
     isDead() {
        return this.dead;
    }

    /**
     * Returns whether the endboss is currently in a hurt state.
     * Hurt state lasts for 1500 ms after being hit.
     * @returns {boolean} True if the boss is hurt.
     */
     isHurt() {
        return Date.now() - this.lastHit < this.hitInvulnerabilityDuration;
    }

    /**
     * Attempts to attack the character if the boss is allowed to attack.
     * @param {Character} character - The player character to attack.
     */
     attack(character) {
        if (!this.canAttack || this.isAttacking || this.dead) return;
        this.beginAttack(character);
        this.scheduleAttackEnd();
        this.scheduleAttackCooldown();
    }

    /**
     * Begins the attack sequence by stopping movement,
     * marking the boss as attacking, and damaging the character.
     * @param {Character} character - The player character.
     */
     beginAttack(character) {
        this.isAttacking = true;
        this.canAttack = false;
        this.speed = 0;
        character.hit(10);
    }

    /**
     * Ends the attack animation after a short delay.
     */
     scheduleAttackEnd() {
        this.world.setTimeoutTracked(() => {
            this.isAttacking = false;
        }, 600);
    }

    /**
     * Re-enables attacking after the cooldown period.
     */
     scheduleAttackCooldown() {
        this.world.setTimeoutTracked(() => {
            this.canAttack = true;
        }, this.attackCooldown);
    }

    /**
     * Updates the boss's animation state based on its current behavior:
     * dead, hurt, attacking, preparing, walking, or idle alert.
     */
     updateAnimation() {
        if (this.dead) return this.playAnimation(this.imgsDead);
        if (this.isHurt()) return this.playHurtAnimation();
        if (this.isAttacking) return this.playAnimation(this.imgsAttack);
        if (this.preparing) return this.playAnimation(this.imgsAlert);
        if (this.speed !== 0) return this.playAnimation(this.imgsWalking);
        this.playAnimation(this.imgsAlert);
    }

    /**
     * Plays the hurt animation and temporarily stops movement.
     */
     playHurtAnimation() {
        return this.playAnimation(this.imgsHurt);
    }

    /**
     * Updates the boss's behavior logic, including movement and attack decisions.
     * @param {Character} character - The player character.
     */
     updateBehavior(character) {
        if (this.dead) return;
        if (this.isHurt()) return this.handleHurtBehavior(character);
        if (this.preparing) return this.pauseBehavior();
        if (!this.activated) return this.pauseBehavior();
        this.handleMovementBehavior(character);
    }

    /**
     * Drives a phased hurt behavior instead of fully stopping:
     * short knockback, brief repositioning, then aggressive re-engage.
     * @param {Character} character - The player character.
     */
     handleHurtBehavior(character) {
        const elapsed = Date.now() - this.lastHit;
        const towardPlayer = character.x > this.x;
        if (elapsed < this.hurtKnockbackDuration) return this.applyHurtKnockback(towardPlayer);
        if (elapsed < this.hurtRepositionDuration) return this.applyHurtReposition(towardPlayer);
        this.applyHurtReengage(towardPlayer);
    }

    /**
     * Applies knockback movement directly away from the player.
     * @param {boolean} towardPlayer - True if the player is to the right.
     */
     applyHurtKnockback(towardPlayer) {
        this.otherDirection = !towardPlayer;
        this.speed = this.hurtKnockbackSpeed;
    }

    /**
     * Applies a randomised repositioning movement during the hurt window.
     * @param {boolean} towardPlayer - True if the player is to the right.
     */
     applyHurtReposition(towardPlayer) {
        this.otherDirection = Math.random() < 0.5 ? towardPlayer : !towardPlayer;
        this.speed = this.hurtRepositionSpeed;
    }

    /**
     * Re-engages the player at increased speed after the hurt window expires.
     * @param {boolean} towardPlayer - True if the player is to the right.
     */
     applyHurtReengage(towardPlayer) {
        this.otherDirection = towardPlayer;
        this.speed = this.fastChaseSpeed + this.hurtReengageSpeedBonus;
    }

    /**
     * Pauses movement during hurt, preparation, or inactive states.
     */
     pauseBehavior() {
        this.speed = 0;
    }

    /**
     * Updates the current chase speed at irregular intervals so the boss
     * alternates between normal pace and short faster bursts.
     */
     updateChaseSpeed() {
        const now = Date.now();
        if (now < this.nextSpeedChangeAt) return;
        this.currentChaseSpeed = Math.random() < this.fastSpeedChance ? this.fastChaseSpeed : this.baseChaseSpeed;
        const phaseDuration = this.minSpeedPhaseDuration + Math.random() * (this.maxSpeedPhaseDuration - this.minSpeedPhaseDuration);
        this.nextSpeedChangeAt = now + phaseDuration;
    }

    /**
     * Handles movement and attack decisions based on the distance
     * between the boss and the character.
     * @param {Character} character - The player character.
     */
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
            this.updateChaseSpeed();
            this.speed = this.currentChaseSpeed;
        }
    }
}
