var Play = function (game) {

    this.SCROLLING_SPEED_GRASS = 5;

    this.OBSTACLE_VELOCITY = 300;
    this.OBSTACLE_MAX_VELOCITY = 500;
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
        game.load.script("endLevelScore", "js/prefabs/obstacle.js");

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
        game.time.events.loop(Phaser.Timer.SECOND * 2, this.createObstacle, this);

        this.previousObstacleIndex = 0;
        this.obstacles = game.add.group();

        console.log("State: Play");
    },
    update: function () {
        this.grassBg.tilePosition.y += this.SCROLLING_SPEED_GRASS;
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