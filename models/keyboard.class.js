/**
 * Manages keyboard and touch input for the game.
 * Although the class uses static flags, the constructor initializes
 * all event listeners for both desktop and mobile controls.
 */
class Keyboard {

    constructor() {
        Keyboard.setControls();
        Keyboard.setMobileControls();
    }

    /**
     * Registers all keyboard event listeners and updates the static
     * input flags based on keydown and keyup events.
     */
    static setControls() {
        window.addEventListener("keydown", (e) => {
            if (e.key === ' ' || e.key === "ArrowUp") Keyboard.SPACE = true;
            if (e.key === 'ArrowLeft') Keyboard.LEFT = true;
            if (e.key === "ArrowRight") Keyboard.RIGHT = true;
            if (e.key === 'd') Keyboard.D = true;
        });

        window.addEventListener("keyup", (e) => {
            if (e.key === ' ' || e.key === "ArrowUp") Keyboard.SPACE = false;
            if (e.key === 'ArrowLeft') Keyboard.LEFT = false;
            if (e.key === "ArrowRight") Keyboard.RIGHT = false;
            if (e.key === 'd') Keyboard.D = false;
        });
    }

    /**
     * Registers touch event listeners for mobile controls and updates
     * the static input flags based on touchstart and touchend events.
     *
     * Expected button IDs:
     * - btnLeft
     * - btnRight
     * - btnJump
     * - btnThrow
     */
    static setMobileControls() {
        document.getElementById('btnLeft').addEventListener('touchstart', () => { Keyboard.LEFT = true; });
        document.getElementById('btnLeft').addEventListener('touchend', () => { Keyboard.LEFT = false; });

        document.getElementById('btnRight').addEventListener('touchstart', () => { Keyboard.RIGHT = true; });
        document.getElementById('btnRight').addEventListener('touchend', () => { Keyboard.RIGHT = false; });

        document.getElementById('btnJump').addEventListener('touchstart', () => { Keyboard.SPACE = true; });
        document.getElementById('btnJump').addEventListener('touchend', () => { Keyboard.SPACE = false; });

        document.getElementById('btnThrow').addEventListener('touchstart', () => { Keyboard.D = true; });
        document.getElementById('btnThrow').addEventListener('touchend', () => { Keyboard.D = false; });
    }
}