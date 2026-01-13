/**
 * A centralized registry for all audio assets used in the game.
 *
 * SoundHub acts as a static, globally accessible container that organizes
 * every sound effect and music track into structured categories. This allows
 * game objects (Character, Enemies, Collectibles, UI, etc.) to play sounds
 * without hard‑coding file paths or creating new Audio() instances repeatedly.
 *
 * Key responsibilities:
 * - Provides pre‑configured Audio objects for background music and SFX.
 * - Ensures consistent volume levels and looping behavior across the game.
 * - Groups sounds by purpose (UI, character, enemies, collectibles, endboss).
 * - Prevents redundant audio loading and improves performance.
 * - Serves as the single source of truth for all sound assets.
 *
 * Usage examples:
 *   SoundManager.play(SoundHub.music.background);
 *   SoundManager.play(SoundHub.sfx.character.jump);
 *   SoundManager.play(SoundHub.sfx.collectibles.coin);
 *
 * Structure overview:
 * - `music`: Contains looping background tracks and one‑shot game state sounds
 *            (start, game over, etc.).
 *
 * - `sfx.ui`: Sounds for button clicks and interface interactions.
 *
 * - `sfx.character`: Sounds for player actions such as jumping, running,
 *                    taking damage, snoring, or dying.
 *
 * - `sfx.chicken`: Death sounds for normal and small chickens.
 *
 * - `sfx.collectibles`: Sounds for picking up bottles, coins, and throwing
 *                       or breaking bottles.
 *
 * - `sfx.endboss`: Sounds for the boss alert, hurt reaction, and death.
 *
 * All audio objects are created once at load time using static IIFEs,
 * ensuring they are ready to play immediately and never re‑initialized.
 *
 * The class contains no methods; it is purely a structured asset registry.
 */

class SoundHub {

    static music = {
        background: (() => {
            const a = new Audio("assets/sounds/game/backgroundsound.mp3");
            a.volume = 0.4;
            a.loop = true;
            return a;
        })(),

        gameStart: (() => {
            const a = new Audio("assets/sounds/game/gameStart.mp3");
            a.volume = 0.4;
            return a;
        })(),

        gameOver: (() => {
            const a = new Audio("assets/sounds/game/gameOver.mp3");
            a.volume = 0.5;
            return a;
        })()
    };

    static sfx = {

        ui: {
            click: (() => {
                const a = new Audio("assets/sounds/game/click.mp3");
                a.volume = 0.4;
                return a;
            })()
        },

        character: {
            damage: (() => {
                const a = new Audio("assets/sounds/character/characterDamage.mp3");
                a.volume = 0.4;
                return a;
            })(),

            dead: (() => {
                const a = new Audio("assets/sounds/character/characterDead.wav");
                a.volume = 0.5;
                return a;
            })(),

            jump: (() => {
                const a = new Audio("assets/sounds/character/characterJump.wav");
                a.volume = 0.3;
                return a;
            })(),

            run: (() => {
                const a = new Audio("assets/sounds/character/characterRun.mp3");
                a.volume = 0.2;
                return a;
            })(),

            snoring: (() => {
                const a = new Audio("assets/sounds/character/characterSnoring.mp3");
                a.volume = 0.25;
                return a;
            })()
        },

        chicken: {
            dead1: (() => {
                const a = new Audio("assets/sounds/chicken/chickenDead.mp3");
                a.volume = 0.4;
                return a;
            })(),

            dead2: (() => {
                const a = new Audio("assets/sounds/chicken/chickenDead2.mp3");
                a.volume = 0.4;
                return a;
            })()
        },

        collectibles: {
            bottle: (() => {
                const a = new Audio("assets/sounds/collectibles/bottleCollectSound.wav");
                a.volume = 0.4;
                return a;
            })(),

            bottleBreak: (() => {
                const a = new Audio("assets/sounds/throwable/bottleBreak.mp3");
                a.volume = 0.5;
                return a;
            })(),

            bottleThrow: (() => {
                const a = new Audio("assets/sounds/throwable/throw.mp3");
                a.volume = 0.4;
                return a;
            })(),

            coin: (() => {
                const a = new Audio("assets/sounds/collectibles/collectSound.wav");
                a.volume = 0.35;
                return a;
            })()
        },

        endboss: {
            alert: (() => {
                const a = new Audio("assets/sounds/endboss/endbossApproach.wav");
                a.volume = 0.6;
                return a;
            })(),

            hurt: (() => {
                const a = new Audio("assets/sounds/endboss/endbossHurt.wav");
                a.volume = 0.6;
                return a;
            })(),

            dead: (() => {
                const a = new Audio("assets/sounds/endboss/endbossDead.wav");
                a.volume = 0.7;
                return a;
            })()
        }
    };
}
