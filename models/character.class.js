class Character extends MoveableObject {
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

    lastMoveTime = Date.now();
    longIdleDelay = 5000;

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
        this.world.camera_x = -this.x + 100;
        requestAnimationFrame(() => 
            this.update());
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

        if (Keyboard.SPACE && !this.isAboveGround()) {
            this.speedY = 20;
            this.lastMoveTime = Date.now();
        }
    }

    updateAnimation() {
        if (this.isDead()) 
            return this.playAnimation(this.imgsDead);
        if (this.isHurt()) 
            return this.playAnimation(this.imgsHurt);
        if (this.isAboveGround()) 
            return this.playAnimation(this.imgsJump);
        if (Keyboard.RIGHT || Keyboard.LEFT) 
            return this.playAnimation(this.imgsWalking);

        this.handleIdleAnimation();
    }

    handleIdleAnimation() {
        const idleTime = Date.now() - this.lastMoveTime;
        if (idleTime > this.longIdleDelay) {
            this.playAnimation(this.imgsIdleLong);
        } else {
            this.playAnimation(this.imgsIdle);
        }
    }
}