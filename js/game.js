let canvas;
let world;
let keyboard;
let bgMusic = SoundHub.music.background;
const TOUCH_CONTROLS_STORAGE_KEY = 'touchControlsVisible';

/**
 * Arms one-time listeners that start background music after the
 * first explicit user interaction (required by browser autoplay rules).
 */
 function setupFirstInteractionMusicTrigger() {
    const trigger = () => startBackgroundMusic();
    window.addEventListener('pointerdown', trigger, { once: true });
    window.addEventListener('keydown', trigger, { once: true });
    window.addEventListener('touchstart', trigger, { once: true, passive: true });
}

/**
 * Returns whether a touch event should suppress the browser default behavior.
 * Only gameplay surfaces are blocked so menu and overlay buttons stay tappable.
 * @param {TouchEvent} event - The touch event to evaluate.
 * @returns {boolean} True if the default browser behavior should be prevented.
 */
 function shouldPreventTouchDefault(event) {
    const target = event.target;
    if (!(target instanceof Element)) return false;
    return Boolean(target.closest('canvas, .mobileButtons, .mobileButton'));
}

/**
 * Prevents default browser touch behavior only on gameplay-related elements.
 * @param {TouchEvent} event - The touch event to handle.
 */
 function handleTouchInteraction(event) {
    if (shouldPreventTouchDefault(event)) {
        event.preventDefault();
    }
}

/**
 * Initializes the game once the DOM is fully loaded.
 * This handler prevents default browser interactions such as the context menu
 * on right‑click and long‑press behavior on touch devices, ensuring a clean
 * fullscreen game experience. After disabling these interactions, the game
 * environment is initialized by creating the keyboard controller, retrieving
 * the canvas element, and instantiating the game world.
 */
 window.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("contextmenu", e => e.preventDefault());
    window.addEventListener("touchstart", handleTouchInteraction, { passive: false });
    window.addEventListener("touchend", handleTouchInteraction, { passive: false });
    window.addEventListener("touchmove", handleTouchInteraction, { passive: false });
    SoundManager.init();
    updateSoundButtonIcon();
    updateGameplaySoundButtonIcon();
    setupFirstInteractionMusicTrigger();
    keyboard = new Keyboard();
    canvas = document.getElementById('canvas');
});

/**
 * Initializes the game by preparing the canvas and showing the start screen.
 */
 function init() {
    const canvas_el = document.getElementById('canvas');
    canvas = canvas_el;
    showStartScreen();
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
    if (!bgMusic.paused) return;
    SoundManager.play(bgMusic);
}

/**
 * Removes focus from the currently active DOM element.
 */
 function blurActiveElement() {
    document.activeElement.blur();
}

/**
 * Shows or hides the gameplay button section.
 * @param {boolean} visible - Whether the section should be visible.
 */
 function setGameplayButtonsVisibility(visible) {
    const gameplayButtons = document.querySelector('.gameplayButtons');
    if (!gameplayButtons) return;
    gameplayButtons.classList.toggle('hidden', !visible);
}

/**
 * Shows or hides the touch control buttons across all screen sizes.
 * @param {boolean} visible - Whether mobile controls should be visible.
 */
 function setMobileButtonsVisibility(visible) {
    const mobileButtons = document.querySelector('.mobileButtons');
    if (!mobileButtons) return;
    mobileButtons.classList.toggle('hidden', !visible);
    mobileButtons.classList.toggle('show', visible);
}

/**
 * Returns whether touch controls should be visible by default
 * for the current device.
 * @returns {boolean} True on touch-first devices.
 */
 function shouldShowTouchControlsByDefault() {
    const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
    const touchCapability = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    return coarsePointer || touchCapability;
}

/**
 * Returns the persisted touch-controls visibility state.
 * @returns {boolean|null} True/false if stored, otherwise null.
 */
 function getSavedTouchControlsVisibility() {
    const saved = localStorage.getItem(TOUCH_CONTROLS_STORAGE_KEY);
    if (saved === null) return null;
    return saved === 'true';
}

/**
 * Persists touch-controls visibility in localStorage.
 * @param {boolean} visible - Whether touch controls are visible.
 */
 function saveTouchControlsVisibility(visible) {
    localStorage.setItem(TOUCH_CONTROLS_STORAGE_KEY, visible);
}

/**
 * Resolves touch-controls visibility from storage or responsive default.
 * @returns {boolean} Final visibility state to apply.
 */
 function resolveTouchControlsVisibility() {
    const savedVisibility = getSavedTouchControlsVisibility();
    if (savedVisibility !== null) return savedVisibility;
    const defaultVisibility = shouldShowTouchControlsByDefault();
    saveTouchControlsVisibility(defaultVisibility);
    return defaultVisibility;
}

/**
 * Applies saved/default touch-controls visibility and refreshes the icon.
 */
 function applyDefaultTouchControlsState() {
    setMobileButtonsVisibility(resolveTouchControlsVisibility());
    updateGameplayTouchButtonIcon();
}

/**
 * Hides the start screen and shows the game canvas.
 */
 function hideStartScreen() {
    const startScreen = document.getElementById("startScreen");
    const soundButton = document.getElementById("gameplaySoundButton");
    const touchToggleButton = document.getElementById("gameplayShowTouchButton");
    if (startScreen) startScreen.classList.add("hidden");
    canvas.style.display = "block";
    setGameplayButtonsVisibility(true);
    if (soundButton) soundButton.classList.remove("hidden");
    if (touchToggleButton) touchToggleButton.classList.remove("hidden");
    applyDefaultTouchControlsState();
    blurActiveElement();
}

/**
 * Shows the start screen and hides the game canvas.
 */
 function showStartScreen() {
    const startScreen = document.getElementById("startScreen");
    const soundButton = document.getElementById("gameplaySoundButton");
    const touchToggleButton = document.getElementById("gameplayShowTouchButton");
    if (startScreen) startScreen.classList.remove("hidden");
    canvas.style.display = "none";
    setGameplayButtonsVisibility(false);
    if (soundButton) soundButton.classList.add("hidden");
    if (touchToggleButton) touchToggleButton.classList.add("hidden");
    setMobileButtonsVisibility(false);
    updateGameplayTouchButtonIcon();
    closeVisibleEndScreen();
}

/**
 * Toggles the global sound state (muted/unmuted) and updates the UI icons.
 * Removes focus from the button to prevent keyboard input conflicts.
 */
 function toggleSound() {
    SoundManager.toggleMute();
    updateSoundButtonIcon();
    updateGameplaySoundButtonIcon();
    document.getElementById('gameplaySoundButton').blur();
}

/**
 * Toggles visibility of the mobile touch controls.
 */
 function toggleTouchControls() {
    const mobileButtons = document.querySelector('.mobileButtons');
    const touchToggleButton = document.getElementById('gameplayShowTouchButton');
    const controlsAreVisible = getComputedStyle(mobileButtons).display !== 'none';
    const nextVisibility = !controlsAreVisible;
    if (!mobileButtons || !touchToggleButton) return;
    setMobileButtonsVisibility(nextVisibility);
    saveTouchControlsVisibility(nextVisibility);
    updateGameplayTouchButtonIcon();
    touchToggleButton.blur();
}

/**
 * Updates the touch-controls toggle icon based on the current visibility state.
 */
 function updateGameplayTouchButtonIcon() {
    const icon = document.getElementById('gameplayShowTouchIcon');
    const mobileButtons = document.querySelector('.mobileButtons');
    const controlsAreVisible = getComputedStyle(mobileButtons).display !== 'none';
    if (!icon || !mobileButtons) return;
    icon.src = controlsAreVisible ? './assets/img/0_project-images/tap-off.png' : './assets/img/0_project-images/tap.png';
}

/**
 * Updates the sound toggle button icon depending on the mute state.
 */
 function updateSoundButtonIcon() {
    const img = document.getElementById('soundToggleButton');
    img.src = SoundManager.muted ? './assets/img/0_project-images/sound-off.png' : './assets/img/0_project-images/sound-on.png';
}

/**
 * Updates the gameplay sound button icon depending on the mute state.
 */
 function updateGameplaySoundButtonIcon() {
    const img = document.getElementById('gameplaySoundIcon');
    img.src = SoundManager.muted ? './assets/img/0_project-images/sound-off.png' : './assets/img/0_project-images/sound-on.png';
}

/**
 * Toggles the visibility of the imprint overlay.
 */
 function toggleImprint() {
    document.getElementById('imprintOverlay').classList.toggle('hidden');
}

/**
 * Toggles visibility of a generic overlay by type name.
 * @param {string} type - The overlay type (e.g., "controls", "imprint").
 */
 function toggleOverlay(type) {
    const overlay = document.getElementById(type + 'Overlay');
    overlay.classList.contains('visible') ? hideOverlay(overlay) : showOverlay(overlay);
}

/**
 * Hides an overlay with a fade-out animation.
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
 * @param {string} type - The end screen type.
 */
 function toggleEndScreen(type) {
    const screen = document.getElementById(`${type}Screen`);
    screen.classList.contains('visible') ? hideEndScreen(screen) : showEndScreen(screen);
}

/**
 * Hides an end screen with animation.
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
 * @param {HTMLElement} screen - The screen element to show.
 */
 function showEndScreen(screen) {
    const soundButton = document.getElementById("gameplaySoundButton");
    const touchToggleButton = document.getElementById("gameplayShowTouchButton");
    screen.classList.remove('invisible');
    setGameplayButtonsVisibility(false);
    if (soundButton) soundButton.classList.add("hidden");
    if (touchToggleButton) touchToggleButton.classList.add("hidden");
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
    const soundButton = document.getElementById("gameplaySoundButton");
    const touchToggleButton = document.getElementById("gameplayShowTouchButton");
    document.getElementById('gameOverScreen').classList.add('invisible');
    document.getElementById('winScreen').classList.add('invisible');
    setGameplayButtonsVisibility(true);
    if (soundButton) soundButton.classList.remove("hidden");
    if (touchToggleButton) touchToggleButton.classList.remove("hidden");
    applyDefaultTouchControlsState();
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
 * @param {Function} callback - The function to execute after the delay.
 * @param {number} delay - Delay in milliseconds.
 */
 function useTrackedOrNormalTimeout(callback, delay) {
    const canTrack = window.world && window.world.setTimeoutTracked;
    canTrack ? window.world.setTimeoutTracked(callback, delay) : setTimeout(callback, delay);
}

/**
 * Returns the current level of the world.
 * @returns {Level} The active level instance.
 */
 function initLevel() {
    return this.level;
}
