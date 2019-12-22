import {assetsDPR} from '../index.js';
import Sprite from "../sprite.js";

export default class Fighter {

    constructor (game) {
        this.game = game;
        var frameNames = this.game.anims.generateFrameNames('bigBackground', {
                         start: 1, end: 8,
                         prefix: 'fighter/fighter'
                     });
        this.game.anims.create({key:'deadFighter', frames:frameNames, frameRate:20});

        this.alive = true;
        this.testLife = 50;
        this.testDying = false;

        this.moving = true;
        this.sprite = new Sprite(this.game, 480,40, "bigBackground", "fighter/fighter0");
        this.sprite.on('animationcomplete', this.itDead, this);
        this.game.tweens.add({
            targets: [this.sprite],
            duration: 1000,
            x:500*assetsDPR,
            y:80*assetsDPR,
            callbackScope: this,
            onComplete: function() {
                this.moving = false;
            }
        });
    }

    isMoving() {
        return this.moving;
    }

    isAlive() {
        return this.alive;
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
            this.sprite.anims.play('deadFighter');
            this.testDying = true;
        }
    }

    itDead(animation, frame) {
        this.sprite.setAlpha(0);
    }
}