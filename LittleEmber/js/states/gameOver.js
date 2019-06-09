/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */
var GameOver = function (game) {
    this.BUTTON_MARGIN_Y = game.world.height - game.world.height / 5
};
GameOver.prototype = {
    init: function (level, levelComplete, newHighScore) {
        this.level = level;
        this.levelComplete = levelComplete;
        this.newHighScore = newHighScore;
    },
    create: function () {
        // Array that holds all the information about buttons
        this.MENU_SELECT = [
            {
                buttonName: "mainMenuButtonDown",
                buttonHoverName: "mainMenuButton",
                buttonHoverAnimation: ["mainMenuButton_01", "mainMenuButton_02"],
                xPosition: game.world.width / 9,
                yPosition: this.BUTTON_MARGIN_Y,
                hovered: false
            },
            {
                buttonName: "continueButtonDown",
                buttonHoverName: "continueButton",
                buttonHoverAnimation: ["continueButton_01", "continueButton_02"],
                xPosition: game.world.width - game.world.width / 3 - 20,
                yPosition: this.BUTTON_MARGIN_Y,
                hovered: true
            },
            {
                buttonName: "restartButtonDown",
                buttonHoverName: "restartButton",
                buttonHoverAnimation: ["restartButton_01", "restartButton_02"],
                xPosition: game.world.width - game.world.width / 3,
                yPosition: this.BUTTON_MARGIN_Y,
                hovered: true
            }
        ];

        // Board picture
        this.woodenBoard = game.add.sprite(game.world.centerX, game.world.centerY, "gameOver");
        this.woodenBoard.anchor.set(0.5);

        // Title format and text
        var textStyle = {
            font: "Comic Sans MS",
            fontSize: "48px",
            fill: "#fa8b1d"
        };

        this.gameOverTitle = game.add.text(game.world.centerX, game.world.height / 7, "", textStyle);
        this.gameOverTitle.anchor.set(0.5);
        this.gameOverTitle.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        // Tips format and text if lost
        textStyle = {
            font: "Comic Sans MS",
            fontSize: "28px",
            fill: "#fa8b1d",
            wordWrap: true,
            wordWrapWidth: 370
        };

        this.tips = game.add.text(game.world.centerX, game.world.height / 3, "", textStyle);
        this.tips.anchor.set(0.5);
        this.tips.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        this.stats = game.add.text(game.world.centerX, game.world.centerY, "", textStyle);
        this.stats.anchor.set(0.5);
        this.stats.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        this.newHighScoreText = game.add.text(game.world.centerX, game.world.height / 3 * 2 + 40, "", textStyle);
        this.newHighScoreText.anchor.set(0.5);
        this.newHighScoreText.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        // Grade text
        textStyle = {
            font: "Comic Sans MS",
            fontSize: "34px",
            fill: "#fa8b1d",
            wordWrap: true,
            wordWrapWidth: 370
        };

        this.grade = game.add.text(game.world.centerX, game.world.height / 3 * 2, "", textStyle);
        this.grade.anchor.set(0.5);
        this.grade.setShadow(3, 3, 'rgba(0,0,0,0.5)', 0);

        if (this.levelComplete) {
            this.gameOverTitle.text = "Level Complete!";
            this.showGameStats();
        } else {
            this.gameOverTitle.text = "Level Failed";
            this.tips.text = "Tip: Try avoiding water and big objects.";
        }

        if (this.levelComplete) {
            this.pointer = 1;
        } else {
            this.pointer = 2;
        }

        this.isMenuChanging = false;
        this.menuButtons = game.add.group();
        this.updateMenu(true);
    },
    update: function () {
        // Check to see which button was pressed and change direction variable
        var direction = -1;
        if ((game.input.keyboard.justPressed(Phaser.Keyboard.A) || game.input.keyboard.justPressed(Phaser.Keyboard.LEFT))) {
            this.isMenuChanging = true;
            direction = 0;
        } else if ((game.input.keyboard.justPressed(Phaser.Keyboard.D) || game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT))) {
            this.isMenuChanging = true;
            direction = 1;
        }

        // Moves pointer in the menu based on the direction
        if (direction !== -1) {
            this.movePointer(direction);
        }
        // Update the menu
        if (this.isMenuChanging) {
            this.updateMenu(false);
        }

        // If player clicked Enter or E do w/e button it was pressed on
        if ((game.input.keyboard.justPressed(Phaser.Keyboard.E) || game.input.keyboard.justPressed(Phaser.Keyboard.ENTER))) {
            if (this.pointer === 0) {
                this.titleScreen();
            } else {
                if (this.pointer === 1) {
                    this.transition(this.level);
                } else {
                    this.startLevel(this.level);
                }
            }
        }
    },
    movePointer: function (direction) {
        /*** Direction Meaning:
         *   0 - LEFT
         *   1 - RIGHT
         */
        this.MENU_SELECT[this.pointer].hovered = false;
        if (this.pointer === 0) {
            if (direction === 0) {
                if (this.levelComplete) {
                    this.pointer = 1;
                } else {
                    this.pointer = 2;
                }
            } else {
                if (this.levelComplete) {
                    this.pointer = 1;
                } else {
                    this.pointer = 2;
                }
            }
        } else {
            this.pointer = 0;
        }
        this.MENU_SELECT[this.pointer].hovered = true;
    },
    titleScreen: function () {
        // switch to MainMenu state
        game.sound.stopAll();
        game.state.start("MainMenu", true, false, true);
    },
    updateMenu: function (isFirstTime) {
        // Going through each menu option array variable and checking parameters
        var menuButton;
        var index;
        if (this.levelComplete) {
            index = 1;
        } else {
            index = 2;
        }

        for (var i = 0; i < 2; i++) {
            if (i === 1) {
                i = index;
            }

            if (this.MENU_SELECT[i].hovered) {
                if (isFirstTime) {
                    menuButton = game.add.sprite(this.MENU_SELECT[i].xPosition, this.MENU_SELECT[i].yPosition, "atlas", this.MENU_SELECT[i].buttonHoverName);
                    menuButton.anchor.set(0, 0.5);
                    menuButton.animations.add("selected", this.MENU_SELECT[i].buttonHoverAnimation, 15, true);
                    menuButton.animations.add("idle", [this.MENU_SELECT[i].buttonName], 15, false);
                    this.menuButtons.add(menuButton);
                } else {
                    menuButton = this.menuButtons.getAt(i === 0 ? 0 : 1);
                    menuButton.loadTexture("atlas", this.MENU_SELECT[i].buttonHoverName)
                }
                if (menuButton.animations.currentAnim.name !== "selected" && this.MENU_SELECT[i].hovered) {
                    menuButton.animations.play("selected");
                }
            } else {
                if (isFirstTime) {
                    menuButton = game.add.sprite(this.MENU_SELECT[i].xPosition, this.MENU_SELECT[0].yPosition, "atlas", this.MENU_SELECT[i].buttonName);
                    menuButton.anchor.set(0, 0.5);
                    menuButton.animations.add("selected", this.MENU_SELECT[i].buttonHoverAnimation, 15, true);
                    menuButton.animations.add("idle", [this.MENU_SELECT[i].buttonName], 15, false);
                    this.menuButtons.add(menuButton);
                } else {
                    menuButton = this.menuButtons.getAt(i === 0 ? 0 : 1);
                    if (menuButton.animations.currentAnim.name === "selected") {
                        menuButton.animations.stop(null, true);
                        menuButton.animations.play("idle");
                    }
                    menuButton.loadTexture("atlas", this.MENU_SELECT[i].buttonName)
                }
            }
        }
        this.isMenuChanging = false;
    },
    startLevel: function (level) {
        // Restart level
        game.sound.stopAll();
        game.state.start("Play", true, false, level);
    },
    transition: function (level) {
        // Switch to cutscene if won
        game.sound.stopAll();
        var xDirection = 0;
        var yDirection = 0;

        if (level === 1) {
            xDirection = -50;
        } else if (level === 2) {
            yDirection = -50;
        }

        game.state.add("Cutscene", Cutscene);
        game.state.start("Cutscene", true, false, level, xDirection, yDirection);
    },
    showGameStats: function () {
        // Show on the screen the stats for specific level
        var bestTime = "Time: ";

        if (LEVELS[this.level].score.currentTimeClear / 60 >= 1) {
            bestTime += Math.floor(LEVELS[this.level].score.currentTimeClear / 60) + "m ";
        }
        bestTime += Math.round(LEVELS[this.level].score.currentTimeClear % 60) + "s\n";

        var bestCombo = "Highest Combo: " + LEVELS[this.level].score.currentHighestCombo + "\n";

        var bestScore = "Score: " + LEVELS[this.level].score.currentScore + "\n";
        var bestAllTimeStats = bestTime + bestCombo + bestScore;
        this.stats.text = bestAllTimeStats;

        this.calculateGrade();
        if (this.newHighScore) {
            this.newHighScoreText.text = "NEW HIGH SCORE!";
        }
    },
    calculateGrade: function () {
        var percent = LEVELS[this.level].score.currentGrade;
        this.grade.text = "Grade: ";
        if (percent >= 99) {
            this.grade.text += "S";
        } else if (percent >= 97) {
            this.grade.text += "A+"
        } else if (percent >= 93) {
            this.grade.text += "A";
        } else if (percent >= 90) {
            this.grade.text += "A-";
        } else if (percent >= 87) {
            this.grade.text += "B+";
        } else if (percent >= 83) {
            this.grade.text += "B";
        } else if (percent >= 80) {
            this.grade.text += "B-";
        } else if (percent >= 77) {
            this.grade.text += "C+";
        } else if (percent >= 73) {
            this.grade.text += "C";
        } else if (percent >= 70) {
            this.grade.text += "C-";
        } else if (percent >= 67) {
            this.grade.text += "D+";
        } else if (percent >= 63) {
            this.grade.text += "D";
        } else {
            this.grade.text += "D-";
        }
    }
};
