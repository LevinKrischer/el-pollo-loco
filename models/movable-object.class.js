class MoveableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    currentImage = 0;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    lastHit = 0;

    applyGravity() {
        this.gravityInterval = setInterval(() => {
            this.y -= this.speedY;
            this.speedY -= this.acceleration;

            if (!this.isAboveGround()) {
                this.speedY = 0;
            }
        }, 1000 / 25);
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        } else {
            return this.y < 180;
        }
    }

    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rWidth = this.width - this.offset.left - this.offset.right;
        this.rHeight = this.height - this.offset.top - this.offset.bottom;
    }

    moveRight() {
        setInterval(() => {
            this.x += this.speed;
        }, 1000 / 60);
    }

    moveLeft() {
        this.moveInterval = setInterval(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    stopMoving() {
        clearInterval(this.moveInterval);
    }

    playAnimation(images) {
        let index = this.currentImage % images.length;
        let path = images[index];
        this.img = this.imageCache[path];
        this.currentImage++;
    }

    updatePosition() {
        if (this.dead || this.energy <= 0) return;

        if (this.speed === 0) return;

        if (this.otherDirection) {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }
    }





}