/**
 * The main controllable player character. Handles movement, physics,
 * camera tracking, animation states, and character‑related sound effects.
 * Inherits hit detection and damage logic from HitableObject.
 */
class Character extends HitableObject {

    imgsWalking = ImageHub.character.walking;
    imgsIdle = ImageHub.character.idle;
    imgsIdleLong = ImageHub.character.long_idle;
    imgsJump = ImageHub.character.jumping;
    imgsHurt = ImageHub.character.hurt;
    imgsDead = ImageHub.character.dead;

    soundWalk = SoundHub.sfx.character.run;
    soundSnore = SoundHub.sfx.character.snoring;
    soundJump = SoundHub.sfx.character.jump;
    soundHurt = SoundHub.sfx.character.damage;
    soundDead = SoundHub.sfx.character.dead;

    walkSound = null;
    snoreSound = null;
    hurtSound = null;
    isSnoring = false;

    hurtSoundPlayed = false;
    deathSoundPlayed = false;
    deathAnimationDuration = 800;

    height = 250;
    y = 180;
    speed = 6;
    world;
    energy = 100;

    offset = { top: 100, right: 20, bottom: 5, left: 15 };

    lastMoveTime = Date.now();
    longIdleDelay = 5000;
    wasOnGround = true;

    constructor() {
        super();
        this.loadImage(this.imgsIdle[0]);
        this.preloadAllImages();
    }

    /**
     * Called once the world reference is assigned.
     * Starts gravity and all update loops.
     */
    initAfterWorldSet() {
        this.applyGravity();
        this.startLoops();
    }

    /**
     * Preloads all animation frames for walking, idle, long idle,
     * jumping, hurt, and death states.
     */
    preloadAllImages() {
        this.loadImages(this.imgsWalking);
        this.loadImages(this.imgsIdle);
        this.loadImages(this.imgsIdleLong);
        this.loadImages(this.imgsJump);
        this.loadImages(this.imgsHurt);
        this.loadImages(this.imgsDead);
    }

    /**
     * Starts the animation update loop and the continuous movement update loop.
     */
    startLoops() {
        this.world.setIntervalTracked(() => this.updateAnimation(), 80);
        requestAnimationFrame(() => this.update());
    }

    /**
     * Main update loop for movement and camera tracking.
     * Runs every animation frame.
     */
    update() {
        this.handleMovement();
        this.updateCamera();
        requestAnimationFrame(() => this.update());
    }

    /**
     * Adjusts the camera position based on the character's location
     * within a left/right dead zone.
     */
    updateCamera() {
        const deadZoneLeft = 100;
        const deadZoneRight = 300;
        const camX = -this.world.camera_x;

        if (this.x < camX + deadZoneLeft) {
            this.world.camera_x = -(this.x - deadZoneLeft);
        }

        if (this.x > camX + deadZoneRight) {
            this.world.camera_x = -(this.x - deadZoneRight);
        }
    }

    /**
     * Handles movement input and prevents walking while hurt.
     */
    handleMovement() {
        if (this.isHurt()) {
            SoundManager.stop(this.walkSound);
            return;
        }

        this.handleMoveRight();
        this.handleMoveLeft();
        this.handleJump();
    }

    /**
     * Moves the character to the right if allowed by input and level bounds.
     */
    handleMoveRight() {
        if (Keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.x += this.speed;
            this.otherDirection = false;
            this.lastMoveTime = Date.now();
        }
    }

    /**
     * Moves the character to the left if allowed by input and world bounds.
     */
    handleMoveLeft() {
        if (Keyboard.LEFT && this.x > 0) {
            this.x -= this.speed;
            this.otherDirection = true;
            this.lastMoveTime = Date.now();
        }
    }

    /**
     * Initiates a jump if the character is currently on the ground.
     */
    handleJump() {
        if (Keyboard.SPACE && this.wasOnGround) {
            this.speedY = 20;
            this.lastMoveTime = Date.now();
            SoundManager.play(this.soundJump);
            this.wasOnGround = false;
            this.stopSnoring();
        }
    }

    /**
     * Updates the animation state based on movement, jumping,
     * hurt state, or idle behavior.
     */
    updateAnimation() {
        if (this.isDead()) return this.handleDeadAnimation();
        if (this.isHurt()) return this.handleHurtAnimation();
        if (this.isAboveGround()) return this.playAnimation(this.imgsJump);

        this.wasOnGround = true;

        if (Keyboard.RIGHT || Keyboard.LEFT) {
            this.stopSnoring(); this.playWalkSound();
            return this.playAnimation(this.imgsWalking);
        }

        SoundManager.stop(this.walkSound);
        this.handleIdleAnimation();
    }

    /**
     * Plays the death animation, triggers death sound once,
     * and schedules the game‑over screen.
     */
    handleDeadAnimation() {
        SoundManager.stop(this.walkSound);
        SoundManager.stop(this.snoreSound);

        const frame = this.playAnimation(this.imgsDead);

        if (!this.deathSoundPlayed) {
            this.playDeathSound();
            this.scheduleDeathEndscreen();
        }

        return frame;
    }

    /**
     * Plays the death sound once.
     */
    playDeathSound() {
        SoundManager.play(this.soundDead);
        this.deathSoundPlayed = true;
    }

    /**
     * Schedules the game‑over screen after the death animation finishes.
     */
    scheduleDeathEndscreen() {
        this.world.setTimeoutTracked(() => {
            if (!this.endScreenShown) {
                this.endScreenShown = true;
                this.world.stopGame();
                toggleEndScreen('gameOver');
            }
        }, this.deathAnimationDuration);
    }

    /**
     * Plays the hurt animation and triggers the hurt sound once.
     */
    handleHurtAnimation() {
        SoundManager.stop(this.walkSound);
        SoundManager.stop(this.snoreSound);

        if (!this.hurtSoundPlayed) {
            SoundManager.play(this.soundHurt);
            this.hurtSoundPlayed = true;
        }

        return this.playAnimation(this.imgsHurt);
    }

    /**
     * Plays either the normal idle animation or the long idle animation
     * depending on how long the character has been inactive.
     */
    handleIdleAnimation() {
        const idleTime = Date.now() - this.lastMoveTime;

        if (idleTime > this.longIdleDelay) {
            if (!this.isSnoring) {
                this.snoreSound = SoundManager.play(this.soundSnore);
                this.isSnoring = true;
            }
            return this.playAnimation(this.imgsIdleLong);
        }

        this.stopSnoring();
        this.playAnimation(this.imgsIdle);
    }


    /**
     * Plays the walking sound if not already playing.
     */
    playWalkSound() {
        if (this.walkSound && !this.walkSound.paused) return;

        SoundManager.stop(this.walkSound);
        this.walkSound = SoundManager.play(this.soundWalk);
    }

    /**
     * Plays the snoring sound during long idle animation.
     */
    playSnoreSound() {
        if (this.snoreSound && !this.snoreSound.paused) return;

        SoundManager.stop(this.snoreSound);
        this.snoreSound = SoundManager.play(this.soundSnore);
    }

    stopSnoring() {
        if (!this.isSnoring) return;

        SoundManager.stop(this.snoreSound);
        this.snoreSound = null;
        this.isSnoring = false;
    }
}