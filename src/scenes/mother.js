export default class Mother {

    constructor (game) {
        this.game = game;
        this.moving = true;
        this.sprite = this.game.add.sprite(900, 0, "mother", 0).setOrigin(0,0);
        this.sprite.on('animationcomplete', this.sheDead, this);
        this.game.tweens.add({
            targets: [this.sprite],
            duration: 3000, //3000
            x:525,
            callbackScope: this,
            onComplete: function() {
                this.moving = false;
                //alert("moved");
            }
        });
        this.alive = true;
    }

    isMoving() {
        return this.moving;
    }

    die() {
        //console.log("like tears in the rain");
        this.alive = false;
        this.game.anims.create({
                  key: "SheDead",
                      frames: this.game.anims.generateFrameNames("mother", {start:0,end:10}),
                      frameRate: 10,
                      repeat: 0
                  });
        this.sprite.play("SheDead");
    }

    isAlive() {
        return this.alive;
    }

    sheDead(animation, frame) {
        this.sprite.setAlpha(0);
    }

}