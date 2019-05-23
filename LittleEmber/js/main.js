/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */

var game = new Phaser.Game(600, 800, Phaser.AUTO, "", {preload: preload, create: create});

function preload() {
    // preload assets
    game.load.image("mainMenuBackground", "assets/img/individualSprites/mainMenuBackground.png");
    game.load.image("background_01", "assets/img/individualSprites/background_01.png");

    game.load.atlas("atlas", "assets/img/spritesheet.png", "assets/img/sprites.json");

    game.load.script("mainMenu", "js/states/mainMenu.js");
    game.load.audio("menuMusic", ["assets/audio/menuMusic.mp3"]);
    game.load.audio("emberTrack", ["assets/audio/emberSound.mp3"]);
    game.load.audio("lvl1", ["assets/audio/lvl1.mp3"]);
    game.load.audio("emberSound", ["assets/audio/emberSound.mp3"]);
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
