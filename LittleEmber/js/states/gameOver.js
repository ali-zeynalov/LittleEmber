/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */

var GameOver = function (game) {
};
GameOver.prototype = {
    init: function (msg) {
        this.msg = msg;
    },
    create: function () {

        this.menuBackground = game.add.sprite(0, 0, "mainMenuBackground");

        // returns player to the title screen
        var returnButton = game.add.button(game.world.centerX, game.world.height / 2, "atlas", this.titleScreen, this,
            "continueButton", "continueButton", "continueButtonDown");
        returnButton.anchor.set(0.5);

        var endText = game.add.text(game.width / 2, game.height / 3, this.msg, {font: "Helvetica", fontSize: "36px", fill: "#faba45"});
        endText.anchor.set(0.5);
        endText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);
    },
    titleScreen: function () {
        // switch to MainMenu state
        game.state.start("MainMenu");
    }
};