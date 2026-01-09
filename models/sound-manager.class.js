class SoundManager {

    static play(soundPath, volume = 1, loop = false) {
        const audio = new Audio(soundPath);
        audio.volume = volume;
        audio.loop = loop;
        audio.play();
        return audio;
    }

    static stop(audio) {
        if (!audio) return;
        audio.pause();
        audio.currentTime = 0;
    }

    static pause(audio) {
        if (!audio) return;
        audio.pause();
    }

    static resume(audio) {
        if (!audio) return;
        audio.play();
    }
}
