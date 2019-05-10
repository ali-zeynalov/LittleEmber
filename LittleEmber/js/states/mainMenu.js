var MainMenu = function (game) {

    // Data that each level requires to run
    this.LEVELS = [
        {
            level: 0
            /***
             * TODO: Tutorial level data goes here
             */
        },
        {
            level: 1,
            /***
             * TODO: Implement use of "finished" for Continue game feature
             */
            finished: false,
            background: "grassBackground",
            obstacles: [
                {
                    name: "branches",
                    burnable: true,
                    burning: false,
                    hitBoxScaleX: 50,
                    hitBoxScaleY: 30,
                    hitBoxOffsetX: 10,
                    hitBoxOffsetY: 20,
                    /*** TODO: Use this structure when we have animations for our objects
                     idleAnimationFrames: ["animation0", "animation1", "animation2"],
                     burningAnimationFrames: ["animation0", "animation1", "animation2"],
                     burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                     */
                    idleAnimationFrames: ["branches"],
                    burningAnimationFrames: ["branchesBurning_01", "branchesBurning_02"],
                    burnedAnimationFrames: ["ashes"],
                    /*** TODO: Use this structure when we have sound for our objects
                     defaultSoundName: "defaultSound",
                     burningSoundName: "burningSound"
                     */
                    burnMeterChange: 10,
                    score: 100
                },
                {
                    name: "bush",
                    burnable: true,
                    burning: false,
                    hitBoxScaleX: 70,
                    hitBoxScaleY: 70,
                    hitBoxOffsetX: 10,
                    hitBoxOffsetY: 10,
                    /*** TODO: Use this structure when we have animations for our objects
                     idleAnimationFrames: ["animation0", "animation1", "animation2"],
                     burningAnimationFrames: ["animation0", "animation1", "animation2"],
                     burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                     */
                    idleAnimationFrames: ["bush"],
                    burningAnimationFrames: ["bushBurning_01", "bushBurning_02"],
                    burnedAnimationFrames: ["ashes"],
                    /*** TODO: Use this structure when we have sound for our objects
                     defaultSoundName: "defaultSound",
                     burningSoundName: "burningSound"
                     */
                    burnMeterChange: -10,
                    score: 200
                },
                {
                    name: "flowers",
                    burnable: true,
                    burning: false,
                    hitBoxScaleX: 50,
                    hitBoxScaleY: 30,
                    hitBoxOffsetX: 10,
                    hitBoxOffsetY: 5,
                    /*** TODO: Use this structure when we have animations for our objects
                     idleAnimationFrames: ["animation0", "animation1", "animation2"],
                     burningAnimationFrames: ["animation0", "animation1", "animation2"],
                     burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                     */
                    idleAnimationFrames: ["flowers"],
                    burningAnimationFrames: ["flowersBurning_01", "flowersBurning_02"],
                    burnedAnimationFrames: ["ashes"],
                    /*** TODO: Use this structure when we have sound for our objects
                     defaultSoundName: "defaultSound",
                     burningSoundName: "burningSound"
                     */
                    burnMeterChange: 5,
                    score: 50
                }
            ],
            scoreGoal: 1000
        },
        {
            /***
             * TODO: More levels
             */
            level: 2
        }
    ];
};

MainMenu.prototype = {
    preload: function () {
        // Preload scripts
        game.load.script("play", "js/states/play.js");
    },
    create: function () {
        var titleText = game.add.text(game.width / 2, game.height / 8, "Little Ember", {font: "Helvetica", fontSize: "60px", fill: "#fff"});
        titleText.anchor.set(0.5);
        // briefly explain how to play- this will eventually be replaced by a legit tutorial
        var toPlayText = game.add.text(game.width / 2, game.height / 4, "WASD to move, traverse over\nobjects to consume and grow", {
            font: "Helvetica",
            fontSize: "36px",
            fill: "#fff"
        });
        var goal = game.add.text(game.width / 2, game.height / 3, "Reach score of " + this.LEVELS[1].scoreGoal + " to win the game!", {
            font: "Helvetica",
            fontSize: "36px",
            fill: "#fff"
        });
        goal.anchor.set(0.5);
        toPlayText.anchor.set(0.5);
        // Add buttons
        var startButton = game.add.button(game.world.centerX, game.world.height / 2, "atlas", this.startGame, this, "startButton", "startButton", "startButtonDown");
        startButton.anchor.set(0.5);

        console.log("State: MainMenu");
    },
    startGame: function () {
        // switch to play state
        game.state.add("Play", Play);
        game.state.start("Play", true, false, this.LEVELS, 1);
    }
};
