/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */

var Play = function (game) {
    this.SCROLLING_SPEED_GRASS = 5;

    this.OBSTACLE_VELOCITY = 300;
    this.OBSTACLE_MAX_VELOCITY = 500;

    this.PLAYER_VELOCITY_CHANGE = 75;
    this.PLAYER_MAX_VELOCITY_X = 300;
    this.PLAYER_MAX_VELOCITY_Y = 360;
    this.PLAYER_STATINARY_VELOCITY_Y = 100;
    this.BURN_METER_CONSTANT_CHANGE = -0.01;

    this.BURN_BAR_MAX = 0.9;
    this.BURN_BAR_MIN = 0.045;
    this.BURN_BAR_INCREMENT_CHANGE = -0.025;
};

Play.prototype = {
    init: function (level) {
        // Initialize incoming variables
        // this.LEVELS = LEVELS;
        this.level = level;
    },
    create: function () {
        this.timeStart = game.time.totalElapsedSeconds();

        this.numberOfBadsHit = 0;
        this.newHighScore = false;

        // Audio
        this.levelMusic = game.add.audio(LEVELS[this.level].levelMusic);
        this.catchFire = game.add.audio("catchFire");
        this.flameSound = game.add.audio(LEVELS[this.level].player.flameSound);
        this.flameSound.play("", 0, 0.4, true); // 0.4 volume due to initial scale of player
        this.levelMusic.play("", 0, 0.8, true); // ('marker', start position, volume (0-1), loop)
        this.flameSizzle = game.add.audio("flameSizzle");

        // Arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Scrolling background
        this.grassBg = game.add.tileSprite(0, 0, 600, 800, LEVELS[this.level].background);

        // Gales mechanic at the bottom of the screen
        this.playerBoosted = false;
        this.gales = game.add.tileSprite(0, game.world.height - 65, 600, 65, "atlas", LEVELS[this.level].gales.galeSprite);
        this.gales.animations.add("gales", LEVELS[this.level].gales.galeAnimation, 15, true);
        this.gales.animations.play("gales");
        game.physics.enable(this.gales, Phaser.Physics.ARCADE);

        // Default score
        // textStyle
        var textStyle = {
            font: "Audiowide",
            fontSize: 32,
            fontWeight: "bold",
            fill: "#000"
        };

        this.score = 0;
        this.scoreText = game.add.text(16, 16, "Score: 0", textStyle);
        this.scoreText.setShadow(3, 3, "rgba(255,255,255,255)", 2);

        var textStyle = {
            font: "Rock Salt",
            fontSize: 32,
            fontWeight: "bold",
            fill: "#000"
        };

        this.combo = 0;
        this.comboText = game.add.text(64, 64, "", textStyle);
        this.comboText.setShadow(3, 3, "rgba(255,255,255,255)", 2);

        // Group that holds all of the obstacles
        this.obstacles = game.add.group();
        this.levelEvents = game.add.group();

        // group for showing instructions to the player
        this.instructions = game.add.group();
        this.controlsInstruction = game.add.sprite(game.world.width / 5, game.world.height / 3, "atlas", "controls");
        this.controlsInstruction.anchor.set(0.5);
        this.controlsInstruction.animations.add("burning", ["controlsBurning_01", "controlsBurning_02"], 15, true);
        this.controlsInstruction.animations.add("idle", ["controls"], 15, false);
        this.controlsInstruction.animations.play("idle");
        game.physics.enable(this.controlsInstruction, Phaser.Physics.ARCADE);

        this.levelInstructions = game.add.sprite(game.world.width - game.world.width / 5, game.world.height / 3, "atlas", "instructions");
        this.levelInstructions.anchor.set(0.5);
        this.levelInstructions.animations.add("burning", ["instructionsBurning_01", "instructionsBurning_02"], 15, true);
        this.levelInstructions.animations.add("idle", ["instructions"], 15, false);
        this.levelInstructions.animations.play("idle");
        game.physics.enable(this.levelInstructions, Phaser.Physics.ARCADE);

        this.instructions.add(this.controlsInstruction);
        this.instructions.add(this.levelInstructions);

        // make player character
        this.playerBurnMeter = 0.5;
        this.playerSize = 0;

        this.player = game.add.sprite(game.world.width / 2, game.world.height - 50, "atlas", LEVELS[this.level].player.flameSprite);
        this.player.animations.add("burning", LEVELS[this.level].player.flameAnimation, 30, true);
        this.player.animations.play("burning");
        this.player.scale.setTo(this.playerBurnMeter);
        this.player.anchor.set(0.5); // center the mass of player character
        // player physics
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.setCircle(50, 2, 13);
        this.player.body.maxVelocity.x = this.PLAYER_MAX_VELOCITY_X;
        this.player.body.maxVelocity.y = this.PLAYER_MAX_VELOCITY_Y;
        this.player.body.collideWorldBounds = true;

        // Burn bar
        this.burnBar = game.add.sprite(game.world.width - 220, 0, "atlas", LEVELS[this.level].burnMeter.burnMeterSprite); // (x, y, atlas, nameOnAtlas)
        this.burnBar.animations.add("burning", LEVELS[this.level].burnMeter.burnMeterAnimation, 15, true);
        this.burnBar.animations.play("burning", true);

        this.burnBarBackground = game.add.sprite(game.world.width, 0, "atlas", LEVELS[this.level].burnMeter.burnMeterBackground);
        this.burnBarBackground.anchor.x = 1;
        this.burnBarBackground.scale.x = this.BURN_BAR_MAX;

        this.burnBarCutout = game.add.sprite(game.world.width - 220, 0, "atlas", LEVELS[this.level].burnMeter.burnMeterCutout);

        this.startGame = false;
        this.isGameOver = false;
    },
    update: function () {
        // Check if player is ready
        if (!this.startGame) {
            this.isPlayerReady();
        }

        if (this.player.scale.x >= 1.3) {
            this.playerSize = 2;
        } else if (this.player.scale.x >= 0.8) {
            this.playerSize = 1;
        } else {
            this.playerSize = 0;
        }
        // console.log(this.playerSize);

        // Checks if boost from the wind is over
        if (this.playerBoosted && this.player.body.y <= game.world.height / 2) {
            this.playerBoosted = false;
        }

        // Movement of the gales and background sprites
        this.gales.tilePosition.x -= 10;
        this.grassBg.tilePosition.y += this.SCROLLING_SPEED_GRASS;

        // allow the player to exit game to GameOver state by pressing Q
        if (game.input.keyboard.isDown(Phaser.Keyboard.Q) || this.player.scale.x <= 0.2 || this.burnBarBackground.scale.x <= this.BURN_BAR_MIN) {
            var levelComplete = false;

            this.updateSavedCombo();
            this.updateSavedScore();
            this.updateSavedTime();

            if (this.burnBarBackground.scale.x <= this.BURN_BAR_MIN) {
                this.updateSavedBestStats();
                this.calculateGrade();
                LEVELS[this.level].finished = true;
                levelComplete = true;
            }

            if (window.localStorage) {
                localStorage.setItem("LEVELS", JSON.stringify(LEVELS));
            }
            game.sound.stopAll();
            this.levelMusic.resume();
            this.removeObjects();

            this.isGameOver = true;
            game.state.add("GameOver", GameOver);
            game.state.start("GameOver", false, false, this.level, levelComplete, this.newHighScore);
        }

        // add player input checks
        // since they're not in else ifs, we should be able to get combinatorial movement
        // these combo movements are not as fast as they should technically be, so might add
        // euclidian combinatorial directionns instead
        if (!this.isGameOver) {
            if ((game.input.keyboard.isDown(Phaser.Keyboard.W) || game.input.keyboard.isDown(Phaser.Keyboard.UP)) &&
                (!game.input.keyboard.isDown(Phaser.Keyboard.S) && !game.input.keyboard.isDown(Phaser.Keyboard.DOWN))) {

                this.player.body.velocity.y -= this.PLAYER_VELOCITY_CHANGE;

            } else if ((game.input.keyboard.isDown(Phaser.Keyboard.S) || game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) &&
                (!game.input.keyboard.isDown(Phaser.Keyboard.W) && !game.input.keyboard.isDown(Phaser.Keyboard.UP)) && !this.playerBoosted) {

                this.player.body.velocity.y += this.PLAYER_VELOCITY_CHANGE;

            } else if (!this.playerBoosted) {
                if (this.player.body.velocity.y <= 0) {
                    // if player is moving up slow it down to 0
                    this.player.body.velocity.y += 30;
                } else {
                    // slowly fall to the bottom of the screen
                    this.player.body.velocity.y = this.PLAYER_STATINARY_VELOCITY_Y;
                }
            }

            if ((game.input.keyboard.isDown(Phaser.Keyboard.A) || game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) &&
                (!game.input.keyboard.isDown(Phaser.Keyboard.D) && !game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))) {

                this.player.body.velocity.x -= this.PLAYER_VELOCITY_CHANGE;

            } else if ((game.input.keyboard.isDown(Phaser.Keyboard.D) || game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) &&
                (!game.input.keyboard.isDown(Phaser.Keyboard.A) && !game.input.keyboard.isDown(Phaser.Keyboard.LEFT))) {

                this.player.body.velocity.x += this.PLAYER_VELOCITY_CHANGE;

            } else {
                if (this.player.body.velocity.x > 0) {
                    // if player is moving right
                    this.player.body.velocity.x -= 15;
                } else if (this.player.body.velocity.x < 0) {
                    // if player is moving left
                    this.player.body.velocity.x += 15;
                }
            }

            // Player overlapping objects
            game.physics.arcade.overlap(this.player, this.obstacles, this.obstacleOverlap, null, this);
            game.physics.arcade.overlap(this.player, this.instructions, this.burnInstructions, null, this);
            game.physics.arcade.overlap(this.player, this.gales, this.boostPlayerUp, null, this);
            game.physics.arcade.overlap(this.player, this.levelEvents, this.hitByAnEvent, null, this);

        }
    },
    createObstacle: function () {
        if (!this.isGameOver) {
            // Creating the obstacle
            do {
                var obstacleIndex = game.rnd.integerInRange(0, LEVELS[this.level].obstacles.length - 1);
            } while (obstacleIndex === this.previousObstacleIndex);

            this.previousObstacleIndex = obstacleIndex;

            var x = game.rnd.integerInRange(0, game.world.width);
            var y = -20;
            var direction = Math.floor(game.rnd.pick([-1, 1]));
            var xVelocity = 0;
            var yVelocity = this.OBSTACLE_VELOCITY;
            var maxVelocity = this.OBSTACLE_MAX_VELOCITY;

            this.obstacle = new Obstacle(game, x, y, direction, LEVELS[this.level].obstacles[obstacleIndex], xVelocity, yVelocity, maxVelocity);
            // Add the object to the game
            game.add.existing(this.obstacle);
            this.obstacles.add(this.obstacle);
        }
    },
    obstacleOverlap: function (player, obstacle) {
        if (!obstacle.burning) {
            var justScorched = false;
            obstacle.burning = true;
            if (obstacle.burnable) {
                // If player is smaller than the object
                if (this.playerSize < obstacle.size) {

                    this.playerBurnMeter += this.combo / 100;
                    this.updateSavedCombo();
                    this.combo = 0;
                    obstacle.animations.play("burning", true);
                    obstacle.animations.play("scorched", true);
                    game.time.events.add(Phaser.Timer.HALF, this.switchToScorchedAshe, this, obstacle);
                    this.numberOfBadsHit = this.numberOfBadsHit + 0.5;
                    justScorched = true;
                } else {
                    this.combo += 1;
                    this.catchFire.play('', 0, 0.3, false);
                    obstacle.animations.play("burning", true);
                    // add progress to level completion bar
                    this.incrementBurnBar();
                    game.time.events.add(Phaser.Timer.HALF, this.switchToAshe, this, obstacle);
                    if (obstacle.defaultSoundName !== undefined) {
                        obstacle.defaultSoundName.stop();
                    }

                    if (obstacle.burningSoundName !== undefined) {
                        obstacle.burningSoundName.play('', 0, 0.3, true);
                    }
                }

            } else {
                this.playerBurnMeter += this.combo / 100;

                this.updateSavedCombo();
                this.combo = 0;
                if (obstacle.water) {
                    this.flameSizzle.play('', 0, 0.3, false);
                }
                this.numberOfBadsHit++;
            }
            if (!justScorched) {
                this.updateScore(obstacle.score);
                this.updateBurnMeter(obstacle.burnMeterChange);
            } else {
                this.updateBurnMeter(obstacle.scorchMeterChange);
            }
            this.updateComboText();

        }
    },
    switchToAshe: function (obstacle) {
        if (obstacle.burningSoundName !== undefined) {
            obstacle.burningSoundName.stop();
        }
        obstacle.animations.play("ashe", false);
    },
    switchToScorchedAshe: function (obstacle) {
        obstacle.animations.play("scorchedAshe", false);
    },
    updateScore: function (scoreValue) {
        // Update score
        this.score += scoreValue + Math.round(scoreValue * this.combo / 100);
        this.scoreText.text = "Score: " + this.score;
    },
    playerBurnMeterConstantChange: function () {
        if (!this.isGameOver) {
            // Constant change of the burn meter
            if (this.playerBurnMeter > 0.1) {
                this.playerBurnMeter += this.BURN_METER_CONSTANT_CHANGE;
            }
            this.updatePlayerBurnMeter();
        }
    },
    updateBurnMeter: function (value) {
        // Change the value of the burn meter based on the object burned
        this.playerBurnMeter += value;
        this.updatePlayerBurnMeter();

    },
    updatePlayerBurnMeter: function () {
        // Update the size of the player based on the burn meter(hidden) and combo meter
        if (this.playerBurnMeter < 0.1) {
            this.playerBurnMeter = 0.1;
        }
        var currentSize = this.playerBurnMeter + (this.combo > 1 ? this.combo / 100 : 0);

        if (currentSize > 2) {
            currentSize = 2;
        }

        // see if player volume needs to change (based on player size)
        if (currentSize <= 0.6) { // player is smol (0.6 is arbitrary, but no use making a const for this imo
            this.flameSound.volume = 0.4;
            // console.log("player smol volume engaged");
        } else if (currentSize > 0.6 && currentSize <= 1.5) { // player is avg size
            this.flameSound.volume = 0.6;
            // console.log("player avg volume engaged");
        } else { // player is a h*ckin' ch0nker
            this.flameSound.volume = 1;
            // console.log("player ch0nker volume engaged");
        }

        this.playerScaling = game.add.tween(this.player.scale);
        this.playerScaling.to({x: currentSize, y: currentSize}, 500, Phaser.Easing.Circular.Out, true, 0, 0, false);
    },
    updateComboText: function () {
        if (this.combo > 1) {
            this.comboText.text = "x" + this.combo;
        } else {
            this.comboText.text = "";
        }
    },
    isPlayerReady: function () {
        if (this.instructions.length === 0) {
            // updated value to start the game
            this.startGame = true;

            // Every time spawns obstacles
            game.time.events.loop(Phaser.Timer.SECOND / 1.5, this.createObstacle, this);
            this.previousObstacleIndex = 0;

            // Start the burn meter
            game.time.events.loop(Phaser.Timer.HALF, this.playerBurnMeterConstantChange, this);

            // Play event
            var time;
            if (LEVELS[this.level].eventLevel.type === "rain") {
                time = Phaser.Timer.SECOND;
            } else {
                time = Phaser.Timer.SECOND * 5;
            }
            game.time.events.loop(time, this.levelEvent, this);

        }
    },
    burnInstructions: function (player, instructionBoard) {
        if (instructionBoard.animations.currentAnim.name !== "burning") {
            instructionBoard.animations.play("burning");
            this.catchFire.play('', 0, 0.3, false);
            game.time.events.add(Phaser.Timer.SECOND, this.destroyInstructions, this, instructionBoard);
        }
    },
    destroyInstructions: function (instructionBoard) {
        instructionBoard.destroy();
    },
    levelEvent: function () {
        if (!this.isGameOver) {
            if (LEVELS[this.level].eventLevel.type === "rain") {
                // spawn event at a random spot and add properties to it
                var x = game.rnd.integerInRange(20, game.world.width - 20);
                var y = game.rnd.integerInRange(200, game.world.height - 30);

                this.eventLevel = new LevelEvent(game, x, y, LEVELS[this.level].eventLevel);

                game.add.existing(this.eventLevel);
                this.levelEvents.add(this.eventLevel);
            }
        }

    },
    hitByAnEvent: function (player, event) {
        if (event.levelEventAnimationStopped) {
            this.updateScore(-100);
            if (this.combo > 1) {
                this.playerBurnMeter += this.combo / 100;
            }
            this.flameSizzle.play('', 0, 0.3, false);

            this.updateSavedCombo();

            this.combo = 0;
            this.updateComboText();
            this.updateBurnMeter(-0.5);
            this.numberOfBadsHit++;
        }
    },
    boostPlayerUp: function (player, gales) {
        this.playerBoosted = true;
        player.body.velocity.y = -this.PLAYER_MAX_VELOCITY_Y;
    },
    updateSavedCombo: function () {
        if (LEVELS[this.level].score.currentHighestCombo === 0 || this.combo > LEVELS[this.level].score.currentHighestCombo) {
            LEVELS[this.level].score.currentHighestCombo = this.combo;
        }
    },
    updateSavedScore: function () {
        LEVELS[this.level].score.currentScore = this.score;
    },
    updateSavedTime: function () {
        LEVELS[this.level].score.currentTimeClear = game.time.totalElapsedSeconds() - this.timeStart;
    },
    updateSavedBestStats: function () {
        if (LEVELS[this.level].score.currentHighestCombo > LEVELS[this.level].score.bestHighestCombo) {
            LEVELS[this.level].score.bestHighestCombo = LEVELS[this.level].score.currentHighestCombo;
        }

        if (LEVELS[this.level].score.currentScore > LEVELS[this.level].score.bestScore) {
            LEVELS[this.level].score.bestScore = LEVELS[this.level].score.currentScore;
        }

        if (LEVELS[this.level].score.bestTimeClear === 0 || LEVELS[this.level].score.currentTimeClear < LEVELS[this.level].score.bestTimeClear) {
            LEVELS[this.level].score.bestTimeClear = LEVELS[this.level].score.currentTimeClear;
        }
    },
    removeObjects: function () {

        this.comboText.text = "";
        this.scoreText.text = "";
        /***
         * TODO: Remove burn meter here
         */
        this.burnBar.destroy();
        this.burnBarBackground.destroy();
        this.burnBarCutout.destroy();

        this.gales.kill();
        this.obstacles.killAll();
        this.levelEvents.killAll();

    },
    calculateGrade: function () {
        var time;
        if (LEVELS[this.level].score.currentTimeClear <= 60) {
            time = 100;
        } else if (LEVELS[this.level].score.currentTimeClear <= 90) {
            time = 80
        } else {
            time = 60
        }

        var combo;
        if (LEVELS[this.level].score.currentHighestCombo >= 30) {
            combo = 100;
        } else if (LEVELS[this.level].score.currentHighestCombo >= 15) {
            combo = 80;
        } else {
            combo = 60;
        }

        var hits;
        if (this.numberOfBadsHit === 0) {
            hits = 100;
        } else if (this.numberOfBadsHit <= 3) {
            hits = 80;
        } else if (this.numberOfBadsHit <= 5) {
            hits = 60;
        } else {
            hits = 50;
        }

        var score;
        if (LEVELS[this.level].score.currentScore >= 2000) {
            score = 100;
        } else if (LEVELS[this.level].score.currentScore >= 1700) {
            score = 80;
        } else if (LEVELS[this.level].score.currentScore >= 1500) {
            score = 70;
        } else if (LEVELS[this.level].score.currentScore >= 1200) {
            score = 60;
        } else {
            score = 50;
        }

        var finalPercent = 20 + 0.20 * time + 0.20 * combo + 0.20 * hits + 0.20 * score;
        LEVELS[this.level].score.currentGrade = finalPercent;
        if (finalPercent > LEVELS[this.level].score.bestGrade) {
            this.newHighScore = true;
            LEVELS[this.level].score.bestGrade = finalPercent;
        }
    },
    incrementBurnBar: function () {
        this.burnBarBackground.scale.x += this.BURN_BAR_INCREMENT_CHANGE;
    }
    // ,
    // render: function () {
    //     game.debug.body(this.player);
    //     // game.debug.spriteInfo(this.player, 32, 32)
    // }
};
