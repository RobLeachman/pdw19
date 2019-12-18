import { assetsDPR } from '../index.js';
import Sprite from '../sprite.js';

export default class Mother {

    constructor (game) {
        this.game = game;
        this.moving = true;
        this.alive = true;

        this.sprite = new Sprite(this.game, 650, 7, "bigBackground", "mother/0");
        this.sprite.on('animationcomplete', this.sheDead, this);
        this.game.tweens.add({
            targets: [this.sprite],
            duration: 3000, //3000
            x:450*assetsDPR,
            callbackScope: this,
            onComplete: function() {
                this.moving = false;
            }
        });

        var testPix = this.game.add.graphics({
            x:0,
            y:0
        });
        testPix.lineStyle(5,0x808080);
        testPix.strokeRect(620*assetsDPR,300*assetsDPR,40,240);
        testPix.closePath();

    }

    isMoving() {
        return this.moving;
    }

    die() {
        this.alive = false;
        var frameNames = this.game.anims.generateFrameNames('bigBackground', {
                         start: 1, end: 12,
                         prefix: 'mother/'
                     });
        this.game.anims.create({key:"deadMother", frames:frameNames, frameRate:12});
        this.sprite.anims.play("deadMother");
    }

    isAlive() {
        return this.alive;
    }

    sheDead(animation, frame) {
        this.sprite.setAlpha(0);
    }

}