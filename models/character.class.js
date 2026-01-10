class Character extends HitableObject {

    // --- IMAGE SETS ---
    imgsWalking = ImageHub.character.walking;
    imgsIdle = ImageHub.character.idle;
    imgsIdleLong = ImageHub.character.long_idle;
    imgsJump = ImageHub.character.jumping;
    imgsHurt = ImageHub.character.hurt;
    imgsDead = ImageHub.character.dead;

    // --- PREDEFINED SOUND REFERENCES (from SoundHub) ---
    soundWalk = SoundHub.sfx.character.run;
    soundSnore = SoundHub.sfx.character.snoring;
    soundJump = SoundHub.sfx.character.jump;
    soundHurt = SoundHub.sfx.character.damage;
    soundDead = SoundHub.sfx.character.dead;

    // --- SOUND INSTANCES (running sounds) ---
    walkSound = null;
    snoreSound = null;
    hurtSound = null;

    hurtSoundPlayed = false;
    deathSoundPlayed = false;

    // --- CHARACTER PROPERTIES ---
    height = 250;
    y = 0;
    speed = 6;
    world;

    offset = {
        top: 100,
        right: 20,
        bottom: 5,
        left: 15
    };

    lastMoveTime = Date.now();
    longIdleDelay = 5000;
    wasOnGround = true;


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
        requestAnimationFrame(() => this.update());
        setInterval(() => this.updateAnimation(), 80);
    }

    update() {
        this.handleMovement();

        // Dead-Zone definieren (in Pixeln)
        const deadZoneLeft = 100;
        const deadZoneRight = 300;

        // Kamera in Weltkoordinaten umrechnen
        const camX = -this.world.camera_x;

        if (this.x < camX + deadZoneLeft) {
            this.world.camera_x = -(this.x - deadZoneLeft);
        }

        if (this.x > camX + deadZoneRight) {
            this.world.camera_x = -(this.x - deadZoneRight);
        }

        requestAnimationFrame(() => this.update());
    }

    handleMovement() {

        // ❗ Während Hurt → KEINE Bewegung erlauben
        if (this.isHurt()) {
            SoundManager.stop(this.walkSound);
            return;
        }

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
            SoundManager.play(this.soundJump);
            this.wasOnGround = false;
        }
    }


    updateAnimation() {

        // --- DEAD ---
        if (this.isDead()) {

            SoundManager.stop(this.walkSound);
            SoundManager.stop(this.snoreSound);

            if (!this.deathSoundPlayed) {
                SoundManager.play(this.soundDead);
                this.deathSoundPlayed = true;
            }

            return this.playAnimation(this.imgsDead);
        }

        // --- HURT ---
        if (this.isHurt()) {

            SoundManager.stop(this.walkSound);
            SoundManager.stop(this.snoreSound);

            // Hurt-Sound nur EINMAL pro Hurt-Phase
            if (!this.hurtSoundPlayed) {
                SoundManager.play(this.soundHurt);
                this.hurtSoundPlayed = true;
            }

            return this.playAnimation(this.imgsHurt);
        }
        // Hurt vorbei → Flag zurücksetzen
        if (!this.isHurt()) {
            this.hurtSoundPlayed = false;
        }


        // --- JUMP ---
        if (this.isAboveGround()) {
            return this.playAnimation(this.imgsJump);
        }

        if (!this.isAboveGround()) {
            this.wasOnGround = true;
        }

        // --- WALKING ---
        if (Keyboard.RIGHT || Keyboard.LEFT) {
            this.playWalkSound();
            return this.playAnimation(this.imgsWalking);
        }

        // Wenn nicht mehr in Bewegung → Walk-Sound stoppen
        SoundManager.stop(this.walkSound);

        // --- IDLE ---
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

    // --- SOUND METHODS ---

    playWalkSound() {
        // Wenn Sound bereits läuft → nichts tun
        if (this.walkSound && !this.walkSound.paused) return;

        // Falls vorher ein Sound hing → stoppen
        SoundManager.stop(this.walkSound);

        // Neuen Sound starten
        this.walkSound = SoundManager.play(this.soundWalk);
    }

    playSnoreSound() {
        if (this.snoreSound && !this.snoreSound.paused) return;

        SoundManager.stop(this.snoreSound);

        this.snoreSound = SoundManager.play(this.soundSnore);
    }
}
