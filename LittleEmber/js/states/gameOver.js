var GameOver = function (game) {
};
GameOver.prototype = {
    init: function (msg) {
        this.msg = msg;
    },
    create: function () {
        // returns player to the title screen
        var returnButton = game.add.button(game.world.centerX, game.world.height / 2, "atlas", this.titleScreen, this,
            "startButton", "startButton", "startButtonDown");
        returnButton.anchor.set(0.5);

        var endText = game.add.text(game.width / 2, game.height / 3, this.msg, {font: "Helvetica", fontSize: "36px", fill: "#fff"});
        endText.anchor.set(0.5);

        console.log("State: GameOver");
    },
    titleScreen: function () {
        // switch to MainMenu state
        game.state.start("MainMenu");
    }
};