class Coin extends MoveableObject {

    width = 80;
    height = 80;

    offset = {
        top: 20,
        right: 20,
        bottom: 20,
        left: 20
    };

    constructor(x, y) {
        super()
        this.loadImage(ImageHub.coin.rotating[0]);
        this.loadImages(ImageHub.coin.rotating);

        this.x = x;
        this.y = y;
    }

    initAfterWorldSet() {
    this.animate();
}


    animate() {
        this.world.setIntervalTracked(() => {
            this.playAnimation(ImageHub.coin.rotating);
        }, 200);
    }
}