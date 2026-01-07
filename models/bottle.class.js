class Bottle extends HitableObject {
    offset = {
        top: 10,
        right: 24,
        bottom: 8,
        left: 24
    };

    constructor(x, y) {
        super().loadImage(ImageHub.bottle.normal[0]);
        this.x = x;
        this.y = y;
        this.width = 60;
        this.height = 60;
    }
}