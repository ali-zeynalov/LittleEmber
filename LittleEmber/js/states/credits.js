/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */
/***
 * CREDITS
 *
 * Menu credits:
 * "Ambience, Florida Frogs Gathering, A.wav" by InspectorJ (www.jshaw.co.uk) of Freesound.org
 * Woodpeckers » Green Woodpecker.wav by Benbocan
 * Somewhere Between Happy And Sad by TheMajorxty from looperman.com
 * "Gas Fire.wav" by fogma from freesound.org
 *
 * lvl 2 sounds:
 * 20061105Furnace.wav by daveincamas. https://freesound.org/people/daveincamas/sounds/25034/
 * Electricity by PureAudioNinja. https://freesound.org/people/PureAudioNinja/sounds/341609/
 * "Crowd Screaming, A.wav" by InspectorJ (www.jshaw.co.uk) of Freesound.org
 * Bus horn long.wav, by arundasstp. https://freesound.org/people/arundasstp/sounds/403981/
 * Jingle_Lose_00.wav by LittleRobotSoundFactory. https://freesound.org/people/LittleRobotSoundFactory/sounds/270467/
 * Helicopter Engine by caquet, https://freesound.org/people/caquet/sounds/432169/
 *
 * Other:
 * flameSizzle: Steam water on hot plate.aif, by KBarbie. https://freesound.org/people/KBarbie/sounds/118952/
 * lvl3 grunge almost drums heavy back opening plluck
 * lvl 3 music- Trava U Doma, Song by Zemlyane
 * heavy back- https://www.looperman.com/loops/detail/163287/minor2go-type-guitar-the-forbidden-doors-130bpm-heavy-metal-electric-guitar-loop
 * opening pluck- https://www.looperman.com/loops/detail/160281/dark-guitar-riff-130bpm-heavy-metal-electric-guitar-loop
 * almost drums- https://www.looperman.com/loops/detail/135798/heavy-metal-guitar-150-bpm-150bpm-heavy-metal-electric-guitar-loop
 * grunge- https://www.looperman.com/loops/detail/88612/graveyard-bass-groove-b-72-bpm-by-phatkatz4-free-72bpm-heavy-metal-bass-guitar-loop;
 *
 */
var Credits = function (game) {
};
Credits.prototype = {

    create: function () {
        // Background image
        this.backgroundImage = game.add.sprite(0, 0, "mainMenuBackground");

        // Credits title
        this.titleText = game.add.text(game.world.width / 2, game.world.height / 8, "Credits", {
            font: "Comic Sans MS",
            fontSize: "60px",
            fill: "#faba45"
        });
        this.titleText.anchor.set(0.5);
        this.titleText.setShadow(3, 3, 'rgba(0,0,0,0.7)', 0);

        var textStyle = {
            font: "Comic Sans MS",
            fontSize: "28px",
            fill: "#fa8b1d",
            align: "center",
            wordWrap: true,
            wordWrapWidth: 580
        };
        // Main text with credits
        this.madeBy = game.add.text(game.world.centerX, game.world.height / 5, "", textStyle);
        this.madeBy.anchor.set(0.5, 0);
        this.madeBy.setShadow(3, 3, 'rgba(0,0,0,0.7)', 0);

        this.madeBy.text = "Made by:\nAli Zeynalov\nKeren Franco\nWilliam Taylor\n\n" +
            "Menu credits:\n\"Ambience, Florida Frogs Gathering, A.wav\" by InspectorJ (www.jshaw.co.uk) of Freesound.org\n" +
            " Woodpeckers » Green Woodpecker.wav by Benbocan\n" +
            "Somewhere Between Happy And Sad by TheMajorxty from looperman.com\n" +
            "\"Gas Fire.wav\" by fogma from freesound.org\n\n" +
            "lvl 2 sounds:\n" +
            "20061105Furnace.wav by daveincamas. from freesound.org\n" +
            "Electricity by PureAudioNinja. from freesound.org\n" +
            "\"Crowd Screaming, A.wav\" by InspectorJ (www.jshaw.co.uk) of Freesound.org\n" +
            "Bus horn long.wav, by arundasstp. from freesound.org\n" +
            "Jingle_Lose_00.wav by LittleRobotSoundFactory. from freesound.org\n" +
            "Helicopter Engine by caquet, from freesound.org\n\n" +
            "Other:\n" +
            "flameSizzle: Steam water on hot plate.aif, by KBarbie. from freesound.org\n" +
            "lvl3 grunge almost drums heavy back opening plluck\n" +
            "lvl3 music- Trava U Doma, Song by Zemlyane\n" +
            "heavy back- from looperman.com\n" +
            "opening pluck- from looperman.com\n" +
            "almost drums- from looperman.com\n" +
            "grunge- from looperman.com";

        // Add arcade physics to text and give velocity
        game.physics.enable(this.madeBy, Phaser.Physics.ARCADE);
        game.physics.enable(this.titleText, Phaser.Physics.ARCADE);
        this.madeBy.body.velocity.y = -30;
        this.titleText.body.velocity.y = -30;

        this.difference = Math.abs(this.madeBy.y - this.titleText.y);
    },
    update: function () {
        // Wrap the text when text is off the screen
        if (this.madeBy.y < 0 - this.madeBy.height) {
            this.titleText.y = game.world.height + this.titleText.height / 2;
            this.madeBy.y = game.world.height + this.difference + this.titleText.height / 2;
        }
        // If these buttons are pressed then go back to main menu
        if (game.input.keyboard.justPressed(Phaser.Keyboard.ESC) || game.input.keyboard.justPressed(Phaser.Keyboard.ENTER)
            || game.input.keyboard.justPressed(Phaser.Keyboard.W) || game.input.keyboard.justPressed(Phaser.Keyboard.A) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.S) || game.input.keyboard.justPressed(Phaser.Keyboard.D) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.UP) || game.input.keyboard.justPressed(Phaser.Keyboard.DOWN) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.LEFT) || game.input.keyboard.justPressed(Phaser.Keyboard.RIGHT) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.SPACEBAR) || game.input.keyboard.justPressed(Phaser.Keyboard.Q) ||
            game.input.keyboard.justPressed(Phaser.Keyboard.E)) {
            game.state.start("MainMenu", true, false, false);
        }
    }
};
