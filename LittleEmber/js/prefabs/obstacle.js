function Obstacle(game, xPosition, yPosition, direction, obstacle, xVelocity, yVelocity, maxVelocity) {
    Phaser.Sprite.call(this, game, xPosition, yPosition, "atlas", obstacle.name);
    this.anchor.set(0.5);
    game.physics.arcade.enable(this);
    this.body.maxVelocity.x = maxVelocity;
    this.body.maxVelocity.y = maxVelocity;
    this.body.velocity.x = xVelocity;
    this.body.velocity.y = yVelocity;
    this.body.setSize(obstacle.hitBoxScaleX, obstacle.hitBoxScaleY, obstacle.hitBoxOffsetX, obstacle.hitBoxOffsetY);
    this.scale.x = direction;

    // Check for right spawning coordinates
    if (this.x + this.body.width / 2 > game.world.width) {
        this.x = game.world.width - this.body.width / 2;
    }
    if (this.x - this.body.width / 2 < 0) {
        this.x = this.body.width / 2;
    }

    this.score = obstacle.score;

    // Set animations
    this.animations.add("idle", obstacle.idleAnimationFrames, 15, true, false);
    this.animations.add("burning", obstacle.burningAnimationFrames, 15, true, false);
    this.animations.add("ashe", obstacle.burnedAnimationFrames, 15, true, false);

    this.animations.play("idle", true);
}

Obstacle.prototype = Object.create(Phaser.Sprite.prototype);
Obstacle.prototype.constructor = Obstacle;

Obstacle.prototype.update = function () {
    // Debug for hitboxes
    // game.debug.body(this);

    // Destroy object if outside of the game bounds
    if (this.body.position.y > game.world.height + this.body.height) {
        this.destroy();
    }
};
