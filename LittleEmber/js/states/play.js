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
};

Play.prototype = {
    init: function (level) {
        // Initialize incoming variables
        // this.LEVELS = LEVELS;
        this.level = level;
    },
    preload: function () {
        // Load scripts
        game.load.script("GameOver", "js/states/gameOver.js");

        /***
         * TODO: prefab for score maybe WIP
         * game.load.script("endLevelScore", "js/prefabs/endLevelScore.js");
         */

    },
    create: function () {
        this.timeStart = game.time.totalElapsedSeconds();

        // Audio
        this.levelMusic = game.add.audio(LEVELS[this.level].levelMusic);
        this.catchFire = game.add.audio("catchFire");
        this.emberSound = game.add.audio("emberSound");
        this.catchFire.allowMultiple = true;
        this.levelMusic.play('', 0, 0.8, true); // ('marker', start position, volume (0-1), loop)
        this.emberSound.play('', 0, 0.6, true);
        this.flameSizzle = game.add.audio("flameSizzle");

        // Arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Scrolling background
        this.grassBg = game.add.tileSprite(0, 0, 600, 800, LEVELS[this.level].background);

        // Gales mechanic at the bottom of the screen
        this.playerBoosted = false;
        this.gales = game.add.tileSprite(0, game.world.height - 65, 600, 65, "atlas", "gale_01");
        this.gales.animations.add("gales", ["gale_01", "gale_02", "gale_03", "gale_04", "gale_05", "gale_06"], 15, true);
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

        this.playerBurnMeter = 0.5;
        // make player character
        this.player = game.add.sprite(game.world.width / 2, game.world.height - 50, "atlas", "littleEmber"); // for atlas: (x, y, nameOfAtlas, assetNameInAtlas)
        this.player.scale.setTo(this.playerBurnMeter);
        this.player.anchor.set(0.5); // center the mass of player character
        // player physics
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.setCircle(40, 10, 20);
        this.player.body.maxVelocity.x = this.PLAYER_MAX_VELOCITY_X;
        this.player.body.maxVelocity.y = this.PLAYER_MAX_VELOCITY_Y;
        this.player.body.collideWorldBounds = true;

        this.startGame = false;
    },
    update: function () {
        // Check if player is ready
        if (!this.startGame) {
            this.isPlayerReady();
        }

        // Checks if boost from the wind is over
        if (this.playerBoosted && this.player.body.y <= game.world.height / 2) {
            this.playerBoosted = false;
        }

        // Movement of the gales and background sprites
        this.gales.tilePosition.x -= 10;
        this.grassBg.tilePosition.y += this.SCROLLING_SPEED_GRASS;

        // allow the player to exit game to GameOver state by pressing Q
        if (game.input.keyboard.isDown(Phaser.Keyboard.Q) || this.player.scale.x <= 0.2 || this.score >= LEVELS[this.level].scoreGoal) {
            var msg = "Your flame flickers out...";

            this.updateSavedCombo();
            this.updateSavedScore();
            this.updateSavedTime();

            if (this.score >= LEVELS[this.level].scoreGoal) {
                msg = "You burned everything in your way!";
                this.updateSavedBestStats();
                LEVELS[this.level].finished = true;
            }

            localStorage.setItem("LEVELS", JSON.stringify(LEVELS));
            game.sound.stopAll();
            game.state.add("GameOver", GameOver);
            game.state.start("GameOver", true, false, msg);
        }

        // add player input checks
        // since they're not in else ifs, we should be able to get combinatorial movement
        // these combo movements are not as fast as they should technically be, so might add
        // euclidian combinatorial directionns instead
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
            }
            else if (this.player.body.velocity.x < 0) {
                // if player is moving left
                this.player.body.velocity.x += 15;
            }
        }

        // Player overlapping objects
        game.physics.arcade.overlap(this.player, this.obstacles, this.obstacleOverlap, null, this);
        game.physics.arcade.overlap(this.player, this.instructions, this.burnInstructions, null, this);
        game.physics.arcade.overlap(this.player, this.gales, this.boostPlayerUp, null, this);

    },
    createObstacle: function () {
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
    },
    obstacleOverlap: function (player, obstacle) {
        if (!obstacle.burning) {
            obstacle.burning = true;
            if (obstacle.burnable) {
                this.combo += 1;
                this.catchFire.play('', 0, 0.3, false);
                obstacle.animations.play("burning", true);
                game.time.events.add(Phaser.Timer.SECOND, this.switchToAshe, this, obstacle);
                if (obstacle.defaultSoundName !== undefined){
                    obstacle.defaultSoundName.stop();
                }

                if (obstacle.burningSoundName !== undefined){
                    obstacle.burningSoundName.play('', 0, 0.3, true);
                }
            } else {
                if (this.combo > 1) {
                    this.playerBurnMeter += this.combo / 100;
                }
                this.updateSavedCombo();
                this.combo = 0;

                this.flameSizzle.play('', 0, 0.3, false);
            }
            this.updateScore(obstacle.score);
            this.updateComboText();
            this.updateBurnMeter(obstacle.burnMeterChange);
        }
    },
    switchToAshe: function (obstacle) {
        if (obstacle.burningSoundName !== undefined) {
            obstacle.burningSoundName.stop();
        }
        obstacle.animations.play("ashe", true);
    },
    updateScore: function (scoreValue) {
        // Update score
        this.score += scoreValue;
        this.scoreText.text = "Score: " + this.score;
    },
    playerBurnMeterConstantChange: function () {
        // Constant change of the burn meter
        if (this.playerBurnMeter > 0.1) {
            this.playerBurnMeter += this.BURN_METER_CONSTANT_CHANGE;
        }
        this.updatePlayerBurnMeter();
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
            game.time.events.loop(Phaser.Timer.SECOND * 2, this.levelEvent, this);

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
        // spawn event at a random spot and add properties to it
        var x = game.rnd.integerInRange(20, game.world.width - 20);
        var y = game.rnd.integerInRange(200, game.world.height - 30);
        this.eventLevel = game.add.sprite(x, y, "atlas", LEVELS[this.level].eventLevel.name);
        this.eventLevel.anchor.set(0.5);
        this.eventLevel.scale.setTo(0.1);
        this.eventLevel.animations.add("trigger", LEVELS[this.level].eventLevel.mainAnimation, 15, false);

        game.physics.enable(this.eventLevel, Phaser.Physics.ARCADE);
        this.eventLevel.body.setCircle(100);

        this.eventScaling = game.add.tween(this.eventLevel.scale);
        this.eventScaling.to({x: 1, y: 1}, 500, Phaser.Easing.Circular.Out, true, 0, 0, false);
        // play the animation after a second of the spawn
        game.time.events.add(Phaser.Timer.SECOND, this.levelEventAnimation, this, this.eventLevel);

    },
    levelEventAnimation: function (eventLevel) {
        eventLevel.play("trigger");
        eventLevel.animations.currentAnim.onComplete.add(this.eventAnimationStopped, this, eventLevel);
    },
    eventAnimationStopped: function (eventLevel) {
        game.physics.arcade.overlap(this.player, eventLevel, this.hitByAnEvent, null, this);
        this.eventLevel.destroy();

    },
    hitByAnEvent: function (player, event) {
        this.updateScore(-100);
        if (this.combo > 1) {
            this.playerBurnMeter += this.combo / 100;
        }
        this.flameSizzle.play('', 0, 0.3, false);

        this.updateSavedCombo();

        this.combo = 0;
        this.updateComboText();
        this.updateBurnMeter(-0.5);
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
        LEVELS[this.level].score.currentTimeClear = game.time.elapsedSecondsSince(this.timeStart);
    },
    updateSavedBestStats: function () {
        if (LEVELS[this.level].score.currentHighestCombo > LEVELS[this.level].score.bestHighestCombo) {
            LEVELS[this.level].score.bestHighestCombo = LEVELS[this.level].score.currentHighestCombo
        }

        if (LEVELS[this.level].score.currentScore > LEVELS[this.level].score.bestScore) {
            LEVELS[this.level].score.bestScore = LEVELS[this.level].score.currentScore
        }

        if (LEVELS[this.level].score.currentTimeClear < LEVELS[this.level].score.bestTimeClear && LEVELS[this.level].score.bestTimeClear !== 0) {
            LEVELS[this.level].score.bestTimeClear = LEVELS[this.level].score.currentTimeClear
        }
    }
    // render: function () {
    //     game.debug.body(this.player);
    //     // game.debug.spriteInfo(this.player, 32, 32)
    // }
};
