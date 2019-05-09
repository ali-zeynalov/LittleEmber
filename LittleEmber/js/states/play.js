var Play = function (game) {

    this.SCROLLING_SPEED_GRASS = 5;

    this.OBSTACLE_VELOCITY = 300;
    this.OBSTACLE_MAX_VELOCITY = 500;
    this.PLAYER_MAX_VELOCITY = 300;
};

Play.prototype = {
    init: function (LEVELS, level) {
        // Initialize incoming variables
        this.LEVELS = LEVELS;
        this.level = level;
    },
    preload: function () {
        // Load scripts
        game.load.script("transition", "js/states/transition.js");
        game.load.script("endLevelScore", "js/prefabs/endLevelScore.js");
        game.load.script("GameOver", "js/states/gameOver.js");

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
        game.time.events.loop(Phaser.Timer.SECOND * 2, this.createObstacle, this);this.previousObstacleIndex = 0;
        this.obstacles = game.add.group();
        console.log("State: Play");

        // make player character
        this.player = game.add.sprite(game.world.width/2, game.world.height - 50, "littleEmber"); // for atlas: (x, y, nameOfAtlas, assetNameInAtlas)
        // player.animations.add('fly', ["kiwi_0000", "kiwi_0001", "kiwi_0002", "kiwi_0003"], 4, true);
        // uncomment if we need to resize
		// player.scale.x = 0.2;
		// player.scale.y = 0.2;
		this.player.scale.setTo(0.5, 0.5);
		this.player.anchor.set(0.5); // center the mass of player character
		// player physics
		game.physics.enable(this.player, Phaser.Physics.ARCADE);
		this.player.body.maxVelocity.set(this.PLAYER_MAX_VELOCITY);
		this.player.body.drag.set(700);
		this.player.body.collideWorldBounds = true;
        // player.body.immovable = true;
        // player.body.gravity.y = 300;
    },
    update: function () {
        this.grassBg.tilePosition.y += this.SCROLLING_SPEED_GRASS;
        // allow the player to exit game to GameOver state by pressing Q
        if(game.input.keyboard.isDown(Phaser.Keyboard.Q)) {
            game.state.add("GameOver", GameOver);
			game.state.start("GameOver");
        }

        // add player input checks
        // since they're not in else ifs, we should be able to get combinatorial movement
        // these combo movements are not as fast as they should technically be, so might add
        // euclidian combinatorial directionns instead
        if(game.input.keyboard.isDown(Phaser.Keyboard.W)) {
            this.player.body.velocity.y -= 75;
        }
        if (game.input.keyboard.isDown(Phaser.Keyboard.S)) {
			this.player.body.velocity.y += 75;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.A)) {
            this.player.body.velocity.x -= 75;
        }
        if(game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            this.player.body.velocity.x += 75;
        }
        // if stuff isn't being held down to move, slow to a stop
        if(!game.input.keyboard.isDown(Phaser.Keyboard.W) && !game.input.keyboard.isDown(Phaser.Keyboard.S)) {
            if(this.player.body.velocity.y > 300) { // if we were going down
            this.player.body.velocity.y -= 15;
            }
            else if(this.player.body.velocity.y < 300) { // if we were going up
                this.player.body.velocity.y += 30;
            }
        }
        if(!game.input.keyboard.isDown(Phaser.Keyboard.A) && !game.input.keyboard.isDown(Phaser.Keyboard.D)) {
            if(this.player.body.velocity.x > 0) { // if we were going down
                this.player.body.velocity.x -= 15;
            }
            else if(this.player.body.velocity.x < 0) { // if we were going up
                this.player.body.velocity.x += 15;
            }
        }
    },
    createObstacle: function () {
        // Creating the obstacle
        do {
            var obstacleIndex = game.rnd.integerInRange(0, this.LEVELS[this.level].obstacles.length - 1);
        } while (obstacleIndex == this.previousObstacleIndex);

        this.previousObstacleIndex = obstacleIndex;

        var x = game.rnd.integerInRange(0, game.world.width);
        var y = -20;
        var direction = Math.floor(game.rnd.pick([-1, 1]));
        var xVelocity = 0;
        var yVelocity = this.OBSTACLE_VELOCITY;
        var maxVelocity = this.OBSTACLE_MAX_VELOCITY;

        this.obstacle = new Obstacle(game, x, y, direction, this.LEVELS[this.level].obstacles[obstacleIndex], xVelocity, yVelocity, maxVelocity);
        game.add.existing(this.obstacle);

        /***
         * TODO: adding it to the group which later on used for collision detection
         */
        this.obstacles.add(this.obstacle);
    }
};