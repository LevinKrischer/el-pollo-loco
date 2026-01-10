let canvas;
let world;
let keyboard = new Keyboard();

let bgMusic = SoundHub.music.background; 

function init() {
    canvas = document.getElementById('canvas');
    showStartScreen();
}

function startGame() {
    hideStartScreen();
    document.activeElement.blur(); // Fokus entfernen, damit SPACE nicht erneut klickt

    world = new World(canvas, keyboard);
    world.start();

    // Hintergrundmusik nur starten, wenn nicht gemutet
    if (!SoundManager.muted) {
       bgMusic.play();
    }
}


function hideStartScreen() {
  const startScreen = document.getElementById("StartScreen");
  if (startScreen) {
    startScreen.classList.add("hidden");
  }
  canvas.style.display = "block";
  document.activeElement.blur();
}

function showStartScreen() {
  const startScreen = document.getElementById("StartScreen");
  if (startScreen) {
    startScreen.classList.remove("hidden");
  }
  canvas.style.display = "none";
}

function toggleSound() {
    const newState = !SoundManager.muted;
    SoundManager.setMutedState(newState);
    updateSoundButtonIcon();
}


function updateSoundButtonIcon() {
    const img = document.getElementById('soundToggleButton');

    img.src = SoundManager.muted
        ? './assets/img/0_project-images/sound-off.png'
        : './assets/img/0_project-images/sound-on.png';
}


