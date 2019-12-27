/* global Phaser */
import Constant from "../constants.js";
import { assetsDPR } from '../index.js';
import {getMapCoords, getSpotAtLocation} from "../util.js";
import Sprite from "../sprite.js";

export default class Human {
    constructor (game, start) {
        this.game = game;
        this.location = start;
        this.moving = false;
        this.moveBuffer = -1;
        this.carrying = Constant.NOTHING;

        this.sprite  = new Sprite(this.game, getMapCoords(start).x+18, getMapCoords(start).y+72, "bigBackground", "flatman/man0empty").setOrigin(0,0);

        this.speed = Phaser.Math.GetSpeed(500, 1);  // 500 pixels/second is good
        this.stepPx = new Phaser.Geom.Point(0,0);
        this.vector = new Phaser.Geom.Point(0,0);
    }

    isMoving() {
        return this.moving;
    }
    setBuffer(move) {
        this.moveBuffer = move;
    }
    getBuffer() {
        return this.moveBuffer;
    }
    clearBuffer() {
        this.moveBuffer = -1;
    }
    getLocation() {//TODO: Unnecessary?
        return this.location;
    }

    //TODO: THESE ARE TOO GENERAL!!!!!!!
    isCarrying() {
        return this.carrying;
    }
    hasNothing() {
        return this.carrying == Constant.NOTHING;
    }
    hasThing() {
        return this.carrying == Constant.THING;
    }
    hasGas() {
        return this.carrying == Constant.GAS;
    }

    //TODO: these are better!!!!!!!!!!!
    nowHasThing() {
        this.carrying = Constant.THING;
        this.sprite.setFrame("flatman/man1thing").setOrigin(0,0);
    }
    nowHasNothing() {
        this.carrying = Constant.NOTHING;
        this.sprite.setFrame("flatman/man0empty").setOrigin(0,0);
    }
    isNowCarrying(inHandNow) {
        this.carrying = inHandNow;
        switch (this.carrying) {
            case Constant.NOTHING:
              this.sprite.setFrame("flatman/man0empty").setOrigin(0,0);
              break;
            case Constant.THING:
              this.sprite.setFrame("flatman/man1thing").setOrigin(0,0);
              break;
            case Constant.GAS:
              this.sprite.setFrame("flatman/man2gas").setOrigin(0,0);
              break;
        }
    }
    tryMove() {
        var oldLocX = this.location.x; // copying just these 2 attributes only... love JS
        var oldLocY = this.location.y;

        // Move in the requested direction, but don't move vertically if starting from a spot
        var manAt = getSpotAtLocation(this.location);//TODO: here's the location to fall back to!!
        switch (this.moveBuffer) {
            case Constant.LEFT:
                this.location.x--;
                break;
            case Constant.RIGHT:
                this.location.x++;
                break;
            case Constant.UP:
                this.location.y--;
                if (manAt !== null)
                   this.location.y = -1;
                break;
            case Constant.DOWN:
                this.location.y++;
                if (manAt !== null) {
                   this.location.y = -1;
                }
                break;
            default:
                throw ("impossible man! " + this.moveBuffer); //today only INTERACT and we won't be here for that
        }
        //console.log(`man goes to ${this.location.x},${this.location.y}`);
        var nextPx = getMapCoords(this.location);
        if (!nextPx) { // moved off the edge or through a building or whatever
            //console.log("psyche");
            this.location.x = oldLocX;
            this.location.y = oldLocY;
            return;
        }
        this.moving = true;

        //console.log(nextPx);
        this.vector.x = 0; this.vector.y = 0;
        this.stepPx.x = (nextPx.x+18)*assetsDPR;
        this.stepPx.y = (nextPx.y+72)*assetsDPR;
        if (this.sprite.x < this.stepPx.x)
            this.vector.x = 1;
        if (this.sprite.x > this.stepPx.x)
            this.vector.x = -1;
        if (this.sprite.y < this.stepPx.y)
            this.vector.y = 1;
        if (this.sprite.y > this.stepPx.y)
            this.vector.y = -1;
    }

    doMove(loopCount, delta) {
        if (loopCount < 7) {
            //console.log(`SPRITE ${this.sprite.x},${this.sprite.y}`);
            //console.log(`step ${this.stepPx.x},${this.stepPx.y}`);
            //console.log(`delta ${delta} movePixels ${this.speed*delta} newX ${this.sprite.x + this.speed*delta}`);
        }
        if ((this.vector.x > 0 && this.sprite.x < this.stepPx.x) ||
            (this.vector.x < 0 && this.sprite.x > this.stepPx.x) ||
            (this.vector.y > 0 && this.sprite.y < this.stepPx.y) ||
            (this.vector.y < 0 && this.sprite.y > this.stepPx.y)) {

            this.sprite.x += this.speed * delta * this.vector.x;
            this.sprite.y += this.speed * delta * this.vector.y;
        }
        else {
            this.sprite.x = this.stepPx.x; this.sprite.y = this.stepPx.y;
            this.moving = false;
        }
            /*
        this.game.tweens.add({
            targets: [this.sprite],
            duration: 300,
            x:(this.newCoords.x+18)*assetsDPR,
            y:(this.newCoords.y+72)*assetsDPR,
            callbackScope: this,
            onComplete: function() {
                this.moving = false;
            }
        });
            */

    }
}