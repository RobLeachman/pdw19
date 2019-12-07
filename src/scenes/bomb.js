export default class Bomb {

    constructor (game, shields, homeBlock, testBombCount) {
        this.game = game;
        this.moving = true;
        this.shields = shields;
        this.block = this.shields.getBlock();
        this.homeBlock = homeBlock;
        this.testBombCount = testBombCount;
        //console.log("bomb# " + this.testBombCount);

        this.fakey = this.game.add.rectangle(400, 300, 330, 10, 0xff0000).setOrigin(0,0);
        this.fakey.setAlpha(0);
        this.game.physics.add.existing(this.fakey, true);

        this.sprite = this.game.physics.add.sprite(500, 60, "bomb", 0).setOrigin(0,0);

        //this.sprite.setBounce(0.2);
        //this.sprite.setAcceleration(5*this.testBombCount,50);
        this.sprite.setAcceleration(5*this.testBombCount,500);
        this.sprite.setCollideWorldBounds(true);

        //this.game.physics.add.collider(this.block, this.sprite);
        if (!this.block) {
                console.log("oh shit");
        } else {
            //console.log("shields up");
            this.game.physics.add.overlap(this.sprite, this.block, this.absorbed, null, this);
        }
        this.game.physics.add.overlap(this.sprite, this.homeBlock, this.boom, null, this);
        if (this.testBombCount > 0)
            this.game.physics.add.overlap(this.sprite, this.fakey, this.destroy, null, this);
    }

    isMoving() {
        return this.moving;
    }

    absorbed(sprite, block) {
        //console.log("WHIFF");
        sprite.disableBody(true,true);
    }
    boom(sprite, block) {
        //console.log("BOOM");
        sprite.disableBody(true,true);
    }
    destroy(sprite, block) {
        //console.log("SPLODED");
        var bombOut = {
            x: sprite.x,
            y: sprite.y
        }
        sprite.disableBody(true,true); // get rid of the physical one

        this.deadSprite = this.game.add.sprite(bombOut.x, bombOut.y, "bomb", 0).setOrigin(0,0);
        this.deadSprite.on("animationcomplete", function () {
            //console.log("ZZZZZZZZZAP");
            this.deadSprite.setAlpha(0);
           }, this);
        this.game.anims.create({
                  key: "bombOut",
                      frames: this.game.anims.generateFrameNames("bomb", {start:0,end:10}),
                      frameRate: 12,
                      repeat: 0
                  });
        this.deadSprite.play("bombOut");
    }
}