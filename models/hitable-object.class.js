class HitableObject extends MoveableObject {

    energy = 100;
    lastHit = 0;
    dead = false;

    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    }

    hit(amount = 2) {
        this.energy -= amount;
        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = new Date().getTime();
        }
    }

    isHurt() {
        let timePassed = new Date().getTime() - this.lastHit; // Diff in ms
        timePassed = timePassed / 1000;
        return timePassed < 1;
    }

    isDead() {
        return this.dead || this.energy <= 0;
    }

    

    getRealFrame() {
        this.rX = this.x + this.offset.left;
        this.rY = this.y + this.offset.top;
        this.rWidth = this.width - this.offset.left - this.offset.right;
        this.rHeight = this.height - this.offset.top - this.offset.bottom;
    }


    isColliding(hitObj) {
        return this.rX + this.rWidth > hitObj.rX &&
            this.rX < hitObj.rX + hitObj.rWidth &&
            this.rY + this.rHeight > hitObj.rY &&
            this.rY < hitObj.rY + hitObj.rHeight;
    }

    die() {
        this.energy = 0;
        this.dead = true;
        this.speed = 0;

        // Bewegung stoppen
        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }

        // Nach kurzer Zeit entfernen
        setTimeout(() => {
            this.markedForDeletion = true;
        }, 5000);
    }


    drawFrame(ctx) {
        ctx.beginPath();
        ctx.lineWidth = '5';
        ctx.strokeStyle = 'blue';
        ctx.rect(this.rX, this.rY, this.rWidth, this.rHeight);
        ctx.stroke();
    }
}