class Keyboard {
    static SPACE = false;
    static D = false;
    static RIGHT = false;
    static LEFT = false;

    constructor() {
        Keyboard.setControls();
    }

    static setControls() {
        // KEYBOARD EVENTS
        window.addEventListener("keydown", (e) => {
            if (e.key == ' ' || e.key == "ArrowUp") Keyboard.SPACE = true;
            if (e.key == 'ArrowLeft') Keyboard.LEFT = true;
            if (e.key == "ArrowRight") Keyboard.RIGHT = true;
            if (e.key == 'd') Keyboard.D = true;
        });

        window.addEventListener("keyup", (e) => {
            if (e.key == ' ' || e.key == "ArrowUp") Keyboard.SPACE = false;
            if (e.key == 'ArrowLeft') Keyboard.LEFT = false;
            if (e.key == "ArrowRight") Keyboard.RIGHT = false;
            if (e.key == 'd') Keyboard.D = false;
        });
    }

    // static setMobileControls() {
    //     document.getElementById('btn-left').addEventListener('touchstart', () => {
    //         Keyboard.LEFT = true;
    //     });
    //     document.getElementById('btn-left').addEventListener('touchstart', () => {
    //         Keyboard.RIGHT = true;
    //     });
    //     document.getElementById('btn-left').addEventListener('touchstart', () => {
    //         Keyboard.SPACE = true;
    //     });
    //     document.getElementById('btn-left').addEventListener('touchstart', () => {
    //         Keyboard.D = true;
    //     });
    //     document.getElementById('btn-left').addEventListener('touchend', () => {
    //         Keyboard.LEFT = false;
    //     });
    //     document.getElementById('btn-left').addEventListener('touchend', () => {
    //         Keyboard.RIGHT = false;
    //     });
    //     document.getElementById('btn-left').addEventListener('touchend', () => {
    //         Keyboard.SPACE = false;
    //     });
    //     document.getElementById('btn-left').addEventListener('touchend', () => {
    //         Keyboard.D = false;
    //     });
    // }
}