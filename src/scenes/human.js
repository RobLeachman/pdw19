import Constant from "../constants.js";
import { assetsDPR } from '../index.js';
import {getMapCoords, getSpotAtLocation} from "./util.js";
import Sprite from "../sprite.js";

export default class Human {
    constructor (game, start) {
        this.game = game;
        this.location = start;
        this.moving = false;
        this.moveBuffer = -1;
        this.carrying = Constant.NOTHING;

        this.sprite  = new Sprite(this.game, getMapCoords(start).x+18, getMapCoords(start).y+72, "bigBackground", "flatman/man0empty").setOrigin(0,0);
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
                throw ("impossible! " + this.moveBuffer); //today only INTERACT and we won't be here for that
        }
        var newCoords = getMapCoords(this.location);
        if (!newCoords) { // moved off the edge or through a building or whatever
            this.location.x = oldLocX;
            this.location.y = oldLocY;
            return;
        }
        this.moving = true;
        this.game.tweens.add({
            targets: [this.sprite],
            duration: 300,
            x:(newCoords.x+18)*assetsDPR,
            y:(newCoords.y+72)*assetsDPR,
            callbackScope: this,
            onComplete: function() {
                this.moving = false;
            }
        });
    }
}