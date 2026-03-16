/**
 * Handles collisions between character and enemies.
 */
class CollisionManager {
    /**
     * @param {World} world - The game world.
     */
    constructor(world) {
        this.world = world;
    }

    /**
     * Checks collisions between the character and all enemies.
     */
    checkCollisions() {
        this.world.character.getRealFrame();
        this.world.level.enemies.forEach(enemy => {
            enemy.getRealFrame();
            this.handleEnemyCollision(enemy);
        });
    }

    /**
     * Handles collision logic between the character and a single enemy.
     *
     * @param {HitableObject} enemy - The enemy to check.
     */
    handleEnemyCollision(enemy) {
        if (enemy.isDead()) return;
        if (!this.world.character.isColliding(enemy)) return;
        if (enemy.isEndboss) return;

        const falling = this.world.character.speedY < 0;
        if (falling) {
            this.handleStompKill(enemy);
            return;
        }

        this.handleEnemyHitsPlayer();
    }

    /**
     * Handles killing an enemy by jumping on it.
     *
     * @param {HitableObject} enemy - The enemy to kill.
     */
    handleStompKill(enemy) {
        enemy.die();
        this.world.character.speedY = 12;
        this.world.character.wasOnGround = false;
        this.world.character.lastMoveTime = Date.now();
    }

    /**
     * Handles the player taking damage from an enemy.
     */
    handleEnemyHitsPlayer() {
        if (this.world.character.isAboveGround()) return;

        this.world.character.hit();
    }

    /**
     * Removes enemies marked for deletion.
     */
    removeDeadEnemies() {
        this.world.level.enemies = this.world.level.enemies.filter(
            enemy => !enemy.markedForDeletion
        );
    }
}
