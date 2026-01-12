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

    hurtSoundPlayed = false;
    deathSoundPlayed = false;
    deathAnimationDuration = 800;

    height = 250;
    y = 180;
    speed = 6;
    world;
    energy = 5;

    offset = { top: 100, right: 20, bottom: 5, left: 15 };

    lastMoveTime = Date.now();
    longIdleDelay = 5000;
    wasOnGround = true;

    constructor() {
        super();
        this.loadImage(this.imgsIdle[0]);
        this.preloadAllImages();
    }

    initAfterWorldSet() {
        this.applyGravity();
        this.startLoops();
    }

    preloadAllImages() {
        this.loadImages(this.imgsWalking);
        this.loadImages(this.imgsIdle);
        this.loadImages(this.imgsIdleLong);
        this.loadImages(this.imgsJump);
        this.loadImages(this.imgsHurt);
        this.loadImages(this.imgsDead);
    }

    startLoops() {
        this.world.setIntervalTracked(() => this.updateAnimation(), 80);
        requestAnimationFrame(() => this.update());
    }

    update() {
        this.handleMovement();
        this.updateCamera();
        requestAnimationFrame(() => this.update());
    }

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

    handleMovement() {
        if (this.isHurt()) {
            SoundManager.stop(this.walkSound);
            return;
        }

        this.handleMoveRight();
        this.handleMoveLeft();
        this.handleJump();
    }

    handleMoveRight() {
        if (Keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.x += this.speed;
            this.otherDirection = false;
            this.lastMoveTime = Date.now();
        }
    }

    handleMoveLeft() {
        if (Keyboard.LEFT && this.x > 0) {
            this.x -= this.speed;
            this.otherDirection = true;
            this.lastMoveTime = Date.now();
        }
    }

    handleJump() {
        if (Keyboard.SPACE && this.wasOnGround) {
            this.speedY = 20;
            this.lastMoveTime = Date.now();
            SoundManager.play(this.soundJump);
            this.wasOnGround = false;
        }
    }

    updateAnimation() {
        if (this.isDead()) return this.handleDeadAnimation();
        if (this.isHurt()) return this.handleHurtAnimation();
        if (this.isAboveGround()) return this.playAnimation(this.imgsJump);

        this.wasOnGround = true;

        if (Keyboard.RIGHT || Keyboard.LEFT) {
            this.playWalkSound();
            return this.playAnimation(this.imgsWalking);
        }

        SoundManager.stop(this.walkSound);
        this.handleIdleAnimation();
    }

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

    playDeathSound() {
        SoundManager.play(this.soundDead);
        this.deathSoundPlayed = true;
    }

    scheduleDeathEndscreen() {
        this.world.setTimeoutTracked(() => {
            if (!this.endScreenShown) {
                this.endScreenShown = true;
                this.world.stopGame();
                toggleEndScreen('gameOver');
            }
        }, this.deathAnimationDuration);
    }

    handleHurtAnimation() {
        SoundManager.stop(this.walkSound);
        SoundManager.stop(this.snoreSound);

        if (!this.hurtSoundPlayed) {
            SoundManager.play(this.soundHurt);
            this.hurtSoundPlayed = true;
        }

        return this.playAnimation(this.imgsHurt);
    }

    handleIdleAnimation() {
        const idleTime = Date.now() - this.lastMoveTime;

        if (idleTime > this.longIdleDelay) {
            this.playSnoreSound();
            return this.playAnimation(this.imgsIdleLong);
        }

        SoundManager.stop(this.snoreSound);
        this.playAnimation(this.imgsIdle);
    }

    playWalkSound() {
        if (this.walkSound && !this.walkSound.paused) return;

        SoundManager.stop(this.walkSound);
        this.walkSound = SoundManager.play(this.soundWalk);
    }

    playSnoreSound() {
        if (this.snoreSound && !this.snoreSound.paused) return;

        SoundManager.stop(this.snoreSound);
        this.snoreSound = SoundManager.play(this.soundSnore);
    }
}
