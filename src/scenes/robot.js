/* global Phaser */
import Constant from "../constants.js";
import {getLocationX, getLocationY, getMapCoords} from "./util.js";

const NOTHING = 0;
const THING = 1;
const GAS = 2;

const RETURNING = 0;
const RESTING = 1;
const GETGAS = 2;
const GOTGAS = 3;
const UPGRADE = 4;

const paths = [
    [[35,100], [100,100], [100,230], [165,230]],
    [[165,100], [100,100], [100,230], [165,230]],
    [[295,100], [230,100], [230,230], [165,230]],
    [[35,230], [100,230], [165,230]],
    [[230,230]], // path #4 makes no sense, already there
    [[295,230], [230,230], [165,230]],
    [[35,360], [100,360], [100,230], [165,230]],
    [[165,360], [230,360], [230,230], [165,230]],
    [[295,360], [230,360], [230,230], [165,230]],
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
        this.sprite = this.game.add.sprite(botCoords.x, botCoords.y, "robot", 0).setOrigin(0,0);
        //this.sprite = this.game.add.sprite(35,100, "robot", 0).setOrigin(0,0);

        this.didTest = false;
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
                    var next = paths[this.path][this.step + dir];
                    if (typeof next != "undefined") {
                        //console.log("next:" + next[0] + "," + next[1]);
                        this.moving = true;
                        this.step += dir;
                        this.game.tweens.add({
                            targets: [this.sprite],
                            duration: 400,
                            x:next[0],
                            y:next[1],
                            callbackScope: this,
                            onComplete: function() {
                                this.moving = false;
                                //alert("moved");
                            }
                        });
                    } else {
                       //this.game.add.text(0, 420, "THERE NOW");
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