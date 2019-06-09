/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */
function LevelEvent(game, xPosition, yPosition, eventLevel) {
    Phaser.Sprite.call(this, game, xPosition, yPosition, "atlas", eventLevel.name);
    game.physics.arcade.enable(this);

    this.anchor.set(0.5);

    this.levelEventAnimationStopped = false;
    this.eventStopped = false;
    this.gotHit = false;

    this.eventType = eventLevel.type;
    // Special parameters depending on what even it is
    if (eventLevel.type === "rain") {
        this.animations.add("trigger", eventLevel.mainAnimation, 15, false);

        this.body.setCircle(63);

        this.scale.setTo(0.1);
        this.eventScaling = game.add.tween(this.scale);
        this.eventScaling.to({x: 1, y: 1}, 500, Phaser.Easing.Circular.Out, true, 0, 0, false);
        // play the animation after a second of the spawn
        game.time.events.add(Phaser.Timer.SECOND, this.levelEventAnimation, this, this);

        // Water drop assets and animations
        this.waterDropBody = game.add.sprite(-100, -100, "atlas", eventLevel.waterDropBody);
        this.waterDropBody.anchor.set(0.5);

        this.waterDropBody.animations.add("idle", [eventLevel.waterDropBody], 15, false);
        this.waterDropBody.animations.add("splash", eventLevel.waterDropSplash, 30, false);
        this.waterDropBody.animations.play("idle");
    } else if (eventLevel.type === "helicopter") {
        this.animations.add("trigger", eventLevel.mainAnimation, 15, false);

        this.warning = game.add.sprite(xPosition, 150, "atlas", eventLevel.warningSign);
        this.warning.anchor.set(0.5);

        this.warning.scale.setTo(0.1);
        game.add.tween(this.warning.scale).to({x: 1, y: 1}, 125, Phaser.Easing.Circular.Out, true, 0, 0, false);

        game.time.events.add(Phaser.Timer.SECOND, this.levelEventAnimation, this, this);
    } else {
        this.body.setCircle(35, 5, 10);
        this.animations.add("trigger", eventLevel.mainAnimation, 15, true);

        this.warning = game.add.sprite(xPosition < 0 ? 50 : game.world.width - 50, yPosition, "atlas", eventLevel.warningSign);
        this.warning.anchor.set(0.5);

        this.warning.scale.setTo(0.1);
        game.add.tween(this.warning.scale).to({x: 1, y: 1}, 125, Phaser.Easing.Circular.Out, true, 0, 0, false);

        game.time.events.add(Phaser.Timer.SECOND, this.levelEventAnimation, this, this);
    }
}

LevelEvent.prototype = Object.create(Phaser.Sprite.prototype);
LevelEvent.prototype.constructor = LevelEvent;

LevelEvent.prototype.levelEventAnimation = function (eventLevel) {
    // Play event animations
    if (this.eventType === "rain") {
        game.add.tween(this.waterDropBody).to({x: this.x, y: this.y}, 200, Phaser.Easing.Circular.Out, true, 0, 0, false);
        eventLevel.animations.play("trigger");
        eventLevel.animations.currentAnim.onComplete.add(this.eventAnimationStopped, this, eventLevel);
    } else if (this.eventType === "helicopter") {
        game.add.tween(this).to({y: game.world.height + 300}, 750, Phaser.Easing.Linear.None, true, 0, 0, false);
        eventLevel.animations.play("trigger");
        this.eventAnimationStopped();
    } else {
        var x;
        if (this.x < 0) {
            x = game.world.width + 200;
        } else {
            x = -200;
        }
        game.add.tween(this).to({x: x, y: game.rnd.integerInRange(100, game.world.height + 200)}, 1000, Phaser.Easing.Linear.None, true, 0, 0, false);
        eventLevel.animations.play("trigger");
        this.eventAnimationStopped();
    }
};

LevelEvent.prototype.eventAnimationStopped = function () {
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
    // Change hitbox of animation depending on current animation frame playing
    if (this.eventType === "helicopter") {
        this.body.setSize(130, this.animations.currentFrame.height, 10, 0);
    }

    // Destroy object if outside of the game bounds
    if (this.eventStopped) {
        if (this.eventType === "rain") {
            this.waterDropBody.destroy();
            this.destroy();
        } else if (this.eventType === "helicopter") {
            this.warning.destroy();
            if (this.y >= game.world.height + 300 && this.animations.currentFrame.name === "waterDrops_01") {
                this.destroy();
            }
        } else {
            this.warning.destroy();
            if (this.y >= game.world.height + 100) {
                this.destroy();
            }
        }
    }
};
