class HitableObject extends MoveableObject {

    energy = 100;
    lastHit = 0;
    dead = false;
    deathSoundPlayed = false;

    // --- SOUND REFERENCES ---
    soundEndbossHurt = SoundHub.sfx.endboss.hurt;
    soundEndbossDead = SoundHub.sfx.endboss.dead;

    soundChickenDead1 = SoundHub.sfx.chicken.dead1;
    soundChickenDead2 = SoundHub.sfx.chicken.dead2;

    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    hit(amount = 2) {
        if (this.isHurt()) return;

        this.energy -= amount;

        if (this.energy < 0) {
            this.energy = 0;
        } else {
            this.lastHit = Date.now();

            // Hurt-Sound für Pepe
            if (this instanceof Character) {
                SoundManager.play(this.soundHurt);
                SoundManager.stop(this.walkSound);
                SoundManager.stop(this.snoreSound);
            }

            // Hurt-Sound für Endboss
            if (this.isEndboss) {
                SoundManager.play(this.soundEndbossHurt);
            }
        }
    }

    isHurt() {
        let timePassed = (Date.now() - this.lastHit) / 1000;
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
        return (
            this.rX + this.rWidth > hitObj.rX &&
            this.rX < hitObj.rX + hitObj.rWidth &&
            this.rY + this.rHeight > hitObj.rY &&
            this.rY < hitObj.rY + hitObj.rHeight
        );
    }

    die() {
        this.energy = 0;
        this.dead = true;
        this.speed = 0;

        if (!this.deathSoundPlayed) {

            if (this instanceof Chicken) {
                SoundManager.play(this.soundChickenDead1);
            }

            else if (this instanceof ChickenSmall) {
                SoundManager.play(this.soundChickenDead2);
            }

            else if (this instanceof Endboss) {
                SoundManager.play(this.soundEndbossDead);
            }

            this.deathSoundPlayed = true;
        }

        if (this.moveInterval) {
            clearInterval(this.moveInterval);
        }

        setTimeout(() => {
            this.markedForDeletion = true;
        }, 5000);
    }
}
