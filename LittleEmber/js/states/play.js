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
    this.PLAYER_MAX_VELOCITY = 300;

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

        // Group that holds all of the obstacles
        this.obstacles = game.add.group();

        // Every time spawns obstacles
        game.time.events.loop(Phaser.Timer.SECOND, this.createObstacle, this);
        this.previousObstacleIndex = 0;
        this.obstacles = game.add.group();

        // Default score
        this.score = 0;
        this.scoreText = game.add.text(16, 16, "Score: 0", {fontSize: "32px", fill: "#000"});
        this.scoreText.setShadow(3, 3, 'rgba(255,255,255,255)', 2);

        console.log("State: Play");

        // make player character
        this.player = game.add.sprite(game.world.width / 2, game.world.height - 50, "atlas", "littleEmber"); // for atlas: (x, y, nameOfAtlas, assetNameInAtlas)
        this.player.scale.setTo(0.5, 0.5);
        this.player.anchor.set(0.5); // center the mass of player character
        // player physics
        game.physics.enable(this.player, Phaser.Physics.ARCADE);
        this.player.body.maxVelocity.set(this.PLAYER_MAX_VELOCITY);
        this.player.body.collideWorldBounds = true;

        // Burn meter
        this.burnMeter = game.add.sprite(game.world.width - 220, 0, "atlas", "burnMeter_01");
        this.burnMeter.animations.add("burning", ["burnMeter_01", "burnMeter_02", "burnMeter_03"], 15, true);
        this.burnMeter.animations.play("burning", true);
        this.burnMeterBackground = game.add.sprite(game.world.width, 0, "atlas", "burnMeterBackground");
        this.burnMeterBackground.scale.x = this.BURN_METER_MAX;
        this.burnMeterCutout = game.add.sprite(game.world.width - 220, 0, "atlas", "burnMeterCutout");

        game.time.events.loop(Phaser.Timer.SECOND / 2, this.burnMeterConstantChange, this);

        game.state.add("GameOver", GameOver);

    },
    update: function () {
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
        if (game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.player.body.velocity.y -= this.PLAYER_VELOCITY_CHANGE;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            this.player.body.velocity.y += this.PLAYER_VELOCITY_CHANGE;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x -= this.PLAYER_VELOCITY_CHANGE;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x += this.PLAYER_VELOCITY_CHANGE;
        }
        // if stuff isn't being held down to move, slow to a stop
        if (!game.input.keyboard.isDown(Phaser.Keyboard.W) && !game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            if (this.player.body.velocity.y > this.PLAYER_MAX_VELOCITY) { // if we were going down
                this.player.body.velocity.y -= 15;
            }
            else if (this.player.body.velocity.y < this.PLAYER_MAX_VELOCITY) { // if we were going up
                this.player.body.velocity.y += 30;
            }
        }
        if (!game.input.keyboard.isDown(Phaser.Keyboard.A) && !game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            if (this.player.body.velocity.x > 0) { // if we were going down
                this.player.body.velocity.x -= 15;
            }
            else if (this.player.body.velocity.x < 0) { // if we were going up
                this.player.body.velocity.x += 15;
            }
        }

        // Player overlapping objects
        game.physics.arcade.overlap(this.player, this.obstacles, this.playerOverlap, null, this);

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
            this.catchFire.play('', 0, 0.3, false);
            obstacle.animations.play("burning", true);
            /***
             * TODO: Add sound change here as well
             */
            game.time.events.add(Phaser.Timer.SECOND, this.switchToAshe, this, obstacle);
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
        } else if (this.burnMeterBackground.scale.x < this.BURN_METER_MIN){
            this.burnMeterBackground.scale.x = this.BURN_METER_MIN;
        }
    }
};
