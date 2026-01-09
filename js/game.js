let canvas;
let world;
let keyboard = new Keyboard();

let bgMusic = SoundManager.play(SoundHub.game.backgroundMusic, 0.5, true);


function init() {
    canvas = document.getElementById('canvas');
    startGame();
}

function startGame() {
    world = new World(canvas, keyboard); 
    bgMusic.play();
}

