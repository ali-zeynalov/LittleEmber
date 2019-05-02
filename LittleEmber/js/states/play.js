var Play = function (game) {

    this.SCROLLING_SPEED_GRASS = 5;

    this.OBSTACLE_VELOCITY = 300;
    this.OBSTACLE_MAX_VELOCITY = 500;
};

Play.prototype = {
    preload: function () {
        // Load scripts
        game.load.script("transition", "js/states/transition.js");
        game.load.script("endLevelScore", "js/prefabs/endLevelScore.js");
    },
    create: function () {
        // Arcade physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Scrolling background
        this.grassBg = game.add.tileSprite(0, 0, 600, 800, "grassBackground");

        // Group that holds all of the obstacles
        this.obstacles = game.add.group();

        // Every time spawns obstacles
        game.time.events.loop(Phaser.Timer.SECOND, this.createObstacle, this);

        console.log("State: Play");
    },
    update: function () {
        this.grassBg.tilePosition.y += this.SCROLLING_SPEED_GRASS;
    },
    // TODO: Should be its own prefab
    createObstacle: function () {
        var randomObstacle = game.rnd.pick(["bush", "flowers", "branches"]);
        var x = game.rnd.integerInRange(0, game.world.width);
        var y = -20;
        var direction = Math.floor(game.rnd.pick([-1, 1]));

        var obstacle = game.add.sprite(x, y, randomObstacle);
        game.physics.arcade.enable(obstacle);
        obstacle.scale.x = direction;
        obstacle.anchor.set(0.5);

        if (obstacle.x + obstacle.body.width / 2 > game.world.width) {
            obstacle.x = game.world.width - obstacle.body.width / 2;
        }
        if (obstacle.x - obstacle.body.width / 2 < 0) {
            obstacle.x = obstacle.body.width / 2;
        }

        obstacle.body.maxVelocity.y = this.OBSTACLE_MAX_VELOCITY;
        obstacle.body.velocity.y = this.OBSTACLE_VELOCITY;

        obstacle.events.onOutOfBounds.add(this.destroyObstacle, this);

        this.obstacles.add(obstacle);

    },
    destroyObstacle: function (obstacle, pointer) {
        if (obstacle.y > game.world.height + obstacle.body.height) {
            obstacle.destroy();
        }
    }
};