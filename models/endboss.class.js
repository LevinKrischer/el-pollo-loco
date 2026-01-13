/**
 * The final boss enemy with complex behavior including walking,
 * alerting, attacking, taking damage, and playing a death animation.
 * Inherits hit detection and damage logic from HitableObject.
 */
class Endboss extends HitableObject {

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
     *
     * @returns {boolean} True if the boss has been defeated.
     */
    isDead() {
        return this.dead;
    }

    /**
     * Returns whether the endboss is currently in a hurt state.
     * Hurt state lasts for 2 seconds after being hit.
     *
     * @returns {boolean} True if the boss is hurt.
     */
    isHurt() {
        return (Date.now() - this.lastHit) / 1000 < 2;
    }

    /**
     * Attempts to attack the character if the boss is allowed to attack.
     *
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
     *
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
     * Re‑enables attacking after the cooldown period.
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
        this.speed = 0;
        return this.playAnimation(this.imgsHurt);
    }

    /**
     * Updates the boss's behavior logic, including movement and attack decisions.
     *
     * @param {Character} character - The player character.
     */
    updateBehavior(character) {
        if (this.dead) return;
        if (this.isHurt()) return this.pauseBehavior();
        if (this.preparing) return this.pauseBehavior();
        if (!this.activated) return this.pauseBehavior();

        this.handleMovementBehavior(character);
    }

    /**
     * Pauses movement during hurt, preparation, or inactive states.
     */
    pauseBehavior() {
        this.speed = 0;
    }

    /**
     * Handles movement and attack decisions based on the distance
     * between the boss and the character.
     *
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
            this.speed = 4;
        }
    }
}