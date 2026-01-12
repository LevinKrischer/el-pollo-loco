class MoveableObject extends DrawableObject {
    speed = 0.15;
    otherDirection = false;
    currentImage = 0;
    speedY = 0;
    acceleration = 2;
    energy = 100;
    lastHit = 0;

    initAfterWorldSet() {
        this.applyGravity();
    }

    applyGravity() {
        this.gravityInterval = this.world.setIntervalTracked(() => {
            this.applyGravityStep();
        }, 1000 / 25);
    }

    applyGravityStep() {
        this.y -= this.speedY;
        this.speedY -= this.acceleration;

        if (!this.isAboveGround()) {
            this.speedY = 0;
        }
    }

    isAboveGround() {
        if (this instanceof ThrowableObject) {
            return true;
        }
        return this.y < 180;
    }

    getRealFrame() {
        this.calculateRealX();
        this.calculateRealY();
        this.calculateRealWidth();
        this.calculateRealHeight();
    }

    calculateRealX() {
        this.rX = this.x + this.offset.left;
    }

    calculateRealY() {
        this.rY = this.y + this.offset.top;
    }

    calculateRealWidth() {
        this.rWidth = this.width - this.offset.left - this.offset.right;
    }

    calculateRealHeight() {
        this.rHeight = this.height - this.offset.top - this.offset.bottom;
    }

    moveRight() {
        this.world.setIntervalTracked(() => {
            this.x += this.speed;
        }, 1000 / 60);
    }

    moveLeft() {
        this.moveInterval = this.world.setIntervalTracked(() => {
            this.x -= this.speed;
        }, 1000 / 60);
    }

    stopMoving() {
        clearInterval(this.moveInterval);
    }

    playAnimation(images) {
        const index = this.currentImage % images.length;
        const path = images[index];

        this.img = this.imageCache[path];
        this.currentImage++;
    }

    updatePosition() {
        if (this.dead || this.energy <= 0) return;
        if (this.speed === 0) return;

        this.applyMovementDirection();
    }

    applyMovementDirection() {
        if (this.otherDirection) {
            this.x += this.speed;
        } else {
            this.x -= this.speed;
        }
    }
}
