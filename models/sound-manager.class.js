class SoundManager {
    static muted = false;

    /**
     * Spielt einen Sound ab, wenn nicht gemutet.
     * Gibt das Audio-Objekt zurück, damit Character es speichern kann.
     */
    static play(audio) {
    if (!audio || !(audio instanceof HTMLAudioElement)) return null;
    if (this.muted) return audio;

    audio.currentTime = 0;
    audio.play();
    return audio;
}


    /**
     * Stoppt einen Sound sicher.
     */
    static stop(audio) {
    if (!audio || !(audio instanceof HTMLAudioElement)) return;
    audio.pause();
    audio.currentTime = 0;
}


    /**
     * Globales Muting für ALLE Sounds.
     */
    static setMutedState(isMuted) {
        this.muted = isMuted;

        // Alle Sounds im SoundHub muten
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
