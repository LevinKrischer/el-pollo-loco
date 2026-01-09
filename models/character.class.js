class Character extends HitableObject {

    imgsWalking = ImageHub.character.walking;
    imgsIdle = ImageHub.character.idle;
    imgsIdleLong = ImageHub.character.long_idle;
    imgsJump = ImageHub.character.jumping;
    imgsHurt = ImageHub.character.hurt;
    imgsDead = ImageHub.character.dead;

    height = 250;
    y = 0;
    speed = 6;
    world;

    offset = {
        top: 100,
        right: 20,
        bottom: 5,
        left: 15
    }

    lastMoveTime = Date.now();
    longIdleDelay = 5000;
    wasOnGround = true;

    walkSound = null;
    snoreSound = null;
    hurtSound = null;
    hurtSoundPlayed = false;
    deathSoundPlayed = false;


    constructor() {
        super().loadImage(this.imgsIdle[0]);
        this.preloadAllImages();
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
        requestAnimationFrame(() =>
            this.update());
        setInterval(() =>
            this.updateAnimation()
            , 80);
    }

    update() {
        this.handleMovement();

        // Dead-Zone definieren (in Pixeln)
        const deadZoneLeft = 100;
        const deadZoneRight = 300;

        // Kamera in Weltkoordinaten umrechnen
        const camX = -this.world.camera_x;

        // Pepe ist links aus der Dead-Zone raus
        if (this.x < camX + deadZoneLeft) {
            this.world.camera_x = -(this.x - deadZoneLeft);
        }

        // Pepe ist rechts aus der Dead-Zone raus
        if (this.x > camX + deadZoneRight) {
            this.world.camera_x = -(this.x - deadZoneRight);
        }

        requestAnimationFrame(() => this.update());
    }

    handleMovement() {
        if (Keyboard.RIGHT && this.x < this.world.level.level_end_x) {
            this.x += this.speed;
            this.otherDirection = false;
            this.lastMoveTime = Date.now();
        }

        if (Keyboard.LEFT && this.x > 0) {
            this.x -= this.speed;
            this.otherDirection = true;
            this.lastMoveTime = Date.now();
        }

        if (Keyboard.SPACE && this.wasOnGround) {
            this.speedY = 20;
            this.lastMoveTime = Date.now();

            // Jump-Sound nur beim Absprung
            SoundManager.play(SoundHub.character.jump, 0.4);

            this.wasOnGround = false;
        }


    }

    updateAnimation() {
        if (this.isDead()) {

            // Alle laufenden Sounds stoppen
            SoundManager.stop(this.walkSound);
            SoundManager.stop(this.snoreSound);

            // Death-Sound nur einmal abspielen
            if (!this.deathSoundPlayed) {
                SoundManager.play(SoundHub.character.dead, 0.6);
                this.deathSoundPlayed = true;
            }

            return this.playAnimation(this.imgsDead);
        }

        if (this.isHurt()) {

            // Lauf- und Schnarch-Sound stoppen
            SoundManager.stop(this.walkSound);
            SoundManager.stop(this.snoreSound);

            return this.playAnimation(this.imgsHurt);
        }

        if (this.isAboveGround())
            return this.playAnimation(this.imgsJump);
        if (!this.isAboveGround()) {
            this.wasOnGround = true;
        }

        if (Keyboard.RIGHT || Keyboard.LEFT) {
            this.playWalkSound();
            return this.playAnimation(this.imgsWalking);
        }
        if (!Keyboard.RIGHT && !Keyboard.LEFT) {
            SoundManager.stop(this.walkSound);
        }


        this.handleIdleAnimation();
    }

    handleIdleAnimation() {
    const idleTime = Date.now() - this.lastMoveTime;

    if (idleTime > this.longIdleDelay) {
        this.playSnoreSound();
        return this.playAnimation(this.imgsIdleLong);
    }

    // Wenn NICHT idleLong → Snore stoppen
    SoundManager.stop(this.snoreSound);

    this.playAnimation(this.imgsIdle);
}


    playWalkSound() {
        // Wenn Sound bereits läuft → nichts tun
        if (this.walkSound && !this.walkSound.paused) return;

        // Falls vorher ein Sound hing → stoppen
        SoundManager.stop(this.walkSound);

        this.walkSound = SoundManager.play(
            SoundHub.character.run,
            0.3,
            true // loop
        );
    }

    playSnoreSound() {
        if (this.snoreSound && !this.snoreSound.paused) return;

        SoundManager.stop(this.snoreSound);
        this.snoreSound = SoundManager.play(SoundHub.character.snoring, 0.4, true);
    }


}