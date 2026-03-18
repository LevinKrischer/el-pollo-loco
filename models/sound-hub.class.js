class SoundHub {

    static music = {
        background: (() => {
            const audio = new Audio("assets/sounds/game/backgroundsound.mp3");
            audio.volume = 0.4;
            audio.loop = true;
            return audio;
        })(),

        gameStart: (() => {
            const audio = new Audio("assets/sounds/game/gameStart.mp3");
            audio.volume = 0.4;
            return audio;
        })(),

        gameOver: (() => {
            const audio = new Audio("assets/sounds/game/gameOver.mp3");
            audio.volume = 0.5;
            return audio;
        })()
    };

    static sfx = {
        ui: {
            click: (() => {
                const audio = new Audio("assets/sounds/game/click.mp3");
                audio.volume = 0.4;
                return audio;
            })()
        },

        character: {
            damage: (() => {
                const audio = new Audio("assets/sounds/character/characterDamage.mp3");
                audio.volume = 0.4;
                return audio;
            })(),

            dead: (() => {
                const audio = new Audio("assets/sounds/character/characterDead.wav");
                audio.volume = 0.5;
                return audio;
            })(),

            jump: (() => {
                const audio = new Audio("assets/sounds/character/characterJump.wav");
                audio.volume = 0.3;
                return audio;
            })(),

            run: (() => {
                const audio = new Audio("assets/sounds/character/characterRun.mp3");
                audio.volume = 0.2;
                return audio;
            })(),

            snoring: (() => {
                const audio = new Audio("assets/sounds/character/characterSnoring.mp3");
                audio.volume = 0.25;
                return audio;
            })()
        },

        chicken: {
            dead1: (() => {
                const audio = new Audio("assets/sounds/chicken/chickenDead.mp3");
                audio.volume = 0.4;
                return audio;
            })(),

            dead2: (() => {
                const audio = new Audio("assets/sounds/chicken/chickenDead2.mp3");
                audio.volume = 0.4;
                return audio;
            })()
        },

        collectibles: {
            bottle: (() => {
                const audio = new Audio("assets/sounds/collectibles/bottleCollectSound.wav");
                audio.volume = 0.4;
                return audio;
            })(),

            bottleBreak: (() => {
                const audio = new Audio("assets/sounds/throwable/bottleBreak.mp3");
                audio.volume = 0.5;
                return audio;
            })(),

            bottleThrow: (() => {
                const audio = new Audio("assets/sounds/throwable/throw.mp3");
                audio.volume = 0.4;
                return audio;
            })(),

            coin: (() => {
                const audio = new Audio("assets/sounds/collectibles/collectSound.wav");
                audio.volume = 0.35;
                return audio;
            })()
        },

        endboss: {
            alert: (() => {
                const audio = new Audio("assets/sounds/endboss/endbossApproach.wav");
                audio.volume = 0.6;
                return audio;
            })(),

            hurt: (() => {
                const audio = new Audio("assets/sounds/endboss/endbossHurt.wav");
                audio.volume = 0.6;
                return audio;
            })(),

            dead: (() => {
                const audio = new Audio("assets/sounds/endboss/endbossDead.wav");
                audio.volume = 0.7;
                return audio;
            })()
        }
    };
}

