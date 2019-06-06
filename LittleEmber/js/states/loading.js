/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */
var Loading = function (game) {

};
Loading.prototype = {

    preload: function () {
        // Loading screen logic
        game.stage.backgroundColor = "#000000";
        // Adding fire logo
        this.logo = game.add.sprite(game.world.centerX, game.world.centerY, "preloadAtlas", "littleEmber");
        this.logo.anchor.setTo(0.5);

        // Adding loading bar and animation
        this.backgroundBar = game.add.sprite(game.world.width / 4, game.world.height - game.world.height / 3, "preloadAtlas",
            "loadingBarBackground");
        this.preloadBar = game.add.sprite(game.world.width / 4, game.world.height - game.world.height / 3, "preloadAtlas",
            "loadingBar_01");
        this.preloadBar.animations.add("loading", ["loadingBar_01", "loadingBar_02", "loadingBar_03"], 15, true);
        this.preloadBar.animations.play("loading");

        this.load.setPreloadSprite(this.preloadBar);

        // preload assets
        game.load.image("mainMenuBackground", "assets/img/individualSprites/mainMenu.png");
        game.load.image("background_01", "assets/img/individualSprites/background_01.png");
        game.load.image("planks", "assets/img/individualSprites/planks_01.png");
        game.load.image("tutorialScreen", "assets/img/individualSprites/tutorialScreen.png");

        game.load.atlas("atlas", "assets/img/spritesheet.png", "assets/img/sprites.json");

        game.load.audio("menuMusic", ["assets/audio/menuMusic.mp3"]);
        game.load.audio("lvl1", ["assets/audio/lvl1.mp3"]);
        game.load.audio("flameSoundLvl1", ["assets/audio/flameSoundLvl1.mp3"]);
        game.load.audio("catchFire", ["assets/audio/catchFire.mp3"]);
        game.load.audio("flameSizzle", ["assets/audio/flameSizzle.mp3"]);
        game.load.audio("waterDrop", ["assets/audio/waterDrop.mp3"]);
        game.load.audio("menuSelect", ["assets/audio/menuSelect.mp3"]);

        game.load.audio("cricketNorm", ["assets/audio/cricketNorm.mp3"]);
        game.load.audio("cricketFire", ["assets/audio/cricketFire.mp3"]);
    },
    create: function () {
        // switch to main menu state
        game.state.add("MainMenu", MainMenu);
        game.state.start("MainMenu", true, false, true);
    }
};
