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
                    hitBoxScaleX: 100,
                    hitBoxScaleY: 100,
                    hitBoxOffsetX: 10,
                    hitBoxOffsetY: 10,
                    /*** TODO: Use this structure when we have animations for our objects
                     idleAnimationFrames: ["animation0", "animation1", "animation2"],
                     burningAnimationFrames: ["animation0", "animation1", "animation2"],
                     burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                     */
                    idleAnimationFrames: ["branches"],
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
                    hitBoxScaleX: 100,
                    hitBoxScaleY: 100,
                    hitBoxOffsetX: 10,
                    hitBoxOffsetY: 10,
                    /*** TODO: Use this structure when we have animations for our objects
                     idleAnimationFrames: ["animation0", "animation1", "animation2"],
                     burningAnimationFrames: ["animation0", "animation1", "animation2"],
                     burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                     */
                    idleAnimationFrames: ["bush"],
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
                    hitBoxScaleX: 100,
                    hitBoxScaleY: 100,
                    hitBoxOffsetX: 10,
                    hitBoxOffsetY: 10,
                    /*** TODO: Use this structure when we have animations for our objects
                     idleAnimationFrames: ["animation0", "animation1", "animation2"],
                     burningAnimationFrames: ["animation0", "animation1", "animation2"],
                     burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                     */
                    idleAnimationFrames: ["flowers"],
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
        // Add buttons
        var startButton = game.add.button(game.world.centerX, game.world.height / 2, "startButton", this.startGame, this, 0, 0, 1);
        startButton.anchor.set(0.5);

        console.log("State: MainMenu");
    },
    startGame: function () {
        // switch to play state
        game.state.add("Play", Play);
        game.state.start("Play", true, false, this.LEVELS, 1);
    }
};
