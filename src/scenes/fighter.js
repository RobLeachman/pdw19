/* global Phaser */
import {getLocationX, getLocationY} from "./util.js";
//import { assetsDPR, WIDTH, HEIGHT } from '../index.js';
import Sprite from "../sprite.js";

export default class Fighter {

    constructor (game) {
        this.game = game;
/* new animation - works!
        var fighterDead = new Sprite(this.game, 500,75, "bigBackground", "fighter/fighter0");
        var frameNames = this.game.anims.generateFrameNames('bigBackground', {
                         start: 1, end: 8,
                         prefix: 'fighter/fighter'
                     });
        //console.log(frameNames);
        this.game.anims.create({key:'deadFighter', frames:frameNames, frameRate:4});
        fighterDead.anims.play('deadFighter');
        */


/*
        this.moving = true;
        this.sprite = this.game.add.sprite(550, 25, "fighter", 0).setOrigin(0,0);
        this.sprite.on('animationcomplete', this.itDead, this);
        this.game.tweens.add({
            targets: [this.sprite],
            duration: 1000,
            x:500,
            y:40,
            callbackScope: this,
            onComplete: function() {
                this.moving = false;
                //alert("moved");
            }
        });
        this.alive = true;
*/
    }

    isMoving() {
        return this.moving;
    }

    isAlive() {
        return this.alive;
    }

    die() {
        this.alive = false;
        this.game.anims.create({
                  key: "ItDead",
                      frames: this.game.anims.generateFrameNames("fighter", {start:0,end:8}),
                      frameRate: 10,
                      repeat: 0
                  });
        this.sprite.play("ItDead");
    }

    itDead(animation, frame) {
        this.sprite.setAlpha(0);
    }
}