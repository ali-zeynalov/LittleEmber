/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */
function Obstacle(game, xPosition, yPosition, direction, obstacle, xVelocity, yVelocity, maxVelocity, level) {
    Phaser.Sprite.call(this, game, xPosition, yPosition, "atlas", obstacle.name);
    this.anchor.set(0.5);
    game.physics.arcade.enable(this);
    this.body.maxVelocity.x = maxVelocity;
    this.body.maxVelocity.y = maxVelocity;
    this.body.velocity.x = xVelocity;
    this.body.velocity.y = yVelocity;

    if (level === 3) {
        this.body.setCircle(obstacle.hitBoxScaleX, obstacle.hitBoxOffsetX, obstacle.hitBoxOffsetY);
    } else {
        this.body.setSize(obstacle.hitBoxScaleX, obstacle.hitBoxScaleY, obstacle.hitBoxOffsetX, obstacle.hitBoxOffsetY);
    }
    this.scale.x = direction;

    // Extra parameters
    this.burnable = obstacle.burnable;
    this.burning = obstacle.burning;
    this.size = obstacle.size;
    if (obstacle.water !== undefined) {
        this.water = obstacle.water;
    }
    // Assign sounds if objects have it
    if (obstacle.defaultSoundName !== undefined) {
        this.defaultSoundName = game.add.audio(obstacle.defaultSoundName);
        this.defaultSoundName.play();
    }

    if (obstacle.burningSoundName !== undefined) {
        this.burningSoundName = game.add.audio(obstacle.burningSoundName);
    }

    // Check for right spawning coordinates
    if (this.x + this.body.width / 2 > game.world.width) {
        this.x = game.world.width - this.body.width / 2;
    }
    if (this.x - this.body.width / 2 < 0) {
        this.x = this.body.width / 2;
    }

    // Score and meter change
    this.score = obstacle.score;
    this.burnMeterChange = obstacle.burnMeterChange;
    if (obstacle.scorchMeterChange !== undefined) {
        this.scorchMeterChange = obstacle.scorchMeterChange;
    }

    // Set animations
    this.animations.add("idle", obstacle.idleAnimationFrames, 15, true, false);
    this.animations.add("burning", obstacle.burningAnimationFrames, 15, true, false);
    this.animations.add("ashe", obstacle.burnedAnimationFrames, 15, false, false);
    if (obstacle.scorchAnimationFrames !== undefined) {
        this.animations.add("scorched", obstacle.scorchAnimationFrames, 15, true, false);
    }
    if (obstacle.scorchAshenAnimationFrames !== undefined) {
        this.animations.add("scorchedAshe", obstacle.scorchAshenAnimationFrames, 15, false, false);
    }

    this.animations.play("idle", true);
}

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function () {
    // Debug for hitboxes
    // game.debug.body(this);

    // Destroy object if outside of the game bounds
    if (this.body.position.y > game.world.height + this.body.height) {
        if (this.burningSoundName !== undefined) {
            this.burningSoundName.stop();
        }
        if (this.defaultSoundName !== undefined) {
            this.defaultSoundName.stop();
        }
        this.destroy();
    }
};
