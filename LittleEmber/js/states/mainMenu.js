/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */

var MainMenu = function (game) {
    this.BUTTON_MARGIN_X = 10;
    this.BUTTON_MARGIN_Y = 60;

    this.MENU_SELECT = [
        {
            buttonName: "newGameButtonDown",
            buttonHoverName: "newGameButton",
            xPosition: this.BUTTON_MARGIN_X,
            yPosition: game.world.height / 3,
            hovered: true
        },
        {
            buttonName: "continueButtonDown",
            buttonHoverName: "continueButton",
            buttonGreyedOut: "continueButtonGreyedOut",
            xPosition: this.BUTTON_MARGIN_X,
            yPosition: game.world.height / 3 + this.BUTTON_MARGIN_Y,
            hovered: false,
            greyedOut: true
        },
        {
            buttonName: "newGameButtonDown",
            buttonHoverName: "newGameButton",
            xPosition: this.BUTTON_MARGIN_X,
            yPosition: game.world.height / 3 + this.BUTTON_MARGIN_Y * 2,
            hovered: false
        },
        {
            buttonName: "newGameButtonDown",
            buttonHoverName: "newGameButton",
            xPosition: this.BUTTON_MARGIN_X,
            yPosition: game.world.height / 3 + this.BUTTON_MARGIN_Y * 3,
            hovered: false
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
        if (localStorage.getItem("LEVELS") !== null) {
            LEVELS = JSON.parse(localStorage.getItem("LEVELS"));
        } else {
            console.log("No save data, Creating it");
            localStorage.setItem("LEVELS", JSON.stringify(LEVELS));
        }

        console.log("Best All Time Combo: " + LEVELS[1].score.bestHighestCombo);
        console.log("Best All Time Score: " + LEVELS[1].score.bestScore);
        console.log("Best All Time Clear: " + LEVELS[1].score.bestTimeClear);
        console.log("===================");

        this.menuBackground = game.add.sprite(0, 0, "mainMenuBackground");

        // Name of our game
        var titleText = game.add.text(game.width / 2, game.height / 8, "Little Ember", {
            font: "Helvetica",
            fontSize: "60px",
            fill: "#faba45"
        });
        titleText.anchor.set(0.5);
        titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        // Add buttons
        var startButton = game.add.button(game.world.centerX + 50, game.world.height / 3, "atlas", this.startNewGame, this, "newGameButton", "newGameButton",
            "newGameButtonDown");
        startButton.anchor.set(0.5);

        this.pointer = 0;
        this.menuButtons = game.add.group();
        this.updateMenu(true);

    },
    update: function () {

        // Select the menu option
        if ((game.input.keyboard.justPressed(Phaser.Keyboard.ENTER) || game.input.keyboard.justPressed(Phaser.Keyboard.E))) {
            console.log(this.pointer);
            if (this.pointer === 0) {
                this.startNewGame();
            }
        }

        // Checks where user is navigating in the main menu
        var direction = -1;
        if ((game.input.keyboard.justPressed(Phaser.Keyboard.W) || game.input.keyboard.justPressed(Phaser.Keyboard.UP))) {
            direction = 0;
        } else if ((game.input.keyboard.justPressed(Phaser.Keyboard.S) || game.input.keyboard.justPressed(Phaser.Keyboard.DOWN))) {
            direction = 1;
        }
        // Moves pointer in the main menu
        if (direction !== -1) {
            this.movePointer(direction);
        }
        // Updates main menu
        this.updateMenu(false);


    },
    movePointer: function (direction) {
        /*** Direction Meaning:
         *   0 - UP
         *   1 - DOWN
         */
        this.MENU_SELECT[this.pointer].hovered = false;

        if (this.pointer === 0) {
            if (direction === 0) {
                this.pointer = this.MENU_SELECT.length - 1;
            } else {
                this.pointer += 1;
            }

            this.checkPointer(direction);
        } else if (this.pointer === this.MENU_SELECT.length - 1) {
            if (direction === 0) {
                this.pointer -= 1;
            } else {
                this.pointer = 0;
            }

            this.checkPointer(direction);
        } else {
            if (direction === 0) {
                this.pointer -= 1;
            } else {
                this.pointer += 1;
            }

            this.checkPointer(direction);
        }
        this.MENU_SELECT[this.pointer].hovered = true;

    },
    checkPointer: function (direction) {
        /*** Direction Meaning:
         *   0 - UP
         *   1 - DOWN
         */
        while (this.MENU_SELECT[this.pointer].greyedOut !== undefined && this.MENU_SELECT[this.pointer].greyedOut) {
            if (direction === 0) {
                this.pointer -= 1;
                if (this.pointer < 0) {
                    this.pointer = this.MENU_SELECT.length - 1;
                }
            } else {
                this.pointer += 1;
                if (this.pointer === this.MENU_SELECT.length) {
                    this.pointer = 0;
                }
            }
        }
    },
    updateMenu: function (isFirstTime) {
        var i;
        var menuButton;
        for (i in this.MENU_SELECT) {
            if (this.MENU_SELECT[i].greyedOut !== undefined) {
                if (this.MENU_SELECT[i].greyedOut && !LEVELS[1].finished) {
                    if (isFirstTime) {
                        menuButton = game.add.sprite(this.MENU_SELECT[i].xPosition, this.MENU_SELECT[i].yPosition, "atlas", this.MENU_SELECT[i].buttonGreyedOut);
                        menuButton.anchor.set(0, 0.5);
                        menuButton.alpha = 0.3;
                        this.menuButtons.add(menuButton);
                    } else {
                        menuButton = this.menuButtons.getAt(i);
                        menuButton.loadTexture("atlas", this.MENU_SELECT[i].buttonGreyedOut);
                    }
                    continue;
                }
            }

            if (this.MENU_SELECT[i].hovered) {
                if (isFirstTime) {
                    menuButton = game.add.sprite(this.MENU_SELECT[i].xPosition, this.MENU_SELECT[i].yPosition, "atlas", this.MENU_SELECT[i].buttonHoverName);
                    menuButton.anchor.set(0, 0.5);
                    this.menuButtons.add(menuButton);

                } else {
                    menuButton = this.menuButtons.getAt(i);
                    menuButton.loadTexture("atlas", this.MENU_SELECT[i].buttonHoverName);
                }
            } else {
                if (isFirstTime) {
                    menuButton = game.add.sprite(this.MENU_SELECT[i].xPosition, this.MENU_SELECT[i].yPosition, "atlas", this.MENU_SELECT[i].buttonName);
                    menuButton.anchor.set(0, 0.5);
                    this.menuButtons.add(menuButton);
                } else {
                    menuButton = this.menuButtons.getAt(i);
                    menuButton.loadTexture("atlas", this.MENU_SELECT[i].buttonName);
                }
            }
        }
    },
    startNewGame: function () {
        // Start new game
        this.resetSavedData();
        game.sound.stopAll();
        game.state.add("Play", Play);
        game.state.start("Play", true, false, 1);
    },
    resetSavedData: function () {
        var i;
        for (i in LEVELS) {
            LEVELS[i].finished = false;
            var j;
            for (j in LEVELS[i].score) {
                LEVELS[i].score[j] = 0;
            }

        }
    }
};
