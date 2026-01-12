class SoundManager {
    static muted = false;

    static play(audio) {
        if (!audio || !(audio instanceof HTMLAudioElement)) return null;
        if (this.muted) return audio;

        audio.currentTime = 0;
        audio.play();
        return audio;
    }

    static stop(audio) {
        if (!audio || !(audio instanceof HTMLAudioElement)) return;
        audio.pause();
        audio.currentTime = 0;
    }

    static setMutedState(isMuted) {
        this.muted = isMuted;

        this._applyMuteToGroup(SoundHub.music, isMuted);
        this._applyMuteToGroup(SoundHub.sfx.character, isMuted);
        this._applyMuteToGroup(SoundHub.sfx.chicken, isMuted);
        this._applyMuteToGroup(SoundHub.sfx.collectibles, isMuted);
        this._applyMuteToGroup(SoundHub.sfx.endboss, isMuted);
        this._applyMuteToGroup(SoundHub.sfx.ui, isMuted);
    }

    static _applyMuteToGroup(group, isMuted) {
        Object.values(group).forEach(audio => {
            if (audio instanceof HTMLAudioElement) {
                audio.muted = isMuted;
            }
        });
    }
}