import {assetsDPR} from '../index.js';
import Sprite from "../sprite.js";

export default class Bomb {

    constructor (game, shields, homeBlock, testBombCount, camera) {
        this.game = game;
        this.camera = camera;
        this.moving = true;

        // yet another flag, this one needs 0=active 1=exploded 2=winner
        this.status = 0;


        this.shields = shields;
        this.block = this.shields.getBlock();
        this.homeBlock = homeBlock;
        this.testBombCount = testBombCount;
        //console.log("bomb# " + this.testBombCount);

        //this.sprite = this.game.physics.add.sprite(500*assetsDPR, 80*assetsDPR, "bigBackground", "bomb/0", 0);
        this.sprite = this.game.physics.add.sprite(500*assetsDPR, 280*assetsDPR, "bigBackground", "bomb/0", 0);

        //this.sprite.setBounce(0.2);
        //this.sprite.setAcceleration(5*this.testBombCount,50);
        this.sprite.setAcceleration(25,800);
        this.sprite.setCollideWorldBounds(true);

        if (!this.block) {
            console.log("oh shit");
        } else {
            console.log("shields up");
            this.game.physics.add.overlap(this.sprite, this.block, this.absorbed, null, this);
        }
        this.game.physics.add.overlap(this.sprite, this.homeBlock, this.boom, null, this);
/*
                    this.hitRect = new Phaser.Geom.Rectangle(318*assetsDPR,310*assetsDPR,270*assetsDPR,20*assetsDPR);
                    this.testRect = this.game.add.graphics({
                      x:0,
                      y:0
                    });
                    this.testRect.lineStyle(5,0x00ff00);
                    this.testRect.strokeRectShape(this.hitRect);
                    this.testRect.closePath();
                    this.game.physics.add.existing(this.testRect, false);
*/

            this.game.physics.add.overlap(this.sprite, this.hitRect, this.absorbed, null, this);
    }

    isMoving() {
        return this.moving;
    }

    absorbed(sprite, block) {
        console.log("WHIFF");
        this.camera.shake(50,.02);
        sprite.disableBody(true,true);
        this.destroy(sprite);
    }
    // game over
    boom(sprite, block) {
        console.log("BOOM");
        sprite.disableBody(true,true);
        this.status = 2;
        var bombOut = {
            x: sprite.x,
            y: sprite.y
        };
        this.winSprite  = new Sprite(this.game, bombOut.x/assetsDPR, bombOut.y/assetsDPR, "bigBackground", "bomb/0");
    }
    destroy(sprite) {
        //console.log("SPLODED");
        var bombOut = {
            x: sprite.x,
            y: sprite.y
        };
        sprite.disableBody(true,true); // get rid of the physical one


        this.deadSprite  = new Sprite(this.game, bombOut.x/assetsDPR, bombOut.y/assetsDPR, "bigBackground", "bomb/0");

        this.deadSprite.on("animationcomplete", function () {
            //console.log("ZZZZZZZZZAP");
            this.deadSprite.setAlpha(0);
            this.shields.hit(); // seems a little late?
            this.status = 1;
        }, this);

        var frameNames = this.game.anims.generateFrameNames('bigBackground', {
                         start: 0, end: 4,
                         prefix: 'deadBomb/'
                     });
        this.game.anims.create({key:"bombOut", frames:frameNames, frameRate:12});

        this.deadSprite.play("bombOut");

    }
}