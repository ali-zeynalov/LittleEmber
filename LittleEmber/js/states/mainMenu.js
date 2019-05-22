/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */

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
            background: "background_01",
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
                    burnMeterChange: 0.1,
                    score: 50
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
                    burnMeterChange: -0.2,
                    score: 100
                },
                {
                    name: "flowers",
                    burnable: true,
                    burning: false,
                    hitBoxScaleX: 50,
                    hitBoxScaleY: 50,
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
                    burnMeterChange: 0.1,
                    score: 25
                },
                {
                    name: "cup",
                    burnable: true,
                    burning: false,
                    hitBoxScaleX: 40,
                    hitBoxScaleY: 40,
                    hitBoxOffsetX: 2,
                    hitBoxOffsetY: 7,
                    /*** TODO: Use this structure when we have animations for our objects
                     idleAnimationFrames: ["animation0", "animation1", "animation2"],
                     burningAnimationFrames: ["animation0", "animation1", "animation2"],
                     burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                     */
                    idleAnimationFrames: ["cup"],
                    burningAnimationFrames: ["cupBurning_01", "cupBurning_02"],
                    burnedAnimationFrames: ["ashes"],
                    /*** TODO: Use this structure when we have sound for our objects
                     defaultSoundName: "defaultSound",
                     burningSoundName: "burningSound"
                     */
                    burnMeterChange: 0.08,
                    score: 50
                },
                {
                    name: "wrapper",
                    burnable: true,
                    burning: false,
                    hitBoxScaleX: 40,
                    hitBoxScaleY: 40,
                    hitBoxOffsetX: 7,
                    hitBoxOffsetY: 5,
                    /*** TODO: Use this structure when we have animations for our objects
                     idleAnimationFrames: ["animation0", "animation1", "animation2"],
                     burningAnimationFrames: ["animation0", "animation1", "animation2"],
                     burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                     */
                    idleAnimationFrames: ["wrapper"],
                    burningAnimationFrames: ["wrapperBurning_01", "wrapperBurning_02"],
                    burnedAnimationFrames: ["ashes"],
                    /*** TODO: Use this structure when we have sound for our objects
                     defaultSoundName: "defaultSound",
                     burningSoundName: "burningSound"
                     */
                    burnMeterChange: 0.08,
                    score: 75
                },
                {
                    name: "cricket",
                    burnable: true,
                    burning: false,
                    hitBoxScaleX: 50,
                    hitBoxScaleY: 30,
                    hitBoxOffsetX: 0,
                    hitBoxOffsetY: 15,
                    /*** TODO: Use this structure when we have animations for our objects
                     idleAnimationFrames: ["animation0", "animation1", "animation2"],
                     burningAnimationFrames: ["animation0", "animation1", "animation2"],
                     burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                     */
                    idleAnimationFrames: ["cricket"],
                    burningAnimationFrames: ["cricketBurning_01", "cricketBurning_02"],
                    burnedAnimationFrames: ["ashes"],
                    /*** TODO: Use this structure when we have sound for our objects
                     defaultSoundName: "defaultSound",
                     burningSoundName: "burningSound"
                     */
                    burnMeterChange: -0.05,
                    score: 100
                },
                {
                    name: "puddle",
                    burnable: false,
                    burning: false,
                    hitBoxScaleX: 100,
                    hitBoxScaleY: 60,
                    hitBoxOffsetX: 10,
                    hitBoxOffsetY: 10,
                    /*** TODO: Use this structure when we have animations for our objects
                     idleAnimationFrames: ["animation0", "animation1", "animation2"],
                     burningAnimationFrames: ["animation0", "animation1", "animation2"],
                     burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                     */
                    idleAnimationFrames: ["puddle"],
                    burningAnimationFrames: ["puddle"],
                    burnedAnimationFrames: ["puddle"],
                    /*** TODO: Use this structure when we have sound for our objects
                     defaultSoundName: "defaultSound",
                     burningSoundName: "burningSound"
                     */
                    burnMeterChange: -0.4,
                    score: -50
                }
            ],
            eventLevel: {
                name: "waterDropOutline",
                // Type 1: Expanding, 2: Blinking
                type: 1,
                mainAnimation: ["waterDrop_01", "waterDrop_02", "waterDrop_03", "waterDrop_04", "waterDrop_05", "waterDrop_06", "waterDrop_07", "waterDrop_08",
                    "waterDrop_09", "waterDrop_10"]
            },
            score: {
                goal: 2500,

                currentTimeClear: "",
                currentHighestCombo: 0,
                currentScore: 0,

                bestTimeClear: "",
                bestHighestCombo: 0,
                bestScore: 0
            },
            levelMusic: "lvl1"
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
        this.menuMusic = game.add.audio("menuMusic");
        this.menuMusic.play('', 0, 0.8, true); // ('marker', start position, volume (0-1), loop)
    },
    create: function () {
        this.menuBackground = game.add.sprite(0, 0, "mainMenuBackground");

        // Name of our game
        var titleText = game.add.text(game.width / 2, game.height / 8, "Little Ember", {font: "Helvetica", fontSize: "60px", fill: "#faba45"});
        titleText.anchor.set(0.5);
        titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        // Add buttons
        var startButton = game.add.button(game.world.centerX, game.world.height / 3, "atlas", this.startGame, this, "newGameButton", "newGameButton",
            "newGameButtonDown");
        startButton.anchor.set(0.5);
    },
    startGame: function () {
        // switch to play state
        this.menuMusic.stop(); // don't play during levels
        game.state.add("Play", Play);
        game.state.start("Play", true, false, this.LEVELS, 1);
    }
};
