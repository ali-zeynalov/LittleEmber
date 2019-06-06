/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */

var game = new Phaser.Game(600, 800, Phaser.AUTO, "myGame", {preload: preload, create: create});
// Data that each level requires to run
var LEVELS = [
    {
        level: 0,
        version: "0.16.6.11"
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
                name: "sticks",
                size: 0,
                burnable: true,
                burning: false,
                hitBoxScaleX: 60,
                hitBoxScaleY: 30,
                hitBoxOffsetX: 10,
                hitBoxOffsetY: 8,
                /*** TODO: Use this structure when we have animations for our objects
                 idleAnimationFrames: ["animation0", "animation1", "animation2"],
                 burningAnimationFrames: ["animation0", "animation1", "animation2"],
                 burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                 */
                idleAnimationFrames: ["sticks"],
                burningAnimationFrames: ["sticksBurning_01", "sticksBurning_02"],
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
                size: 1,
                burnable: true,
                burning: false,
                hitBoxScaleX: 110,
                hitBoxScaleY: 70,
                hitBoxOffsetX: 10,
                hitBoxOffsetY: 18,
                /*** TODO: Use this structure when we have animations for our objects
                 idleAnimationFrames: ["animation0", "animation1", "animation2"],
                 burningAnimationFrames: ["animation0", "animation1", "animation2"],
                 burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                 */
                idleAnimationFrames: ["bush"],
                scorchAnimationFrames: ["bushScorch_01", "bushScorch_02"],
                scorchAshenAnimationFrames: ["bushScorchAshen_01"],
                burningAnimationFrames: ["bushBurning_01", "bushBurning_02"],
                burnedAnimationFrames: ["ashes"],
                /*** TODO: Use this structure when we have sound for our objects
                 defaultSoundName: "defaultSound",
                 burningSoundName: "burningSound"
                 */
                burnMeterChange: 0.1,
                scorchMeterChange: -0.08,
                score: 100
            },
            {
                name: "flowers_01",
                size: 0,
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
                idleAnimationFrames: ["flowers_01"],
                burningAnimationFrames: ["flowers1Burning_01", "flowers1Burning_02"],
                burnedAnimationFrames: ["ashes"],
                /*** TODO: Use this structure when we have sound for our objects
                 defaultSoundName: "defaultSound",
                 burningSoundName: "burningSound"
                 */
                burnMeterChange: 0.1,
                score: 25
            },
            {
                name: "flowers_02",
                size: 0,
                burnable: true,
                burning: false,
                hitBoxScaleX: 80,
                hitBoxScaleY: 50,
                hitBoxOffsetX: 0,
                hitBoxOffsetY: 5,
                /*** TODO: Use this structure when we have animations for our objects
                 idleAnimationFrames: ["animation0", "animation1", "animation2"],
                 burningAnimationFrames: ["animation0", "animation1", "animation2"],
                 burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                 */
                idleAnimationFrames: ["flowers_02"],
                burningAnimationFrames: ["flowers2Burning_01", "flowers2Burning_02"],
                burnedAnimationFrames: ["ashes"],
                /*** TODO: Use this structure when we have sound for our objects
                 defaultSoundName: "defaultSound",
                 burningSoundName: "burningSound"
                 */
                burnMeterChange: 0.1,
                score: 25
            },
            {
                name: "flowers_03",
                size: 0,
                burnable: true,
                burning: false,
                hitBoxScaleX: 60,
                hitBoxScaleY: 60,
                hitBoxOffsetX: 5,
                hitBoxOffsetY: 5,
                /*** TODO: Use this structure when we have animations for our objects
                 idleAnimationFrames: ["animation0", "animation1", "animation2"],
                 burningAnimationFrames: ["animation0", "animation1", "animation2"],
                 burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                 */
                idleAnimationFrames: ["flowers_03"],
                burningAnimationFrames: ["flowers3Burning_01", "flowers3Burning_02"],
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
                size: 0,
                burnable: true,
                burning: false,
                hitBoxScaleX: 80,
                hitBoxScaleY: 35,
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
                size: 0,
                burnable: true,
                burning: false,
                hitBoxScaleX: 50,
                hitBoxScaleY: 30,
                hitBoxOffsetX: 5,
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
                size: 0,
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
                defaultSoundName: "cricketNorm",
                burningSoundName: "cricketFire",
                burnMeterChange: 0.02,
                score: 100
            },
            {
                name: "puddle_01",
                size: 0,
                water: true,
                burnable: false,
                burning: false,
                hitBoxScaleX: 190,
                hitBoxScaleY: 30,
                hitBoxOffsetX: 10,
                hitBoxOffsetY: 5,
                /*** TODO: Use this structure when we have animations for our objects
                 idleAnimationFrames: ["animation0", "animation1", "animation2"],
                 burningAnimationFrames: ["animation0", "animation1", "animation2"],
                 burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                 */
                idleAnimationFrames: ["puddle_01"],
                /*** TODO: Use this structure when we have sound for our objects
                 defaultSoundName: "defaultSound",
                 burningSoundName: "burningSound"
                 */
                burnMeterChange: -0.4,
                score: -100
            },
            {
                name: "puddle_02",
                size: 0,
                water: true,
                burnable: false,
                burning: false,
                hitBoxScaleX: 101,
                hitBoxScaleY: 27,
                hitBoxOffsetX: 0,
                hitBoxOffsetY: 5,
                /*** TODO: Use this structure when we have animations for our objects
                 idleAnimationFrames: ["animation0", "animation1", "animation2"],
                 burningAnimationFrames: ["animation0", "animation1", "animation2"],
                 burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                 */
                idleAnimationFrames: ["puddle_02"],
                /*** TODO: Use this structure when we have sound for our objects
                 defaultSoundName: "defaultSound",
                 burningSoundName: "burningSound"
                 */
                burnMeterChange: -0.4,
                score: -50
            },
            {
                name: "rock_01",
                size: 0,
                water: false,
                burnable: false,
                burning: false,
                hitBoxScaleX: 100,
                hitBoxScaleY: 100,
                hitBoxOffsetX: 0,
                hitBoxOffsetY: 10,
                /*** TODO: Use this structure when we have animations for our objects
                 idleAnimationFrames: ["animation0", "animation1", "animation2"],
                 burningAnimationFrames: ["animation0", "animation1", "animation2"],
                 burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                 */
                idleAnimationFrames: ["rock_01", "rock_02", "rock_02", "rock_02", "rock_02", "rock_03", "rock_03", "rock_03", "rock_04", "rock_04", "rock_05", "rock_05", "rock_05", "rock_05",
                    "rock_06", "rock_06", "rock_06", "rock_07", "rock_07", "rock_07", "rock_08", "rock_08", "rock_08", "rock_08"],
                /*** TODO: Use this structure when we have sound for our objects
                 defaultSoundName: "defaultSound",
                 burningSoundName: "burningSound"
                 */
                burnMeterChange: -0.1,
                score: -20
            },
            {
                name: "stump",
                size: 2,
                burnable: true,
                burning: false,
                hitBoxScaleX: 180,
                hitBoxScaleY: 105,
                hitBoxOffsetX: 20,
                hitBoxOffsetY: 10,
                /*** TODO: Use this structure when we have animations for our objects
                 idleAnimationFrames: ["animation0", "animation1", "animation2"],
                 burningAnimationFrames: ["animation0", "animation1", "animation2"],
                 burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                 */
                idleAnimationFrames: ["stump"],
                scorchAnimationFrames: ["stumpScorch_01", "stumpScorch_02"],
                scorchAshenAnimationFrames: ["stumpScorchAshen_01", "stumpScorchAshen_02"],
                burningAnimationFrames: ["stumpBurning_01", "stumpBurning_02"],
                burnedAnimationFrames: ["ashes"],
                /*** TODO: Use this structure when we have sound for our objects
                 defaultSoundName: "defaultSound",
                 burningSoundName: "burningSound"
                 */
                burnMeterChange: 0.1,
                scorchMeterChange: -0.08,
                score: 100
            },
            {
                name: "logs",
                size: 2,
                burnable: true,
                burning: false,
                hitBoxScaleX: 250,
                hitBoxScaleY: 85,
                hitBoxOffsetX: 0,
                hitBoxOffsetY: 10,
                /*** TODO: Use this structure when we have animations for our objects
                 idleAnimationFrames: ["animation0", "animation1", "animation2"],
                 burningAnimationFrames: ["animation0", "animation1", "animation2"],
                 burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                 */
                idleAnimationFrames: ["logs"],
                scorchAnimationFrames: ["logsScorch_01", "logsScorch_02"],
                scorchAshenAnimationFrames: ["logsScorchAshen_01", "logsScorchAshen_02"],
                burningAnimationFrames: ["logsBurning_01", "logsBurning_02"],
                burnedAnimationFrames: ["ashes"],
                /*** TODO: Use this structure when we have sound for our objects
                 defaultSoundName: "defaultSound",
                 burningSoundName: "burningSound"
                 */
                burnMeterChange: 0.1,
                scorchMeterChange: -0.08,
                score: 100
            }
        ],
        player: {
            flameSprite: "littleEmber",
            flameAnimation: ["littleEmber_01", "littleEmber_02", "littleEmber_03", "littleEmber_04", "littleEmber_05", "littleEmber_06", "littleEmber_07",
                "littleEmber_08", "littleEmber_09", "littleEmber_10", "littleEmber_11"],
            flameSound: "flameSoundLvl1"
        },
        gales: {
            galeSprite: "gale_01",
            galeAnimation: ["gale_01", "gale_02", "gale_03", "gale_04", "gale_05", "gale_06"]
        },
        eventLevel: {
            type: "rain",
            name: "waterDropOutline",
            mainAnimation: ["waterDropOutline", "waterDropShadow_08", "waterDropShadow_07", "waterDropShadow_06", "waterDropShadow_05", "waterDropShadow_04",
                "waterDropShadow_03", "waterDropShadow_02", "waterDropOutline"],
            waterDropBody: "waterDrop_01",
            waterDropSplash: ["waterDrop_02", "waterDrop_03", "waterDrop_04", "waterDrop_05", "waterDrop_06"]
        },
        burnMeter: {
            burnMeterSprite: "burnMeter_01",
            burnMeterAnimation: ["burnMeter_01", "burnMeter_02", "burnMeter_03"],
            burnMeterBackground: "burnMeterBackground_01",
            burnMeterCutout: "burnMeterCutout_01"
        },
        scoreGoal: 2500,
        score: {
            currentTimeClear: 0,
            currentHighestCombo: 0,
            currentScore: 0,
            currentGrade: 0,

            bestTimeClear: 0,
            bestHighestCombo: 0,
            bestScore: 0,
            bestGrade: 0

        },
        levelMusic: "lvl1"
    },
    {
        /***
         * TODO: More levels
         */
        level: 2,
        finished: false,
        background: "background_01",
        obstacles: [],
        eventLevel: {},
        scoreGoal: 2500,
        score: {
            currentTimeClear: 0,
            currentHighestCombo: 0,
            currentScore: 0,
            currentGrade: 0,

            bestTimeClear: 0,
            bestHighestCombo: 0,
            bestScore: 0,
            bestGrade: 0
        },
        levelMusic: "lvl2"
    },
    {
        /***
         * TODO: More levels
         */
        level: 3,
        finished: false,
        background: "background_01",
        obstacles: [
            {
                name: "business",
                size: 2,
                burnable: true,
                burning: false,
                hitBoxScaleX: 180,
                hitBoxScaleY: 105,
                hitBoxOffsetX: 20,
                hitBoxOffsetY: 10,
                /*** TODO: Use this structure when we have animations for our objects
                 idleAnimationFrames: ["animation0", "animation1", "animation2"],
                 burningAnimationFrames: ["animation0", "animation1", "animation2"],
                 burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                 */
                idleAnimationFrames: ["stump"],
                scorchAnimationFrames: ["stumpScorch_01", "stumpScorch_02"],
                scorchAshenAnimationFrames: ["stumpScorchAshen_01", "stumpScorchAshen_02"],
                burningAnimationFrames: ["stumpBurning_01", "stumpBurning_02"],
                burnedAnimationFrames: ["ashes"],
                /*** TODO: Use this structure when we have sound for our objects
                 defaultSoundName: "defaultSound",*/
                 burningSoundName: "burningSound",

                burnMeterChange: 0.1,
                scorchMeterChange: -0.08,
                score: 100
            },
        ],
        eventLevel: {},
        scoreGoal: 2500,
        score: {
            currentTimeClear: 0,
            currentHighestCombo: 0,
            currentScore: 0,

            bestTimeClear: 0,
            bestHighestCombo: 0,
            bestScore: 0
        },
        levelMusic: "lvl3"
    }
];

function preload() {
    // Load loading assets
    game.load.atlas("preloadAtlas", "assets/img/spritesheetPreload.png", "assets/img/spritesPreload.json");
}

function create() {
    // switch to loading state
    game.state.add("Loading", Loading);
    game.state.start("Loading");
}
