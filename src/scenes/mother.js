import { assetsDPR } from '../index.js';
import Sprite from '../sprite.js';

export default class Mother {

    constructor (game) {
        this.game = game;
        this.moving = true;
        this.alive = true;
        this.testLife = 50;
        this.testDying = false;

        this.sprite = new Sprite(this.game, 650, 7, "bigBackground", "mother/0");
        this.sprite.on('animationcomplete', this.sheDead, this);
        this.game.tweens.add({
            targets: [this.sprite],
            duration: 30, //3000
            x:450*assetsDPR,
            callbackScope: this,
            onComplete: function() {
                this.moving = false;
            }
        });

        var frameNames = this.game.anims.generateFrameNames('bigBackground', {
                         start: 1, end: 12,
                         prefix: 'mother/'
                     });
        this.game.anims.create({key:"deadMother", frames:frameNames, frameRate:33});

        var healthBar = this.game.add.graphics({
            x:0,
            y:0
        });
        healthBar.lineStyle(5,0x808080);
        healthBar.strokeRect(620*assetsDPR,300*assetsDPR,40,240);
        healthBar.closePath();

    }

    isMoving() {
        return this.moving;
    }

    getShot() {
        this.testLife--;
        if (this.testLife <0) {
           this.die();
        }
        return this.testLife;
    }

    die() {
        if (!this.testDying) {
            this.alive = false;
            this.sprite.anims.play("deadMother");
            this.testDying = true;
        }
    }

    isAlive() {
        return this.alive;
    }

    sheDead(animation, frame) {
        //console.log("she gone");
        this.sprite.setAlpha(0);
    }

}