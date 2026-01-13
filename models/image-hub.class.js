/**
 * A centralized registry for all image asset paths used throughout the game.
 *
 * The ImageHub class acts as a static, read‑only container that organizes
 * every sprite sheet, animation frame sequence, and background layer into
 * structured categories. This allows all drawable and animated objects
 * (Character, Enemies, BackgroundObject, StatusBars, etc.) to load their
 * required images without hard‑coding file paths inside each class.
 *
 * Key benefits:
 * - Ensures all image paths are maintained in one place.
 * - Makes asset management scalable and easier to update.
 * - Provides consistent structure for animations (idle, walking, hurt, etc.).
 * - Prevents typos and duplicated strings across the codebase.
 * - Allows game objects to preload entire animation sequences efficiently.
 *
 * The class contains no methods; all properties are static so they can be
 * accessed globally without instantiation:
 *
 * Example:
 *   this.loadImages(ImageHub.character.walking);
 *   this.loadImage(ImageHub.background.air[0]);
 *
 * Categories include:
 * - character animations (idle, long idle, walking, jumping, hurt, dead)
 * - enemy animations (chicken, small chicken, endboss)
 * - background layers for parallax scrolling
 * - status bar images (health, bottles, coins, endboss health)
 * - collectible items (coins, bottles)
 *
 * This structure makes ImageHub the single source of truth for all visual
 * assets in the game.
 */

class ImageHub {
    static character = {
        idle: [
            "assets/img/2_character_pepe/1_idle/idle/I-1.png",
            "assets/img/2_character_pepe/1_idle/idle/I-2.png",
            "assets/img/2_character_pepe/1_idle/idle/I-3.png",
            "assets/img/2_character_pepe/1_idle/idle/I-4.png",
            "assets/img/2_character_pepe/1_idle/idle/I-5.png",
            "assets/img/2_character_pepe/1_idle/idle/I-6.png",
            "assets/img/2_character_pepe/1_idle/idle/I-7.png",
            "assets/img/2_character_pepe/1_idle/idle/I-8.png",
            "assets/img/2_character_pepe/1_idle/idle/I-9.png",
            "assets/img/2_character_pepe/1_idle/idle/I-10.png"
        ],

        long_idle: [
            "assets/img/2_character_pepe/1_idle/long_idle/I-11.png",
            "assets/img/2_character_pepe/1_idle/long_idle/I-12.png",
            "assets/img/2_character_pepe/1_idle/long_idle/I-13.png",
            "assets/img/2_character_pepe/1_idle/long_idle/I-14.png",
            "assets/img/2_character_pepe/1_idle/long_idle/I-15.png",
            "assets/img/2_character_pepe/1_idle/long_idle/I-16.png",
            "assets/img/2_character_pepe/1_idle/long_idle/I-17.png",
            "assets/img/2_character_pepe/1_idle/long_idle/I-18.png",
            "assets/img/2_character_pepe/1_idle/long_idle/I-19.png",
            "assets/img/2_character_pepe/1_idle/long_idle/I-20.png"

        ],
        walking: [
            "assets/img/2_character_pepe/2_walk/W-21.png",
            "assets/img/2_character_pepe/2_walk/W-22.png",
            "assets/img/2_character_pepe/2_walk/W-23.png",
            "assets/img/2_character_pepe/2_walk/W-24.png",
            "assets/img/2_character_pepe/2_walk/W-25.png",
            "assets/img/2_character_pepe/2_walk/W-26.png"
        ],
        jumping: [
            "assets/img/2_character_pepe/3_jump/J-31.png",
            "assets/img/2_character_pepe/3_jump/J-32.png",
            "assets/img/2_character_pepe/3_jump/J-33.png",
            "assets/img/2_character_pepe/3_jump/J-34.png",
            "assets/img/2_character_pepe/3_jump/J-35.png",
            "assets/img/2_character_pepe/3_jump/J-36.png",
            "assets/img/2_character_pepe/3_jump/J-37.png",
            "assets/img/2_character_pepe/3_jump/J-38.png",
            "assets/img/2_character_pepe/3_jump/J-39.png",
        ],
        hurt: [
            "assets/img/2_character_pepe/4_hurt/H-41.png",
            "assets/img/2_character_pepe/4_hurt/H-42.png",
            "assets/img/2_character_pepe/4_hurt/H-43.png"
        ],
        dead: [
            "assets/img/2_character_pepe/5_dead/D-51.png",
            "assets/img/2_character_pepe/5_dead/D-52.png",
            "assets/img/2_character_pepe/5_dead/D-53.png",
            "assets/img/2_character_pepe/5_dead/D-54.png",
            "assets/img/2_character_pepe/5_dead/D-55.png",
            "assets/img/2_character_pepe/5_dead/D-56.png",
            "assets/img/2_character_pepe/5_dead/D-57.png"
        ]
    }

    static chicken = {
        walking: [
            "assets/img/3_enemies_chicken/chicken_normal/1_walk/1_w.png",
            "assets/img/3_enemies_chicken/chicken_normal/1_walk/2_w.png",
            "assets/img/3_enemies_chicken/chicken_normal/1_walk/3_w.png"
        ],
        dead: [
            "assets/img/3_enemies_chicken/chicken_normal/2_dead/dead.png"
        ]
    }

    static chickenSmall = {
        walking: [
            "assets/img/3_enemies_chicken/chicken_small/1_walk/1_w.png",
            "assets/img/3_enemies_chicken/chicken_small/1_walk/2_w.png",
            "assets/img/3_enemies_chicken/chicken_small/1_walk/3_w.png"
        ],
        dead: [
            "assets/img/3_enemies_chicken/chicken_small/2_dead/dead.png"
        ]
    }
    static background = {
        air: [
            "assets/img/5_background/layers/air.png"
        ],
        third: [
            "assets/img/5_background/layers/3_third_layer/1.png",
            "assets/img/5_background/layers/3_third_layer/2.png",
            "assets/img/5_background/layers/3_third_layer/3.png"
        ],
        second: [
            "assets/img/5_background/layers/2_second_layer/1.png",
            "assets/img/5_background/layers/2_second_layer/2.png",
            "assets/img/5_background/layers/2_second_layer/3.png"
        ],
        first: [
            "assets/img/5_background/layers/1_first_layer/1.png",
            "assets/img/5_background/layers/1_first_layer/2.png",
            "assets/img/5_background/layers/1_first_layer/3.png"
        ]
    };

    static endboss = {
        walking: [
            "assets/img/4_enemie_boss_chicken/1_walk/G1.png",
            "assets/img/4_enemie_boss_chicken/1_walk/G2.png",
            "assets/img/4_enemie_boss_chicken/1_walk/G3.png",
            "assets/img/4_enemie_boss_chicken/1_walk/G4.png"
        ],
        alert: [
            "assets/img/4_enemie_boss_chicken/2_alert/G5.png",
            "assets/img/4_enemie_boss_chicken/2_alert/G6.png",
            "assets/img/4_enemie_boss_chicken/2_alert/G7.png",
            "assets/img/4_enemie_boss_chicken/2_alert/G8.png",
            "assets/img/4_enemie_boss_chicken/2_alert/G9.png",
            "assets/img/4_enemie_boss_chicken/2_alert/G10.png",
            "assets/img/4_enemie_boss_chicken/2_alert/G11.png",
            "assets/img/4_enemie_boss_chicken/2_alert/G12.png"

        ],
        attack: [
            "assets/img/4_enemie_boss_chicken/3_attack/G13.png",
            "assets/img/4_enemie_boss_chicken/3_attack/G14.png",
            "assets/img/4_enemie_boss_chicken/3_attack/G15.png",
            "assets/img/4_enemie_boss_chicken/3_attack/G16.png",
            "assets/img/4_enemie_boss_chicken/3_attack/G17.png",
            "assets/img/4_enemie_boss_chicken/3_attack/G18.png",
            "assets/img/4_enemie_boss_chicken/3_attack/G19.png",
            "assets/img/4_enemie_boss_chicken/3_attack/G20.png"
        ],
        hurt: [
            "assets/img/4_enemie_boss_chicken/4_hurt/G21.png",
            "assets/img/4_enemie_boss_chicken/4_hurt/G22.png",
            "assets/img/4_enemie_boss_chicken/4_hurt/G23.png"
        ],
        dead: [
            "assets/img/4_enemie_boss_chicken/5_dead/G24.png",
            "assets/img/4_enemie_boss_chicken/5_dead/G25.png",
            "assets/img/4_enemie_boss_chicken/5_dead/G26.png"
        ]
    }

    static statusBar = {
        health: [
            "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/0.png",
            "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/20.png",
            "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/40.png",
            "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/60.png",
            "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
            "assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",

        ],
        bottle: [
            "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/0.png",
            "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/20.png",
            "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
            "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
            "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/80.png",
            "assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/100.png"
        ],
        coins: [
            "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
            "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
            "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/40.png",
            "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/60.png",
            "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/80.png",
            "assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/100.png"
        ],
        endboss: [
            "assets/img/7_statusbars/2_statusbar_endboss/green/green0.png",
            "assets/img/7_statusbars/2_statusbar_endboss/green/green20.png",
            "assets/img/7_statusbars/2_statusbar_endboss/green/green40.png",
            "assets/img/7_statusbars/2_statusbar_endboss/green/green60.png",
            "assets/img/7_statusbars/2_statusbar_endboss/green/green80.png",
            "assets/img/7_statusbars/2_statusbar_endboss/green/green100.png"
        ]
    }

    static coin = {
        rotating: [
            "assets/img/8_coin/coin_1.png",
            "assets/img/8_coin/coin_2.png",
        ]
    }

    static bottle = {
        normal: [
            "assets/img/6_salsa_bottle/1_salsa_bottle_on_ground.png",
            "assets/img/6_salsa_bottle/2_salsa_bottle_on_ground.png"
        ],
        rotating: [
            "assets/img/6_salsa_bottle/bottle_rotation/1_bottle_rotation.png",
            "assets/img/6_salsa_bottle/bottle_rotation/2_bottle_rotation.png",
            "assets/img/6_salsa_bottle/bottle_rotation/3_bottle_rotation.png",
            "assets/img/6_salsa_bottle/bottle_rotation/4_bottle_rotation.png"
        ],
        splash: [
            "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/1_bottle_splash.png",
            "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/2_bottle_splash.png",
            "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/3_bottle_splash.png",
            "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/4_bottle_splash.png",
            "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/5_bottle_splash.png",
            "assets/img/6_salsa_bottle/bottle_rotation/bottle_splash/6_bottle_splash.png"
        ]
    }
}