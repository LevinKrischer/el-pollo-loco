class ThrowableObject extends HitableObject {

    offset = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    constructor(x, y) {
        super();
        this.x = x;
        this.y = y;
        this.height = 80;
        this.width = 80;
    }

    throw(facingLeft) {
        this.isThrown = true;

        this.speedY = 15;
        this.applyGravity();

        const direction = facingLeft ? -10 : 10;

        this.throwInterval = this.world.setIntervalTracked(() => {
            this.x += direction;
        }, 25);
    }
}
