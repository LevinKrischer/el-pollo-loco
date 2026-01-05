class StatusBar extends DrawableObject {
    imgsStatusHealth = ImageHub.statusBar.health;
    imgsStatusCoins = ImageHub.statusBar.coins;
    imgsStatusBottles = ImageHub.statusBar.bottle;
    imgStatusBossHealth = ImageHub.statusBar.endboss;

    percentage = 100;

    constructor() {
        super();
        this.loadImages(this.imgsStatusHealth);
        this.loadImages(this.imgsStatusCoins);
        this.loadImages(this.imgsStatusBottles);
        this.loadImages(this.imgStatusBossHealth);
        this.x = 40;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.setPercentage(100, this.imgsStatusHealth);
    }

    setPercentage(_percentage, _type) {
        this.percentage = _percentage;

        if(this.percentage == 100) {
            this.loadImage(_type[5]);
        } else if (this.percentage > 80) {
            this.loadImage(_type[4]);
        } else if (this.percentage > 60) {
            this.loadImage(_type[3]);
        } else if (this.percentage > 40) {
            this.loadImage(_type[2]);
        } else if (this.percentage > 20) {
            this.loadImage(_type[1]);
        }  else if (this.percentage == 0) {
        this.loadImage(_type[0]);
        }
    }
}

