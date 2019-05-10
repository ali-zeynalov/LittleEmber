var game = new Phaser.Game(600, 800, Phaser.AUTO, "", {preload: preload, create: create});

function preload() {
    // preload assets
    game.load.image("grassBackground", "assets/img/individualSprites/grassBackground.png");

    game.load.atlas("atlas", "assets/img/spritesheet.png", "assets/img/sprites.json");

    game.load.script("mainMenu", "js/states/mainMenu.js");
}

function create() {
    // switch to main menu state
    game.state.add("MainMenu", MainMenu);
    game.state.start("MainMenu");
}
