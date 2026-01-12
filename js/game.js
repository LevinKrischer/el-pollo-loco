let canvas;
let world;
let keyboard = new Keyboard();
let bgMusic = SoundHub.music.background;

function init() {
    canvas = document.getElementById('canvas');
    startBgMusic();
    showStartScreen();
}

function startBgMusic() {
    SoundManager.play(bgMusic);
}

function startGame() {
    hideStartScreen();
    hideEndScreens();
    blurActiveElement();
    stopExistingWorld();
    createNewWorld();
    startBackgroundMusic();
}

function restartGame() {
    stopExistingWorld();
    closeVisibleEndScreen();
    setTimeout(startGame, 200);
}

function stopExistingWorld() {
    if (window.world) {
        window.world.stopGame();
        window.world = null;
    }
}

function createNewWorld() {
    world = new World(canvas, keyboard);
    world.start();
}

function startBackgroundMusic() {
    if (!SoundManager.muted) bgMusic.play();
}

function blurActiveElement() {
    document.activeElement.blur();
}

function hideStartScreen() {
    const startScreen = document.getElementById("startScreen");
    if (startScreen) startScreen.classList.add("hidden");
    canvas.style.display = "block";
    blurActiveElement();
}

function showStartScreen() {
    const startScreen = document.getElementById("startScreen");
    if (startScreen) startScreen.classList.remove("hidden");
    canvas.style.display = "none";
    closeVisibleEndScreen();
}

function toggleSound() {
    SoundManager.setMutedState(!SoundManager.muted);
    updateSoundButtonIcon();
}

function updateSoundButtonIcon() {
    const img = document.getElementById('soundToggleButton');
    img.src = SoundManager.muted
        ? './assets/img/0_project-images/sound-off.png'
        : './assets/img/0_project-images/sound-on.png';
}

function toggleImprint() {
    document.getElementById('imprintOverlay').classList.toggle('hidden');
}

function toggleOverlay(type) {
    const overlay = document.getElementById(type + 'Overlay');
    overlay.classList.contains('visible')
        ? hideOverlay(overlay)
        : showOverlay(overlay);
}

function hideOverlay(overlay) {
    overlay.classList.remove('visible');

    useTrackedOrNormalTimeout(function() {
        overlay.classList.add('invisible');
    }, 300);
}

function showOverlay(overlay) {
    overlay.classList.remove('invisible');

    requestAnimationFrame(function() {
        overlay.classList.add('visible');
    });
}

function toggleEndScreen(type) {
    const screen = document.getElementById(`${type}Screen`);
    screen.classList.contains('visible')
        ? hideEndScreen(screen)
        : showEndScreen(screen);
}

function hideEndScreen(screen) {
    screen.classList.remove('visible');

    useTrackedOrNormalTimeout(function() {
        screen.classList.add('invisible');
    }, 400);
}

function showEndScreen(screen) {
    screen.classList.remove('invisible');

    requestAnimationFrame(function() {
        screen.classList.add('visible');
    });
}

function closeVisibleEndScreen() {
    ['gameOver', 'win'].forEach(type => {
        const screen = document.getElementById(`${type}Screen`);
        if (screen.classList.contains('visible')) toggleEndScreen(type);
    });
}

function hideEndScreens() {
    document.getElementById('gameOverScreen').classList.add('invisible');
    document.getElementById('winScreen').classList.add('invisible');
}

function openMainMenu() {
    stopExistingWorld();
    hideEndScreens();
    showStartScreen();
    blurActiveElement();
}

function useTrackedOrNormalTimeout(callback, delay) {
    const canTrack = window.world && window.world.setTimeoutTracked;
    canTrack
        ? window.world.setTimeoutTracked(callback, delay)
        : setTimeout(callback, delay);
}

function initLevel() {
    return this.level;
}