/***
 * Project: Little Ember
 * Collaborators: Ali Zeynalov, William Taylor, Keren Franco
 *
 *GitHub Repository: https://github.com/ali-zeynalov/LittleEmber
 */

function Smoke(game, xPosition, yPosition, playerScale) {
    Phaser.Sprite.call(this, game, xPosition, yPosition, "atlas", "smoke_01");
    this.anchor.set(0.5);
    this.scale.setTo(playerScale + 0.5);

    this.animations.add("smoking", ["smoke_01", "smoke_02", "smoke_03"], 15, false);
    this.animations.add("idle", ["smoke_01"], 15, false);
    this.animations.play("smoking");
}

Smoke.prototype = Object.create(Phaser.Sprite.prototype);
Smoke.prototype.constructor = Smoke;

Smoke.prototype.destroySmoke = function () {
    this.destroy();
};

Smoke.prototype.update = function () {
    // Destroy object if outside of the game bounds
    this.animations.currentAnim.onComplete.add(this.destroySmoke, this);
};
