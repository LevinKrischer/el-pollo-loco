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
