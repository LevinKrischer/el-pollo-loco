class SoundManager {

    static muted = false;

    /**
     * Initializes the SoundManager by loading the persisted mute state
     * from localStorage, if available.
     */
     static init() {
        const saved = localStorage.getItem('soundMuted');
        this.muted = saved === 'true';
        this.setMutedState(this.muted);
    }

    /**
     * Plays the given audio clip. The audio will be muted or unmuted based on 
     * the global mute state.
     * Resets playback to the beginning before playing.
     * @param {HTMLAudioElement} audio - The audio object to play.
     * @returns {HTMLAudioElement|null} The played audio object or null if invalid.
     */
     static play(audio) {
        if (!audio || !(audio instanceof HTMLAudioElement)) return null;
        audio.currentTime = 0;
        audio.muted = this.muted;
        const playPromise = audio.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
        return audio;
    }

    /**
     * Stops the given audio clip immediately and resets its playback position.
     * @param {HTMLAudioElement} audio - The audio object to stop.
     */
     static stop(audio) {
        if (!audio || !(audio instanceof HTMLAudioElement)) return;
        audio.pause();
        audio.currentTime = 0;
    }

    /**
     * Toggles the global mute state and persists the new value
     * in localStorage.
     */
     static toggleMute() {
        this.setMutedState(!this.muted);
        localStorage.setItem('soundMuted', this.muted);
    }

    /**
     * Enables or disables global muting and applies the mute state
     * to all audio groups defined in SoundHub.
     * @param {boolean} isMuted - Whether all sounds should be muted.
     */
     static setMutedState(isMuted) {
        this.muted = isMuted;
        this._applyMuteToGroup(SoundHub.music, isMuted);
        this._applyMuteToGroup(SoundHub.sfx.character, isMuted);
        this._applyMuteToGroup(SoundHub.sfx.chicken, isMuted);
        this._applyMuteToGroup(SoundHub.sfx.collectibles, isMuted);
        this._applyMuteToGroup(SoundHub.sfx.endboss, isMuted);
        this._applyMuteToGroup(SoundHub.sfx.ui, isMuted);
    }

    /**
     * Applies the mute state to all audio objects within a given group.
     * @param {Object<string, HTMLAudioElement>} group - A SoundHub category.
     * @param {boolean} isMuted - Whether the audio elements should be muted.
     * @private
     */
     static _applyMuteToGroup(group, isMuted) {
        Object.values(group).forEach(audio => {
            if (audio instanceof HTMLAudioElement) {
                audio.muted = isMuted;
            }
        });
    }
}
