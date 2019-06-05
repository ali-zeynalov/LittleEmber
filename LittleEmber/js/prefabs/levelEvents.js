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

    this.eventType = eventLevel.type;
    if (eventLevel.type === "rain") {
        this.scale.setTo(0.1);
        this.eventScaling = game.add.tween(this.scale);
        this.eventScaling.to({x: 1, y: 1}, 500, Phaser.Easing.Circular.Out, true, 0, 0, false);
        // play the animation after a second of the spawn
        game.time.events.add(Phaser.Timer.SECOND, this.levelEventAnimation, this, this);

        // Water drop assets and animations
        this.waterDropBody = game.add.sprite(-100, -100, "atlas", eventLevel.waterDropBody);
        this.waterDropBody.anchor.set(0.5);
        this.waterDropBody.scale.setTo(0.8);

        this.waterDropBody.animations.add("idle", [eventLevel.waterDropBody], 15, false);
        this.waterDropBody.animations.add("splash", eventLevel.waterDropSplash, 30, false);
        this.waterDropBody.animations.play("idle");
    }
}

LevelEvent.prototype = Object.create(Phaser.Sprite.prototype);
LevelEvent.prototype.constructor = LevelEvent;

LevelEvent.prototype.levelEventAnimation = function (eventLevel) {
    // Play event animations
    if (this.eventType === "rain") {
        game.add.tween(this.waterDropBody).to({x: this.x, y: this.y}, 200, Phaser.Easing.Circular.Out, true, 0, 0, false);
    }
    eventLevel.animations.play("trigger");
    eventLevel.animations.currentAnim.onComplete.add(this.eventAnimationStopped, this, eventLevel);
};

LevelEvent.prototype.eventAnimationStopped = function (eventLevel) {
    this.levelEventAnimationStopped = true;
    this.eventStopped = true;
};

LevelEvent.prototype.update = function () {
    // Debug for hitboxes
    // game.debug.body(this);

    // Play water splash animation
    if (this.eventType === "rain" && this.waterDropBody.x === this.x && this.waterDropBody.y === this.y
        && this.waterDropBody.animations.currentAnim.name === "idle") {
        this.waterDropBody.animations.play("splash");
    }

    // Destroy object if outside of the game bounds
    if (this.eventStopped) {
        if (this.eventType === "rain") {
            this.waterDropBody.destroy();
        }
        this.destroy();

    }
};
