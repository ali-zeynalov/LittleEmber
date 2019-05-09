var GameOver = function (game) {
};
GameOver.prototype = {
    create: function () {
        // returns player to the title screen
        var returnButton = game.add.button(game.world.centerX, game.world.height / 2, "startButton", this.titleScreen, this, 0, 0, 1);
        returnButton.anchor.set(0.5);

        var endText = game.add.text(game.width / 2, game.height / 3, "Your flame flickers out..." , {font: "Helvetica", fontSize: "48px", fill: "#fff"});
		endText.anchor.set(0.5);

        console.log("State: GameOver");
    },
    titleScreen: function () {
        // switch to MainMenu state
        game.state.start("MainMenu");
    }
};