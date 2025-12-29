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

    constructor() {
        super().loadImage("assets/img/2_character_pepe/2_walk/W-21.png");
        this.loadImages(this.imgsWalking);

        this.animate();
    }

    animate() {
        setInterval(() => {
            let index = this.currentImage % this.imgsWalking.length;
            let path = this.imgsWalking[index];
            this.img = this.imageCache[path];
            this.currentImage++;
        }, 100);
    }

    jump() {

    };

}
