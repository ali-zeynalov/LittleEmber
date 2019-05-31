/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */

var MainMenu = function (game) {
    this.BUTTON_MARGIN_X = 10;
    this.BUTTON_MARGIN_Y = 60;
};

MainMenu.prototype = {
    preload: function () {
        // Preload scripts
        game.load.script("play", "js/states/play.js");
    },
    create: function () {
        // Create variables to control the menu
        this.MENU_SELECT = [
            {
                buttonName: "newGameButtonDown",
                buttonHoverName: "newGameButton",
                buttonHoverAnimation: ["newGameButton_01", "newGameButton_02"],
                xPosition: this.BUTTON_MARGIN_X,
                yPosition: game.world.height / 3,
                hovered: true
            },
            {
                buttonName: "continueButtonDown",
                buttonHoverName: "continueButton",
                buttonGreyedOut: "continueButtonGreyedOut",
                buttonHoverAnimation: ["continueButton_01", "continueButton_02"],
                xPosition: this.BUTTON_MARGIN_X,
                yPosition: game.world.height / 3 + this.BUTTON_MARGIN_Y,
                hovered: false,
                greyedOut: true
            },
            {
                /***
                 * TODO: Below opetions are here as placeholders for testing, need to replace them with other menu options
                 */
                buttonName: "newGameButtonDown",
                buttonHoverName: "newGameButton",
                buttonHoverAnimation: ["newGameButton_01", "newGameButton_02"],
                xPosition: this.BUTTON_MARGIN_X,
                yPosition: game.world.height / 3 + this.BUTTON_MARGIN_Y * 2,
                hovered: false
            },
            {
                buttonName: "newGameButtonDown",
                buttonHoverName: "newGameButton",
                buttonHoverAnimation: ["newGameButton_01", "newGameButton_02"],
                xPosition: this.BUTTON_MARGIN_X,
                yPosition: game.world.height / 3 + this.BUTTON_MARGIN_Y * 3,
                hovered: false
            }
        ];

        this.LEVEL_SELECT = {
            isLevelSelectMenuOn: false,
            levelSelect: false,
            levels: [
                {
                    buttonName: "level1ButtonDown",
                    buttonHoverName: "level1Button",
                    buttonHoverAnimation: ["level1Button_01", "level1Button_02"],
                    xPosition: game.world.centerX,
                    yPosition: this.MENU_SELECT[1].yPosition,
                    hovered: false,
                    greyedOut: false

                },
                {
                    buttonName: "level2ButtonDown",
                    buttonHoverName: "level2Button",
                    buttonHoverAnimation: ["level2Button_01", "level2Button_02"],
                    xPosition: game.world.centerX,
                    yPosition: this.MENU_SELECT[1].yPosition + this.BUTTON_MARGIN_Y,
                    hovered: false,
                    greyedOut: false

                },
                {
                    buttonName: "level3ButtonDown",
                    buttonHoverName: "level3Button",
                    buttonGreyedOut: "level3ButtonGreyedOut",
                    buttonHoverAnimation: ["level3Button_01", "level3Button_02"],
                    xPosition: game.world.centerX,
                    yPosition: this.MENU_SELECT[1].yPosition + this.BUTTON_MARGIN_Y * 2,
                    hovered: false,
                    greyedOut: true

                }
            ]
        };

        // Background music
        this.menuMusic = game.add.audio("menuMusic");
        this.menuMusic.play('', 0, 0.8, true); // ('marker', start position, volume (0-1), loop)

        if (window.localStorage) {
            if (localStorage.getItem("LEVELS") !== null) {
                var levels = JSON.parse(localStorage.getItem("LEVELS"));
                if (levels[0].version === LEVELS[0].version){
                    LEVELS = levels;
                    console.log("Version is up to date :)");
                } else {
                    console.log("Old version, Updating...");
                    localStorage.setItem("LEVELS", JSON.stringify(LEVELS));
                }

            } else {
                console.log("No save data, Creating it...");
                localStorage.setItem("LEVELS", JSON.stringify(LEVELS));
            }
        }
        this.menuBackground = game.add.sprite(0, 0, "mainMenuBackground");

        // Name of our game
        var titleText = game.add.text(game.world.width / 2, game.world.height / 8, "Little Ember", {
            font: "Comic Sans MS",
            fontSize: "60px",
            fill: "#faba45"
        });
        titleText.anchor.set(0.5);
        titleText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        // Pointer to keep track on what menu button we are on
        this.pointer = 0;
        this.menuButtons = game.add.group();
        this.updateMenu(true);
        this.isMenuChanging = false;
        // Point sprite to make it look nice
        this.pointerSprite = game.add.sprite(this.menuButtons.getAt(0).width + 20, this.MENU_SELECT[0].yPosition, "atlas", "littleEmber");
        this.pointerSprite.anchor.set(0.5);
        this.pointerSprite.scale.setTo(0.2);

        this.levelSelectPointer = 0;
        this.levelButtons = game.add.group();

        this.switchingStates = false;

        // Show player their previous stats
        var textStyle = {
            font: "Comic Sans MS",
            fontSize: "48px",
            fill: "#fa8b1d"
        };

        this.bestLevelStatsTitle = game.add.text(game.world.width / 2, game.world.height - game.world.height / 3, "", textStyle);
        this.bestLevelStatsTitle.anchor.set(0.5);
        this.bestLevelStatsTitle.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        textStyle = {
            font: "Comic Sans MS",
            fontSize: "28px",
            fill: "#fa8b1d",
            align: "left",
            lineSpacing: "1px"
        };

        this.bestAllTimeStats = game.add.text(20, game.world.height - game.world.height / 7, "", textStyle);
        this.bestAllTimeStats.anchor.set(0, 0.5);
        this.bestAllTimeStats.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        textStyle = {
            font: "Comic Sans MS",
            fontSize: "28px",
            fill: "#fa8b1d",
            align: "center",
            lineSpacing: "1px"
        };

        this.bestRun = game.add.text(game.world.width - 20, game.world.height - game.world.height / 7, "", textStyle);
        this.bestRun.anchor.set(1, 0.5);
        this.bestRun.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);


    },
    update: function () {
        // Select the menu option
        if ((game.input.keyboard.justPressed(Phaser.Keyboard.ENTER) || game.input.keyboard.justPressed(Phaser.Keyboard.E)) && !this.switchingStates) {
            if (this.pointer === 0) {
                this.switchingStates = true;
                this.startNewGame();
            }
        }

        // When selecting a level
        if ((game.input.keyboard.justPressed(Phaser.Keyboard.ENTER) || game.input.keyboard.justPressed(Phaser.Keyboard.E))
            && this.LEVEL_SELECT.levelSelect && !this.switchingStates) {
            this.switchingStates = true;
            this.LEVEL_SELECT.levelSelect = false;
            this.startLevel(this.levelSelectPointer + 1);
        }

        // Show list of levels to start at
        if (this.pointer === 1 && this.MENU_SELECT[this.pointer].hovered && !this.switchingStates) {
            if (this.levelButtons.length === 0) {
                this.updateLevelSelect(true);
            }
            // If player wants to select a level switch to different level select mode
            if ((game.input.keyboard.justPressed(Phaser.Keyboard.ENTER) || game.input.keyboard.justPressed(Phaser.Keyboard.E)
                || game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) || game.input.keyboard.justPressed(Phaser.Keyboard.D))
                && !this.LEVEL_SELECT.levelSelect) {
                this.isMenuChanging = true;
                this.LEVEL_SELECT.levelSelect = true;
                this.LEVEL_SELECT.levels[0].hovered = true;
            }
            // If player wants to get out then switch back from level select mode
            if ((game.input.keyboard.justPressed(Phaser.Keyboard.ESC) || game.input.keyboard.justPressed(Phaser.Keyboard.LEFT)
                || game.input.keyboard.justPressed(Phaser.Keyboard.A)) && this.LEVEL_SELECT.levelSelect) {
                this.isMenuChanging = true;
                this.LEVEL_SELECT.levelSelect = false;
                this.LEVEL_SELECT.levels[this.levelSelectPointer].hovered = false;
                this.levelSelectPointer = 0;
                this.updateLevelSelect(false);
                this.isMenuChanging = true;
            }
        } else {
            // If not hovering over continue then remove the level select
            this.removeLevelSelect();
        }

        // Checks where user is navigating in the main menu
        var direction = -1;
        if ((game.input.keyboard.justPressed(Phaser.Keyboard.W) || game.input.keyboard.justPressed(Phaser.Keyboard.UP))) {
            this.isMenuChanging = true;
            direction = 0;
        } else if ((game.input.keyboard.justPressed(Phaser.Keyboard.S) || game.input.keyboard.justPressed(Phaser.Keyboard.DOWN))) {
            this.isMenuChanging = true;
            direction = 1;
        }
        // Moves pointer in the main menu
        if (direction !== -1) {
            this.movePointer(direction);
        }

        // Updates main menu
        if (!this.LEVEL_SELECT.levelSelect) {
            if (this.isMenuChanging) {
                this.updateMenu(false);
                this.bestLevelStatsTitle.text = "";
                this.bestAllTimeStats.text = "";
                this.bestRun.text = "";
            }
        } else {
            if (this.isMenuChanging) {
                this.updateLevelSelect(false);
                this.showBestStats();
            }
        }

    },
    movePointer: function (direction) {
        /*** Direction Meaning:
         *   0 - UP
         *   1 - DOWN
         */
        if (!this.LEVEL_SELECT.levelSelect) {
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

        } else {
            this.LEVEL_SELECT.levels[this.levelSelectPointer].hovered = false;

            if (this.levelSelectPointer === 0) {
                if (direction === 0) {
                    this.levelSelectPointer = this.LEVEL_SELECT.levels.length - 1;
                } else {
                    this.levelSelectPointer += 1;
                }

                this.checkPointer(direction);
            } else if (this.levelSelectPointer === this.LEVEL_SELECT.levels.length - 1) {
                if (direction === 0) {
                    this.levelSelectPointer -= 1;
                } else {
                    this.levelSelectPointer = 0;
                }

                this.checkPointer(direction);
            } else {
                if (direction === 0) {
                    this.levelSelectPointer -= 1;
                } else {
                    this.levelSelectPointer += 1;
                }

                this.checkPointer(direction);
            }
            this.LEVEL_SELECT.levels[this.levelSelectPointer].hovered = true;
        }

    },
    checkPointer: function (direction) {
        /*** Direction Meaning:
         *   0 - UP
         *   1 - DOWN
         */
        if (!this.LEVEL_SELECT.levelSelect) {
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
        } else {
            while (this.LEVEL_SELECT.levels[this.levelSelectPointer].greyedOut !== undefined && this.LEVEL_SELECT.levels[this.levelSelectPointer].greyedOut) {
                if (direction === 0) {
                    this.levelSelectPointer -= 1;
                    if (this.levelSelectPointer < 0) {
                        this.levelSelectPointer = this.LEVEL_SELECT.levels.length - 1;
                    }
                } else {
                    this.levelSelectPointer += 1;
                    if (this.levelSelectPointer === this.LEVEL_SELECT.levels.length) {
                        this.levelSelectPointer = 0;
                    }
                }
            }

        }
    },
    updateMenu: function (isFirstTime) {
        // Going through each menu option array variable and checking parameters
        var i;
        var menuButton;
        for (i in this.MENU_SELECT) {
            if (this.MENU_SELECT[i].greyedOut !== undefined) {
                this.MENU_SELECT[i].greyedOut = !LEVELS[1].finished;
                if (this.MENU_SELECT[i].greyedOut) {
                    if (isFirstTime) {
                        menuButton = game.add.sprite(this.MENU_SELECT[i].xPosition, this.MENU_SELECT[i].yPosition, "atlas", this.MENU_SELECT[i].buttonGreyedOut);
                        menuButton.anchor.set(0, 0.5);
                        menuButton.alpha = 0.3;
                        menuButton.animations.add("selected", this.MENU_SELECT[i].buttonHoverAnimation, 15, true);
                        menuButton.animations.add("idle", [this.MENU_SELECT[i].buttonName], 15, false);
                        this.menuButtons.add(menuButton);
                    } else {
                        menuButton = this.menuButtons.getAt(i);
                        menuButton.loadTexture("atlas", this.MENU_SELECT[i].buttonGreyedOut);
                        menuButton.alpha = 0.3;
                    }
                    continue;
                }
            }

            if (this.MENU_SELECT[i].hovered) {
                if (isFirstTime) {
                    menuButton = game.add.sprite(this.MENU_SELECT[i].xPosition, this.MENU_SELECT[i].yPosition, "atlas", this.MENU_SELECT[i].buttonHoverName);
                    menuButton.anchor.set(0, 0.5);
                    menuButton.animations.add("selected", this.MENU_SELECT[i].buttonHoverAnimation, 15, true);
                    menuButton.animations.add("idle", [this.MENU_SELECT[i].buttonName], 15, false);
                    this.menuButtons.add(menuButton);
                } else {
                    menuButton = this.menuButtons.getAt(i);
                    menuButton.loadTexture("atlas", this.MENU_SELECT[i].buttonHoverName);
                    this.pointerSprite.x = menuButton.width + 20;
                    this.pointerSprite.y = this.MENU_SELECT[i].yPosition;
                    menuButton.alpha = 1;

                }
                if (menuButton.animations.currentAnim.name !== "selected" || this.isMenuChanging) {
                    menuButton.animations.play("selected");
                }
            } else {
                if (isFirstTime) {
                    menuButton = game.add.sprite(this.MENU_SELECT[i].xPosition, this.MENU_SELECT[i].yPosition, "atlas", this.MENU_SELECT[i].buttonName);
                    menuButton.anchor.set(0, 0.5);
                    menuButton.animations.add("selected", this.MENU_SELECT[i].buttonHoverAnimation, 15, true);
                    menuButton.animations.add("idle", [this.MENU_SELECT[i].buttonName], 15, false);
                    this.menuButtons.add(menuButton);
                } else {
                    menuButton = this.menuButtons.getAt(i);
                    if (menuButton.animations.currentAnim.name === "selected") {
                        menuButton.animations.stop(null, true);
                        menuButton.animations.play("idle");
                    }
                    menuButton.loadTexture("atlas", this.MENU_SELECT[i].buttonName);
                    menuButton.alpha = 1;
                }
            }
        }
        this.isMenuChanging = false;
    },
    updateLevelSelect: function (firstInitialization) {
        // Going through each level select option array variable and checking parameters
        var levelButton;
        for (var i = 0; i < this.LEVEL_SELECT.levels.length; i++) {
            if (this.LEVEL_SELECT.levels[i].greyedOut !== undefined) {
                if (i + 1 < this.LEVEL_SELECT.levels.length) {
                    if (LEVELS[i + 1].finished) {
                        this.LEVEL_SELECT.levels[i].greyedOut = false;
                        if (i + 1 < this.LEVEL_SELECT.levels.length) {
                            this.LEVEL_SELECT.levels[i + 1].greyedOut = false;
                        }
                    }
                }
                if (this.LEVEL_SELECT.levels[i].greyedOut) {
                    if (firstInitialization) {
                        levelButton = game.add.sprite(this.LEVEL_SELECT.levels[i].xPosition, this.LEVEL_SELECT.levels[i].yPosition, "atlas", this.LEVEL_SELECT.levels[i].buttonGreyedOut);
                        levelButton.anchor.set(0, 0.5);
                        levelButton.alpha = 0.5;
                        levelButton.animations.add("selected", this.LEVEL_SELECT.levels[i].buttonHoverAnimation, 15, true);
                        levelButton.animations.add("idle", [this.LEVEL_SELECT.levels[i].buttonName], 15, false);
                        this.levelButtons.add(levelButton);
                    } else {
                        levelButton = this.levelButtons.getAt(i);
                        levelButton.loadTexture("atlas", this.LEVEL_SELECT.levels[i].buttonGreyedOut);
                        levelButton.alpha = 0.5;
                    }
                    continue;
                }
            }

            if (this.LEVEL_SELECT.levels[i].hovered) {
                if (firstInitialization) {
                    levelButton = game.add.sprite(this.LEVEL_SELECT.levels[i].xPosition, this.LEVEL_SELECT.levels[i].yPosition, "atlas", this.LEVEL_SELECT.levels[i].buttonHoverName);
                    levelButton.anchor.set(0, 0.5);
                    levelButton.animations.add("selected", this.LEVEL_SELECT.levels[i].buttonHoverAnimation, 15, true);
                    levelButton.animations.add("idle", [this.LEVEL_SELECT.levels[i].buttonName], 15, false);
                    this.levelButtons.add(levelButton);
                } else {
                    levelButton = this.levelButtons.getAt(i);
                    levelButton.loadTexture("atlas", this.LEVEL_SELECT.levels[i].buttonHoverName);
                    this.pointerSprite.x = this.LEVEL_SELECT.levels[i].xPosition + levelButton.width + 20;
                    this.pointerSprite.y = this.LEVEL_SELECT.levels[i].yPosition;
                    levelButton.alpha = 1;

                }
                if (levelButton.animations.currentAnim.name !== "selected" || this.isMenuChanging) {
                    levelButton.animations.play("selected");
                }
            } else {
                if (firstInitialization) {
                    levelButton = game.add.sprite(this.LEVEL_SELECT.levels[i].xPosition, this.LEVEL_SELECT.levels[i].yPosition, "atlas", this.LEVEL_SELECT.levels[i].buttonName);
                    levelButton.anchor.set(0, 0.5);
                    levelButton.animations.add("selected", this.LEVEL_SELECT.levels[i].buttonHoverAnimation, 15, true);
                    levelButton.animations.add("idle", [this.LEVEL_SELECT.levels[i].buttonName], 15, false);
                    this.levelButtons.add(levelButton);
                } else {
                    levelButton = this.levelButtons.getAt(i);
                    if (levelButton.animations.currentAnim.name === "selected") {
                        levelButton.animations.stop(null, true);
                        levelButton.animations.play("idle");
                    }
                    levelButton.loadTexture("atlas", this.LEVEL_SELECT.levels[i].buttonName);
                    levelButton.alpha = 1;
                }
            }

        }
        this.isMenuChanging = false;
    },
    removeLevelSelect: function () {
        this.levelButtons.removeAll();
    },
    startNewGame: function () {
        // Start new game
        this.resetSavedData();
        game.sound.stopAll();
        game.state.add("Play", Play);
        game.state.start("Play", true, false, 1);
    },
    startLevel: function (level) {
        game.sound.stopAll();
        game.state.add("Play", Play);
        game.state.start("Play", true, false, level);
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
    },
    showBestStats: function () {
        // Show on the screen the stats for specific level
        var levelTitle = "Level " + (this.levelSelectPointer + 1) + " Stats";
        this.bestLevelStatsTitle.text = levelTitle;

        var bestTime = "Best Time: ";

        if (LEVELS[this.levelSelectPointer + 1].score.bestTimeClear / 60 >= 1) {
            bestTime += Math.floor(LEVELS[this.levelSelectPointer + 1].score.bestTimeClear / 60) + "m ";
        }
        bestTime += Math.round(LEVELS[this.levelSelectPointer + 1].score.bestTimeClear % 60) + "s\n";

        var bestCombo = "Highest Combo: " + LEVELS[this.levelSelectPointer + 1].score.bestHighestCombo + "\n";

        var bestScore = "Highest Score: " + LEVELS[this.levelSelectPointer + 1].score.bestScore + "\n";
        var bestAllTimeStats = bestTime + bestCombo + bestScore;
        this.bestAllTimeStats.text = bestAllTimeStats;

        this.calculateBestGrade()
    },
    calculateBestGrade: function () {
        var percent = LEVELS[this.levelSelectPointer + 1].score.bestGrade;
        console.log(this.levelSelectPointer + 1);
        console.log(percent);
        this.bestRun.text = "Best Run:\n";
        if (percent >= 99) {
            this.bestRun.text += "S";
        } else if (percent >= 97) {
            this.bestRun.text += "A+"
        } else if (percent >= 93) {
            this.bestRun.text += "A";
        } else if (percent >= 90) {
            this.bestRun.text += "A-";
        } else if (percent >= 87) {
            this.bestRun.text += "B+";
        } else if (percent >= 83) {
            this.bestRun.text += "B";
        } else if (percent >= 80) {
            this.bestRun.text += "B-";
        } else if (percent >= 77) {
            this.bestRun.text += "C+";
        } else if (percent >= 73) {
            this.bestRun.text += "C";
        } else if (percent >= 70) {
            this.bestRun.text += "C-";
        } else if (percent >= 67) {
            this.bestRun.text += "D+";
        } else if (percent >= 63) {
            this.bestRun.text += "D";
        } else if (percent === 0) {
            this.bestRun.text += "NONE";
        } else {
            this.bestRun.text += "D-";
        }
    }
};
