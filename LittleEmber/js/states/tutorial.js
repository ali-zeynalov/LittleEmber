/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */
var Tutorial = function (game) {
    this.BUTTON_POSITION_X = game.world.width - 225;
    this.BUTTON_POSITION_Y = game.world.height - 25;
};
Tutorial.prototype = {

    create: function () {
        // Background image
        this.backgroundImage = game.add.sprite(0, 0, "tutorial");

        this.button = game.add.sprite(this.BUTTON_POSITION_X, this.BUTTON_POSITION_Y, "atlas", "mainMenuButton");
        this.button.anchor.set(0, 0.5);
        this.button.animations.add("burning", ["mainMenuButton_01", "mainMenuButton_02"], 15, true);
        this.button.animations.play("burning");

    },
    update: function () {
        if (game.input.keyboard.justPressed(Phaser.Keyboard.ESC) || game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)
            || game.input.keyboard.justPressed(Phaser.Keyboard.W) || game.input.keyboard.justPressed(Phaser.Keyboard.A) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.S) || game.input.keyboard.justPressed(Phaser.Keyboard.D) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.UP) || game.input.keyboard.justPressed(Phaser.Keyboard.DOWN) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.LEFT) || game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) || game.input.keyboard.justPressed(Phaser.Keyboard.Q) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.E)) {
            game.state.start("MainMenu", true, false, false);
        }
    }
};
