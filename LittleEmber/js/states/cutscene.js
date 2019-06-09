/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */
var Cutscene = function (game) {
    this.BUTTON_POSITION_X = game.world.width - 200;
    this.BUTTON_POSITION_Y = game.world.height - 100;
};
Cutscene.prototype = {
    init: function (level, xDirection, yDirection) {
        this.level = level;
        this.xDirection = xDirection;
        this.yDirection = yDirection;
    },
    create: function () {
        // Specify which cutscenes to play for each level transition
        if (this.level === 1) {
            this.background = game.add.sprite(0, 0, "transition_01");
            this.background.scale.setTo(1.5);
        } else if (this.level === 2) {
            this.background = game.add.sprite(0, 0, "transition_02");
            this.background.scale.setTo(1.5);
        } else {
            this.background = game.add.sprite(0, 0, "transition_03");
            this.background.scale.setTo(1.5);
        }

        game.physics.enable(this.background, Phaser.Physics.ARCADE);

        this.zoomOut = game.add.tween(this.background.scale).to({x: 1, y: 1}, 2000, Phaser.Easing.Circular.Out, true, 0, 0, false);
        // Put a button offscreen that will slide across the screen when cutscene is done
        this.button = game.add.sprite(-200, this.BUTTON_POSITION_Y, "atlas", "continueButton");
        this.button.anchor.set(0, 0.5);
        this.button.animations.add("burning", ["continueButton_01", "continueButton_02"], 15, true);
        this.button.animations.play("burning");

        this.doneTween = false;
        this.moveBackgroundFinished = false;

    },
    update: function () {
        this.zoomOut.onComplete.add(this.tweenIsDone, this);
        // When tween for zooming out is done, start moving background
        if (this.doneTween && !this.moveBackgroundFinished) {
            this.moveBackground();
        }
        // If those buttons are pressed move to next state
        if (game.input.keyboard.justPressed(Phaser.Keyboard.ENTER) || game.input.keyboard.justPressed(Phaser.Keyboard.E) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.ESC || game.input.keyboard.justPressed(Phaser.Keyboard.Q))) {
            this.startLevel(this.level);
        }
    },
    tweenIsDone: function () {
        this.doneTween = true;
    },
    moveBackground: function () {
        // Logic to move background from right to left
        if (this.xDirection < 0) {
            if (this.background.x > (0 - this.background.width + game.world.width)) {
                this.background.body.velocity.x = this.xDirection;
            } else {
                this.background.body.velocity.x = 0;
                this.moveBackgroundFinished = true;
                this.showButton();
            }
        }
        // Logic to move background from bottom to top
        if (this.yDirection < 0) {
            if (this.background.y > (0 - this.background.height + game.world.height)) {
                this.background.body.velocity.y = this.yDirection;
            } else {
                this.background.body.velocity.y = 0;
                this.moveBackgroundFinished = true;
                this.showButton();
            }
        }
        // If don't need to move then just show the button
        if (this.xDirection === 0 && this.yDirection === 0) {
            this.moveBackgroundFinished = true;
            this.showButton();
        }
    },
    showButton: function () {
        game.add.tween(this.button).to({x: this.BUTTON_POSITION_X, y: this.BUTTON_POSITION_Y}, 500, Phaser.Easing.Circular.Out, true, 0, 0, false);
    },
    startLevel: function (level) {
        // Start next level unless current level is last then move to credits screen
        game.sound.stopAll();
        if (level === 3) {
            game.state.add("Credits", Credits);
            game.state.start("Credits");
        } else {
            game.state.start("Play", true, false, level + 1);
        }
    }
};
