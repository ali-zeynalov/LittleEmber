var game = new Phaser.Game(600, 800, Phaser.AUTO, "", { preload: preload, create: create});

function preload() {
	// preload assets
    game.load.image("grassBackground", "assets/img/individualSprites/grassBackground.png");
    game.load.image("bush", "assets/img/individualSprites/bush.png");
    game.load.image("flowers", "assets/img/individualSprites/flowers.png");
    game.load.image("branches", "assets/img/individualSprites/branches.png");

    game.load.spritesheet("startButton", "assets/img/individualSprites/startButtonSpriteSheet.png", 180, 100);

    game.load.script("mainMenu", "js/states/mainMenu.js");
}

function create() {
    // switch to main menu state
    game.state.add("MainMenu", MainMenu);
    game.state.start("MainMenu");
}
