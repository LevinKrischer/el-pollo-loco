class Coin extends MoveableObject {

    offset = {
        top: 10,
        right: 10,
        bottom: 10,
        left: 10
    };

    constructor(x, y) {
        super()
        this.loadImage(ImageHub.coin.rotating[0]);
        this.loadImages(ImageHub.coin.rotating);

        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
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