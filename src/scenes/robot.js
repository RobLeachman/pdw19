/* global Phaser */
import Constant from "../constants.js";
import { assetsDPR } from '../index.js';
import {getLocationX, getLocationY, getMapCoords, getSpotAtLocation} from "./util.js";
import Sprite from "../sprite.js";

const NOTHING = 0;
const THING = 1;
const GAS = 2;

const RETURNING = 0;
const RESTING = 1;
const GETGAS = 2;
const GOTGAS = 3;
const UPGRADE = 4;

const paths = [
    [[0,0], [1,0], [1,1], [2,1]],
    [[2,0], [3,0], [3,1], [2,1]],
    [[4,0], [3,0], [3,1], [2,1]],
    [[0,1], [1,1], [2,1]],
    [[2,1]], // path #4 makes no sense, already there
    [[4,1], [3,1], [2,1]],
    [[0,2], [1,2], [1,1], [2,1]],
    [[2,2], [2,3], [2,2], [2,1]],
    [[2,4], [2,3], [2,2], [2,1]],
    [[425,540], [360,540], [360,360], [360,230], [295,230], [230,230], [165,230]],
    [[545,540], [425,540], [360,540], [360,360], [360,230], [295,230], [230,230], [165,230]],
    [[665,540], [545,540], [425,540], [360,540], [360,360], [360,230], [295,230], [230,230], [165,230]]
             ];

export default class Robot {
    constructor (game) {
        this.game = game;
        this.state = RETURNING;
        this.path = 0;
        this.moving = false;
        this.location = new Phaser.Geom.Point(0,0);
        this.step = 0;
        this.carrying = NOTHING;

        var botCoords = getMapCoords(this.location);
        this.sprite  = new Sprite(this.game, botCoords.x+18, botCoords.y+72, "bigBackground", "flatbot/bot0empty").setOrigin(0,0);

        this.nextStep = new Phaser.Geom.Point(0,1);
        this.didTest = true;
    }

    act() {
        var result = {
            affected: -1,
            affect: -1
        };
        var dir = 1; //forward, up the list
        if (!this.moving) {
            switch (this.state) {
               case GETGAS:
               case UPGRADE:
                   dir = -1;
               case RETURNING:
               case GETGAS:
               case GOTGAS:
                    if (typeof paths[this.path][this.step + dir] != "undefined") {
                        this.nextStep.x = paths[this.path][this.step + dir][0];
                        this.nextStep.y = paths[this.path][this.step + dir][1];

                        this.next = getMapCoords(this.nextStep);
                        this.moving = true;
                        this.step += dir;
                        this.game.tweens.add({
                            targets: [this.sprite],
                            duration:100,
                            x:(this.next.x+18)*assetsDPR,
                            y:(this.next.y+72)*assetsDPR,
                            callbackScope: this,
                            onComplete: function() {
                                this.moving = false;
                            }
                        });
                    } else {
                       console.log("there now");
                       if (this.state == GETGAS) {
                           this.state = GOTGAS;
                           this.location = new Phaser.Geom.Point(4,2);
                           this.sprite.setFrame(2);
                       } else {
                           if (this.state == GOTGAS) {
                               if (!this.didTest) {
                                   //console.log("GOT GAS NOW UPGR");
                                   this.state = UPGRADE;
                                   this.path = 10;
                                   this.step = paths[this.path].length - 1;

                                   this.sprite.setAlpha(1);
                               } else {
                                   //just quit
                                   this.state = 99;
                                   this.sprite.setAlpha(0);
                                   result.affected = 4;
                                   result.affect = Constant.DO_RESTBOT;
                               }
                           } else if (this.state == UPGRADE) {
                               result.affected = 10;
                               result.affect = Constant.DO_UPGRADE;

                               this.sprite.setFrame(0);
                               this.state = RETURNING;
                               this.step = 0;
                               this.didTest = true;
                           } else {
                               console.log("let's rest");
                               this.state = RESTING;
                               this.sprite.setAlpha(0);
                               result.affected = 4;
                               result.affect = Constant.DO_RESTBOT;
                           }
                       }
                    }
                    break;
               case RESTING:
                    if (!this.didTest) {
                        this.path = 8;
                        this.step = paths[this.path].length - 1;

                        this.location = new Phaser.Geom.Point(2,1);
                        result.affected = 4;
                        result.affect = Constant.DO_TAKESTUFF;
                        this.sprite.setFrame(1);
                        this.sprite.setAlpha(1);
                        this.state = GETGAS;
                        break;
                    }
            }

        }
        return result;
    }
}