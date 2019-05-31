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
        version: "0.15.13"
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
                hitBoxScaleX: 55,
                hitBoxScaleY: 35,
                hitBoxOffsetX: 10,
                hitBoxOffsetY: 7,
                /*** TODO: Use this structure when we have animations for our objects
                 idleAnimationFrames: ["animation0", "animation1", "animation2"],
                 burningAnimationFrames: ["animation0", "animation1", "animation2"],
                 burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                 */
                idleAnimationFrames: ["wrapper_01"],
                burningAnimationFrames: ["wrapper_02", "wrapper_03"],
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
                /*** TODO: Use this structure when we have sound for our objects
                 defaultSoundName: "defaultSound",
                 burningSoundName: "burningSound"
                 */
                burnMeterChange: -0.4,
                score: -50
            },
            {
                name: "rock_01",
                burnable: false,
                burning: false,
                hitBoxScaleX: 45,
                hitBoxScaleY: 40,
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
                name: "stump_02",
                burnable: false,
                burning: false,
                hitBoxScaleX: 100,
                hitBoxScaleY: 55,
                hitBoxOffsetX: 20,
                hitBoxOffsetY: 10,
                /*** TODO: Use this structure when we have animations for our objects
                 idleAnimationFrames: ["animation0", "animation1", "animation2"],
                 burningAnimationFrames: ["animation0", "animation1", "animation2"],
                 burnedAnimationFrames: ["animation0", "animation1", "animation2"],
                 */
                idleAnimationFrames: ["stump_02"],
                /*** TODO: Use this structure when we have sound for our objects
                 defaultSoundName: "defaultSound",
                 burningSoundName: "burningSound"
                 */
                burnMeterChange: -0.1,
                score: -20
            }
        ],
        eventLevel: {
            type: "rain",
            name: "waterDropOutline",
            mainAnimation: ["waterDrop_01", "waterDrop_02", "waterDrop_03", "waterDrop_04", "waterDrop_05", "waterDrop_06", "waterDrop_07", "waterDrop_08",
                "waterDrop_09", "waterDrop_10"]
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
        obstacles: [],
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

// Data that each level requires to run
var LEVELS = [
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
        scoreGoal: 2500,
        score: {
            currentTimeClear: 0,
            currentHighestCombo: 0,
            currentScore: 0,

            bestTimeClear: 0,
            bestHighestCombo: 0,
            bestScore: 0
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

            bestTimeClear: 0,
            bestHighestCombo: 0,
            bestScore: 0
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
        obstacles: [],
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
    // preload assets
    game.load.image("mainMenuBackground", "assets/img/individualSprites/mainMenu.png");
    game.load.image("background_01", "assets/img/individualSprites/background_01.png");
    game.load.image("planks", "assets/img/individualSprites/planks_01.png");

    game.load.atlas("atlas", "assets/img/spritesheet.png", "assets/img/sprites.json");
    game.load.atlas("atlasBurnBar", "assets/img/atlasBurnBar.png", "assets/img/atlasBurnBar.json");

    game.load.script("mainMenu", "js/states/mainMenu.js");
    game.load.audio("menuMusic", ["assets/audio/menuMusic.mp3"]);
    game.load.audio("lvl1", ["assets/audio/lvl1.mp3"]);
    game.load.audio("flameSoundLvl1", ["assets/audio/flameSoundLvl1.mp3"]);
    game.load.audio("catchFire", ["assets/audio/catchFire.mp3"]);
    game.load.audio("flameSizzle", ["assets/audio/flameSizzle.mp3"]);
    game.load.audio("waterDrop", ["assets/audio/waterDrop.mp3"]);

    game.load.audio("cricketNorm", ["assets/audio/cricketNorm.mp3"]);
    game.load.audio("cricketFire", ["assets/audio/cricketFire.mp3"]);
}

function create() {
    // switch to main menu state
    game.state.add("MainMenu", MainMenu);
    game.state.start("MainMenu");
}
