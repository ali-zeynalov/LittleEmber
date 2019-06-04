/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */

function LevelEvent(game, xPosition, yPosition, eventLevel) {
    Phaser.Sprite.call(this, game, xPosition, yPosition, "atlas", eventLevel.name);
    game.physics.arcade.enable(this);
    this.body.setCircle(100);

    this.anchor.set(0.5);
    this.animations.add("trigger", eventLevel.mainAnimation, 15, false);

    this.levelEventAnimationStopped = false;
    this.eventStopped = false;

    if (eventLevel.type === "rain") {
        this.scale.setTo(0.1);
        this.eventScaling = game.add.tween(this.scale);
        this.eventScaling.to({x: 1, y: 1}, 500, Phaser.Easing.Circular.Out, true, 0, 0, false);
        // play the animation after a second of the spawn
        game.time.events.add(Phaser.Timer.SECOND, this.levelEventAnimation, this, this);
    }
}

LevelEvent.prototype = Object.create(Phaser.Sprite.prototype);
LevelEvent.prototype.constructor = LevelEvent;

LevelEvent.prototype.levelEventAnimation = function (eventLevel) {
    eventLevel.play("trigger");
    eventLevel.animations.currentAnim.onComplete.add(this.eventAnimationStopped, this, eventLevel);
};

LevelEvent.prototype.eventAnimationStopped = function (eventLevel) {
    this.levelEventAnimationStopped = true;
    this.eventStopped = true;
};

LevelEvent.prototype.update = function () {
    // Debug for hitboxes
    // game.debug.body(this);

    // Destroy object if outside of the game bounds
    if (this.eventStopped) {
        this.destroy();
    }
};
