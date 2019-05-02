var MainMenu = function (game) {
};

MainMenu.prototype = {
    preload: function () {
        // Preload scripts
        game.load.script("play", "js/states/play.js");
    },
    create: function () {
        // Add buttons
        var startButton = game.add.button(game.world.centerX, game.world.height / 2, "startButton", this.startGame, this, 0, 0, 1);
        startButton.anchor.set(0.5);

        console.log("State: MainMenu");
    },
    startGame: function () {
        // switch to play state
        game.state.add("Play", Play);
        game.state.start("Play");
    }
};
