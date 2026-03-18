class Cloud extends MoveableObject {
    
    y = 20;
    width = 500;
    height = 250;

    constructor() {
        super();
        this.loadImage("assets/img/5_background/layers/4_clouds/1.png");
        this.x = Math.random() * 3600;
    }

    /**
     * Called once the world reference is assigned.
     * Starts the cloud's movement animation.
     */
     initAfterWorldSet() {
        this.animate();
    }

    /**
     * Moves the cloud left continuously.
     */
     animate() {
        this.moveLeft();
    }
}

