class Character extends MoveableObject {
    imgsWalking = ImageHub.character.walking;
    imgsIdle = ImageHub.character.idle;
    imgsIdleLong = ImageHub.character.long_idle;
    imgsJump = ImageHub.character.jumping;
    imgsHurt = ImageHub.character.hurt;
    imgsDead = ImageHub.character.dead;
    currentImage = 0;

    height = 250;
    y = 0;
    speed = 5;
    world;

    constructor() {
        super().loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.imgsWalking);
        this.loadImages(this.imgsJump);
        this.applyGravity();
        this.animate();
    }

    animate() {
        setInterval(() => {
            if (Keyboard.RIGHT && this.x < this.world.level.level_end_x) {
                this.x += this.speed;
                this.otherDirection = false;
            } else {
                if (Keyboard.LEFT && this.x > 0) {
                    this.x -= this.speed;
                    this.otherDirection = true;
                }
            }
            this.world.camera_x = -this.x + 100;
        }, 1000 / 60)

        setInterval(() => {
            if ((Keyboard.RIGHT || Keyboard.LEFT) && !this.isAboveGround()) {
                this.playAnimation(this.imgsWalking);
            }

            if (Keyboard.SPACE && !this.isAboveGround()) {
                 this.speedY = 20;
            }
        }, 50);

        setInterval(() => {
            if (this.isAboveGround()) {
                this.playAnimation(this.imgsJump);
            }
        }, 200 )
    }

    jump() {

    };

}
