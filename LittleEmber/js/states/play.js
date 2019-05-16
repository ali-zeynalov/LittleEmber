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

    this.BURN_METER_MAX = -0.02;
    this.BURN_METER_MIN = -0.97;
    this.BURN_METER_CONSTANT_CHANGE = -0.01;
};

Play.prototype = {
    init: function (LEVELS, level) {
        // Initialize incoming variables
        this.LEVELS = LEVELS;
        this.level = level;
    },
    preload: function () {
        // Load scripts
        game.load.script("GameOver", "js/states/gameOver.js");
        this.levelMusic = game.add.audio(this.LEVELS[this.level].levelMusic);
        this.catchFire = game.add.audio("catchFire");
        this.emberSound = game.add.audio("emberSound");
        this.catchFire.allowMultiple = true;
        this.levelMusic.play('', 0, 0.8, true); // ('marker', start position, volume (0-1), loop)
        this.emberSound.play('', 0, 0.6, true);

        /***
         * TODO: prefab for score maybe WIP
         * game.load.script("endLevelScore", "js/prefabs/endLevelScore.js");
         */

    },
    create: function () {
        // Arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Scrolling background
        this.grassBg = game.add.tileSprite(0, 0, 600, 800, this.LEVELS[this.level].background);

        // Default score
        this.score = 0;
        this.scoreText = game.add.text(16, 16, "Score: 0", {fontSize: "32px", fill: "#000"});
        this.scoreText.setShadow(3, 3, 'rgba(255,255,255,255)', 2);

        // Group that holds all of the obstacles
        this.obstacles = game.add.group();
        this.levelEvents = game.add.group();

        // group for showing instructions to the player
        this.instructions = game.add.group();
        this.controlsInstruction = game.add.sprite(game.world.width / 5, game.world.height / 3, "atlas", "controls");
        this.controlsInstruction.anchor.set(0.5);
        this.controlsInstruction.animations.add("burning", ["controlsBurning_01", "controlsBurning_02"], 15, true);
        game.physics.enable(this.controlsInstruction, Phaser.Physics.ARCADE);

        this.levelInstructions = game.add.sprite(game.world.width - game.world.width / 5, game.world.height / 3, "atlas", "instructions");
        this.levelInstructions.anchor.set(0.5);
        this.levelInstructions.animations.add("burning", ["instructionsBurning_01", "instructionsBurning_02"], 15, true);
        game.physics.enable(this.levelInstructions, Phaser.Physics.ARCADE);

        this.instructions.add(this.controlsInstruction);
        this.instructions.add(this.levelInstructions);

        // make player character
        this.player = game.add.sprite(game.world.width / 2, game.world.height - 50, "atlas", "littleEmber"); // for atlas: (x, y, nameOfAtlas, assetNameInAtlas)
        this.player.scale.setTo(0.5, 0.5);
        this.player.anchor.set(0.5); // center the mass of player character
        // player physics
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.maxVelocity.x = this.PLAYER_MAX_VELOCITY_X;
        this.player.body.maxVelocity.y = this.PLAYER_MAX_VELOCITY_Y;
        this.player.body.collideWorldBounds = true;

        // Burn meter
        this.burnMeter = game.add.sprite(game.world.width - 220, 0, "atlas", "burnMeter_01");
        this.burnMeter.animations.add("burning", ["burnMeter_01", "burnMeter_02", "burnMeter_03"], 15, true);
        this.burnMeter.animations.play("burning", true);
        this.burnMeterBackground = game.add.sprite(game.world.width, 0, "atlas", "burnMeterBackground");
        this.burnMeterBackground.scale.x = this.BURN_METER_MAX;
        this.burnMeterCutout = game.add.sprite(game.world.width - 220, 0, "atlas", "burnMeterCutout");

        game.state.add("GameOver", GameOver);

        this.startGame = false;

    },
    update: function () {
        // Check if player is ready
        if (!this.startGame) {
            this.isPlayerReady();
        }

        this.grassBg.tilePosition.y += this.SCROLLING_SPEED_GRASS;
        // allow the player to exit game to GameOver state by pressing Q
        if (game.input.keyboard.isDown(Phaser.Keyboard.Q) || this.burnMeterBackground.scale.x <= this.BURN_METER_MIN) {
            this.levelMusic.stop();
            this.emberSound.stop();
            game.state.start("GameOver", true, false, "Your flame flickers out...");
        }
        // Check if the score is met the finish level conditions
        if (this.score >= this.LEVELS[this.level].scoreGoal) {
            this.levelMusic.stop();
            this.emberSound.stop();
            game.state.start("GameOver", true, false, "You burned everything in your way!");
        }

        // add player input checks
        // since they're not in else ifs, we should be able to get combinatorial movement
        // these combo movements are not as fast as they should technically be, so might add
        // euclidian combinatorial directionns instead
        if ((game.input.keyboard.isDown(Phaser.Keyboard.W) || game.input.keyboard.isDown(Phaser.Keyboard.UP)) &&
            (!game.input.keyboard.isDown(Phaser.Keyboard.S) && !game.input.keyboard.isDown(Phaser.Keyboard.DOWN))) {

            this.player.body.velocity.y -= this.PLAYER_VELOCITY_CHANGE;

        } else if ((game.input.keyboard.isDown(Phaser.Keyboard.S) || game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) &&
            (!game.input.keyboard.isDown(Phaser.Keyboard.W) && !game.input.keyboard.isDown(Phaser.Keyboard.UP))) {

            this.player.body.velocity.y += this.PLAYER_VELOCITY_CHANGE;

        } else {
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
        game.physics.arcade.overlap(this.player, this.obstacles, this.playerOverlap, null, this);
        game.physics.arcade.overlap(this.player, this.instructions, this.burnInstructions, null, this);


    },
    createObstacle: function () {
        // Creating the obstacle
        do {
            var obstacleIndex = game.rnd.integerInRange(0, this.LEVELS[this.level].obstacles.length - 1);
        } while (obstacleIndex === this.previousObstacleIndex);

        this.previousObstacleIndex = obstacleIndex;

        var x = game.rnd.integerInRange(0, game.world.width);
        var y = -20;
        var direction = Math.floor(game.rnd.pick([-1, 1]));
        var xVelocity = 0;
        var yVelocity = this.OBSTACLE_VELOCITY;
        var maxVelocity = this.OBSTACLE_MAX_VELOCITY;

        this.obstacle = new Obstacle(game, x, y, direction, this.LEVELS[this.level].obstacles[obstacleIndex], xVelocity, yVelocity, maxVelocity);
        // Add the object to the game
        game.add.existing(this.obstacle);
        this.obstacles.add(this.obstacle);
    },
    playerOverlap: function (player, obstacle) {
        if (!obstacle.burning) {
            obstacle.burning = true;
            if (obstacle.burnable) {

                this.catchFire.play('', 0, 0.3, false);
                obstacle.animations.play("burning", true);
                game.time.events.add(Phaser.Timer.SECOND, this.switchToAshe, this, obstacle);

            } else {

                /***
                 * TODO: Play extinguishing fire sound
                 */
            }
            this.changeScore(obstacle.score);
            this.updateBurnMeter(obstacle.burnMeterChange);
        }
    },
    switchToAshe: function (obstacle) {
        /***
         * TODO: Add sounds change here
         */
        obstacle.animations.play("ashe", true);
    },
    changeScore: function (scoreValue) {
        this.score += scoreValue;
        this.scoreText.text = "Score: " + this.score;
    },
    burnMeterConstantChange: function () {
        if (this.burnMeterBackground.scale.x > this.BURN_METER_MIN) {
            this.burnMeterBackground.scale.x += this.BURN_METER_CONSTANT_CHANGE;
        }
    },
    updateBurnMeter: function (value) {
        this.burnMeterBackground.scale.x += value;
        if (this.burnMeterBackground.scale.x > this.BURN_METER_MAX) {
            this.burnMeterBackground.scale.x = this.BURN_METER_MAX;
        } else if (this.burnMeterBackground.scale.x < this.BURN_METER_MIN) {
            this.burnMeterBackground.scale.x = this.BURN_METER_MIN;
        }
    },
    isPlayerReady: function () {
        if (this.instructions.length === 0) {
            // updated value to start the game
            this.startGame = true;

            // Every time spawns obstacles
            game.time.events.loop(Phaser.Timer.SECOND, this.createObstacle, this);
            this.previousObstacleIndex = 0;

            // Start the burn meter
            game.time.events.loop(Phaser.Timer.SECOND / 2, this.burnMeterConstantChange, this);

            // Play event
            game.time.events.loop(Phaser.Timer.SECOND * 5, this.levelEvent, this);

        }
    },
    burnInstructions: function (player, instructionBoard) {
        if (instructionBoard.animations.currentAnim !== "burning") {
            instructionBoard.animations.play("burning");
            game.time.events.add(Phaser.Timer.SECOND, this.destroyInstructions, this, instructionBoard);
        }
    },
    destroyInstructions: function (instructionBoard) {
        instructionBoard.destroy();
    },
    levelEvent: function () {
        // spawn event at a random spot and add properties to it
        var x = game.rnd.integerInRange(0, game.world.width);
        var y = game.rnd.integerInRange(200, game.world.height);
        this.eventLevel = game.add.sprite(x, y, "atlas", this.LEVELS[this.level].eventName);
        this.eventLevel.anchor.set(0.5);
        this.eventLevel.animations.add("trigger", this.LEVELS[this.level].eventAnimation, 15, false);

        game.physics.enable(this.eventLevel, Phaser.Physics.ARCADE);

        // play the animation after 2 seconds of the spawn
        game.time.events.add(Phaser.Timer.SECOND * 2, this.levelEventAnimation, this, this.eventLevel);

    },
    levelEventAnimation: function (eventLevel) {
        eventLevel.play("trigger");
        eventLevel.animations.currentAnim.onComplete.add(this.eventAnimationStopped, this);
    },
    eventAnimationStopped: function () {
        game.physics.arcade.overlap(this.player, this.eventLevel, this.hitByAnEvent, null, this);
        this.eventLevel.destroy();

    },
    hitByAnEvent: function (player, event) {
        this.updateBurnMeter(-0.5);
    }
};
