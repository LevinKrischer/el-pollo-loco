class EndbossManager {

    constructor(world) {
        this.world = world;
    }

    /**
     * Updates active endboss behavior.
     */
     updateBehavior() {
        const boss = this.world.level.enemies.find(
            enemy => enemy.isEndboss && !enemy.dead
        );
        if (boss) boss.updateBehavior(this.world.character);
    }

    /**
     * Checks whether the endboss should be activated.
     */
     checkEndbossTrigger() {
        const boss = this.world.level.enemies.find(enemy => enemy.isEndboss);
        if (!boss || boss.activated) return;
        if (this.world.character.x > 2500) {
            this.activateEndboss(boss);
        }
    }

    /**
     * Activates the endboss and starts the intro sequence.
     * @param {Endboss} boss - The endboss instance.
     */
     activateEndboss(boss) {
        boss.activated = true;
        boss.preparing = true;
        this.playEndbossAlert(boss);
        this.world.uiManager.addEndbossStatusBar();
        this.scheduleEndbossStart(boss);
    }

    /**
     * Plays the endboss alert sound once.
     * @param {Endboss} boss - The endboss instance.
     */
     playEndbossAlert(boss) {
        if (boss.alertSoundPlayed) return;
        SoundManager.play(this.world.soundEndbossAlert);
        boss.alertSoundPlayed = true;
    }

    /**
     * Schedules endboss movement after the alert animation.
     * @param {Endboss} boss - The endboss instance.
     */
     scheduleEndbossStart(boss) {
        this.world.setTimeoutTracked(() => {
            boss.preparing = false;
            boss.speed = 4;
        }, 2000);
    }

    /**
     * Stops the endboss movement when in attack range.
     */
     checkEndbossAttack() {
        const boss = this.world.level.enemies.find(enemy => enemy.isEndboss);
        if (!boss || boss.dead) return;
        const distance = Math.abs(boss.x - this.world.character.x);
        if (distance < boss.attackRange) boss.speed = 0;
    }

    /**
     * Handles a bottle hit on the endboss.
     * @param {Endboss} boss - The endboss instance.
     */
     handleEndbossHit(boss) {
        if (boss.isHurt()) return;
        boss.lastHit = Date.now();
        boss.hitsTaken++;
        SoundManager.play(this.world.soundEndbossHurt);
        this.world.uiManager.updateEndbossStatusBar(boss);
        if (boss.hitsTaken >= boss.hitsToKill) boss.die();
    }
}

