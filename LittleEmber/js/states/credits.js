/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */
var Credits = function (game) {

};
Credits.prototype = {

    create: function () {
        // Background image
        this.backgroundImage = game.add.sprite(0, 0, "mainMenuBackground");

        // Credits title
        var titleText = game.add.text(game.world.width / 2, game.world.height / 8, "Credits", {
            font: "Comic Sans MS",
            fontSize: "60px",
            fill: "#faba45"
        });
        titleText.anchor.set(0.5);
        titleText.setShadow(3, 3, 'rgba(0,0,0,0.7)', 0);

        var textStyle = {
            font: "Comic Sans MS",
            fontSize: "28px",
            fill: "#fa8b1d",
            align: "center",
        };

        this.madeBy = game.add.text(game.world.centerX, game.world.height / 3, "Made by:\nAli Zeynalov\nKeren Franco\nWilliam Taylor\n", textStyle);
        this.madeBy.anchor.set(0.5, 0.5);
        this.madeBy.setShadow(3, 3, 'rgba(0,0,0,0.7)', 0);

        this.assetsUsed = game.add.text(game.world.centerX, game.world.height - game.world.height / 3, "STOLEN ASSETS GO HERE:\n;)\n", textStyle);
        this.assetsUsed.anchor.set(0.5, 0.5);
        this.assetsUsed.setShadow(3, 3, 'rgba(0,0,0,0.7)', 0);

    },
    update: function () {

        if (game.input.keyboard.justPressed(Phaser.Keyboard.ESC) || game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)
            || game.input.keyboard.justPressed(Phaser.Keyboard.W) || game.input.keyboard.justPressed(Phaser.Keyboard.A) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.S) || game.input.keyboard.justPressed(Phaser.Keyboard.D) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.UP) || game.input.keyboard.justPressed(Phaser.Keyboard.DOWN) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.LEFT) || game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) || game.input.keyboard.justPressed(Phaser.Keyboard.Q)) {
            game.state.start("MainMenu", true, false, false);
        }
    }
};
