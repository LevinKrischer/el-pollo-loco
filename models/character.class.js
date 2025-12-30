class Character extends MoveableObject {
    imgsWalking = ImageHub.character.walking;
    imgsIdle = ImageHub.character.idle;
    imgsIdleLong = ImageHub.character.long_idle;
    imgsJump = ImageHub.character.jumping;
    imgsHurt = ImageHub.character.hurt;
    imgsDead = ImageHub.character.dead;
    currentImage = 0;

    height = 250;
    y = 180;
    speed = 5;
    world;

    constructor() {
        super().loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.imgsWalking);

        this.animate();
    }

animate() {
setInterval(() => {
    if (Keyboard.RIGHT && this.x < this.world.level.level_end_x) {
        this.x += this.speed;
        this.otherDirection = false;
    }

    if (Keyboard.LEFT && this.x > 0) {
        this.x -= this.speed;
        this.otherDirection = true;
    }
    this.world.camera_x = -this.x + 100;
}, 1000 / 60)

    setInterval(() => {
        if (Keyboard.RIGHT || Keyboard.LEFT) {
            let index = this.currentImage % this.imgsWalking.length;
            let path = this.imgsWalking[index];
            this.img = this.imageCache[path];
            this.currentImage++;
        } 
    }, 50);
}



    jump() {

    };

}
