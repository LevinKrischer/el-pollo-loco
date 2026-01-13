/**
 * The main canvas element used for rendering the game world.
 * @type {HTMLCanvasElement | null}
 */
let canvas;

/**
 * The active game world instance.
 * @type {World | null}
 */
let world;

/**
 * The global keyboard input handler.
 * @type {Keyboard}
 */
let keyboard;

/**
 * Background music audio object provided by SoundHub.
 * @type {HTMLAudioElement}
 */
let bgMusic = SoundHub.music.background;

/**
 * Initializes the game once the DOM is fully loaded.
 * 
 * This handler prevents default browser interactions such as the context menu
 * on right‑click and long‑press behavior on touch devices, ensuring a clean
 * fullscreen game experience. After disabling these interactions, the game
 * environment is initialized by creating the keyboard controller, retrieving
 * the canvas element, and instantiating the game world.
 */
window.addEventListener("DOMContentLoaded", () => {

    // Disable right-click and touch-hold behavior
    window.addEventListener("contextmenu", e => e.preventDefault());
    window.addEventListener("touchstart", e => e.preventDefault(), { passive: false });
    window.addEventListener("touchend",   e => e.preventDefault(), { passive: false });
    window.addEventListener("touchmove",  e => e.preventDefault(), { passive: false });

    // Initialize sound system
    SoundManager.init();
    updateSoundButtonIcon();

    // Initialize game
    keyboard = new Keyboard();
    canvas = document.getElementById('canvas');
    world = new World(canvas, keyboard);
});

/**
 * Initializes the game by preparing the canvas, starting background music,
 * and showing the start screen.
 */
function init() {
    canvas = document.getElementById('canvas');
    startBgMusic();
    showStartScreen();
}

/**
 * Plays the background music using the SoundManager.
 */
function startBgMusic() {
    SoundManager.play(bgMusic);
}

/**
 * Starts a new game session by resetting UI states, stopping any existing world,
 * creating a new world instance, and starting background music.
 */
function startGame() {
    hideStartScreen();
    hideEndScreens();
    blurActiveElement();
    stopExistingWorld();
    createNewWorld();
    startBackgroundMusic();
}

/**
 * Restarts the game after a short delay, ensuring the previous world instance
 * is fully cleaned up before starting a new one.
 */
function restartGame() {
    stopExistingWorld();
    closeVisibleEndScreen();
    setTimeout(startGame, 200);
}

/**
 * Stops the currently running world instance if one exists.
 */
function stopExistingWorld() {
    if (window.world) {
        window.world.stopGame();
        window.world = null;
    }
}

/**
 * Creates a new world instance and starts the game loop.
 */
function createNewWorld() {
    world = new World(canvas, keyboard);
    world.start();
}

/**
 * Starts background music if the sound system is not muted.
 */
function startBackgroundMusic() {
    SoundManager.play(bgMusic);
}

/**
 * Removes focus from the currently active DOM element.
 */
function blurActiveElement() {
    document.activeElement.blur();
}

/**
 * Hides the start screen and shows the game canvas.
 */
function hideStartScreen() {
    const startScreen = document.getElementById("startScreen");
    if (startScreen) startScreen.classList.add("hidden");
    canvas.style.display = "block";
    blurActiveElement();
}

/**
 * Shows the start screen and hides the game canvas.
 */
function showStartScreen() {
    const startScreen = document.getElementById("startScreen");
    if (startScreen) startScreen.classList.remove("hidden");
    canvas.style.display = "none";
    closeVisibleEndScreen();
}

/**
 * Toggles the global sound state (muted/unmuted) and updates the UI icon.
 */
function toggleSound() {
    SoundManager.toggleMute();
    updateSoundButtonIcon();
}

/**
 * Updates the sound toggle button icon depending on the mute state.
 */
function updateSoundButtonIcon() {
    const img = document.getElementById('soundToggleButton');
    img.src = SoundManager.muted
        ? './assets/img/0_project-images/sound-off.png'
        : './assets/img/0_project-images/sound-on.png';
}

/**
 * Toggles the visibility of the imprint overlay.
 */
function toggleImprint() {
    document.getElementById('imprintOverlay').classList.toggle('hidden');
}

/**
 * Toggles visibility of a generic overlay by type name.
 *
 * @param {string} type - The overlay type (e.g., "controls", "imprint").
 */
function toggleOverlay(type) {
    const overlay = document.getElementById(type + 'Overlay');
    overlay.classList.contains('visible')
        ? hideOverlay(overlay)
        : showOverlay(overlay);
}

/**
 * Hides an overlay with a fade-out animation.
 *
 * @param {HTMLElement} overlay - The overlay element to hide.
 */
function hideOverlay(overlay) {
    overlay.classList.remove('visible');

    useTrackedOrNormalTimeout(() => {
        overlay.classList.add('invisible');
    }, 300);
}

/**
 * Shows an overlay with a fade-in animation.
 *
 * @param {HTMLElement} overlay - The overlay element to show.
 */
function showOverlay(overlay) {
    overlay.classList.remove('invisible');

    requestAnimationFrame(() => {
        overlay.classList.add('visible');
    });
}

/**
 * Toggles visibility of an end screen (e.g., "gameOver", "win").
 *
 * @param {string} type - The end screen type.
 */
function toggleEndScreen(type) {
    const screen = document.getElementById(`${type}Screen`);
    screen.classList.contains('visible')
        ? hideEndScreen(screen)
        : showEndScreen(screen);
}

/**
 * Hides an end screen with animation.
 *
 * @param {HTMLElement} screen - The screen element to hide.
 */
function hideEndScreen(screen) {
    screen.classList.remove('visible');

    useTrackedOrNormalTimeout(() => {
        screen.classList.add('invisible');
    }, 400);
}

/**
 * Shows an end screen with animation.
 *
 * @param {HTMLElement} screen - The screen element to show.
 */
function showEndScreen(screen) {
    screen.classList.remove('invisible');

    requestAnimationFrame(() => {
        screen.classList.add('visible');
    });
}

/**
 * Closes any currently visible end screen.
 */
function closeVisibleEndScreen() {
    ['gameOver', 'win'].forEach(type => {
        const screen = document.getElementById(`${type}Screen`);
        if (screen.classList.contains('visible')) toggleEndScreen(type);
    });
}

/**
 * Immediately hides both end screens without animation.
 */
function hideEndScreens() {
    document.getElementById('gameOverScreen').classList.add('invisible');
    document.getElementById('winScreen').classList.add('invisible');
}

/**
 * Returns to the main menu by stopping the world and resetting UI states.
 */
function openMainMenu() {
    stopExistingWorld();
    hideEndScreens();
    showStartScreen();
    blurActiveElement();
}

/**
 * Uses the world's tracked timeout system if available, otherwise falls back
 * to the native setTimeout.
 *
 * @param {Function} callback - The function to execute after the delay.
 * @param {number} delay - Delay in milliseconds.
 */
function useTrackedOrNormalTimeout(callback, delay) {
    const canTrack = window.world && window.world.setTimeoutTracked;
    canTrack
        ? window.world.setTimeoutTracked(callback, delay)
        : setTimeout(callback, delay);
}

/**
 * Returns the current level of the world.
 *
 * @returns {Level} The active level instance.
 */
function initLevel() {
    return this.level;
}
