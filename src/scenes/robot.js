/* global Phaser */
import Constant from "../constants.js";
import { assetsDPR } from '../index.js';
import {getMapCoords} from "./util.js";
import Sprite from "../sprite.js";

const NOTHING = 0;
const THING = 1;
const GAS = 2;

const RETURNING = 0;
const RESTING = 1;
const GETGAS = 2;
const GOTGAS = 3;
const UPGRADE = 4;
const WAITING = 5;
const COLLECT = 6;
const COLLECTING = 7;

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
    [[665,540], [545,540], [425,540], [360,540], [360,360], [360,230], [295,230], [230,230], [165,230]],
    [[2,1], [1,1], [2,1]], // waiting, just bounce and try again
    [[2,1], [3,1], [2,1]], // bounce the other way for fun
             ];

export default class Robot {
    constructor (game) {
        this.game = game;
        this.state = RETURNING;
        this.path = 0;
        this.step = 0;
        this.dir = 1;
        this.moving = false;
        this.location = new Phaser.Geom.Point(0,0);
        this.carrying = NOTHING;

        var botCoords = getMapCoords(this.location);
        this.sprite  = new Sprite(this.game, botCoords.x+18, botCoords.y+72, "bigBackground", "flatbot/bot0empty").setOrigin(0,0);

        this.nextStep = new Phaser.Geom.Point(0,1);
        this.didTest = true;
    }

    act(world) { // we need to know the state of the world but should never update it here
                 // right now, we need to know if the bot arrives at the base and it is full
        var result = {
            affected: -1,
            affect: -1
        };
        if (!this.moving) {
            switch (this.state) {
                case COLLECT:
                    //console.log("Let's collect! " + this.target);
                    this.location = new Phaser.Geom.Point(4,2);
                    this.sprite.setFrame("flatbot/bot0empty").setOrigin(0,0);
                    this.sprite.setAlpha(1);
                    this.path = this.target;
                    this.step = 3;
                    this.dir = -1;
                    this.carrying = NOTHING;
                    this.state = COLLECTING;

                    result.affected = 4;
                    result.affect = Constant.DO_DISPATCH;
                    break;
                case RETURNING:
                case WAITING:
                case COLLECTING:
                    /* paths are hard
                    console.log(paths[this.path]);
                    console.log(this.step);
                    console.log(paths[this.path][this.step]);
                    console.log(dir);
                    console.log(paths[this.path][this.step + dir]);
                    */
                    // for all those states, move to the next spot in the path until path is completed
                    if (typeof paths[this.path][this.step + this.dir] != "undefined") {
                        console.log("go path");
                        this.nextStep.x = paths[this.path][this.step + this.dir][0];
                        this.nextStep.y = paths[this.path][this.step + this.dir][1];

                        this.next = getMapCoords(this.nextStep);
                        this.moving = true;
                        this.step += this.dir;
                        this.game.tweens.add({ targets: [this.sprite],
                            duration:500, //500
                            x:(this.next.x+18)*assetsDPR,
                            y:(this.next.y+72)*assetsDPR,
                            callbackScope: this,
                            onComplete: function() {
                                this.moving = false;
                            }
                        });
                    } else { // the bot is at the end of path, what's next?
                       if (this.state == COLLECTING) {
                           // made it to the generator and got the thing, take it back to the base
                           this.state = RETURNING;
                           this.carrying = THING;
                           this.sprite.setFrame("flatbot/bot1thing").setOrigin(0,0);
                           this.dir = 1;

                           result.affected = this.target;
                           result.affect = Constant.DO_TAKESTUFF;
                       } else {
                           // at the base, either store the thing and rest, or if it is full bounce and try again
                           if (this.carrying == THING) {
                               if (world[4].fuelBay[0] == 10 && world[4].fuelBay[1] == 10 && world[4].fuelBay[2] == 10) {
                                   console.log("base full!");
                                   this.state = WAITING;
                                   if (this.path == 13)
                                      this.path=12;
                                   else
                                      this.path = 13;
                                   this.step = 0;
                                   this.dir = 1;
                               } else {
                                   this.state = RESTING;
                                   this.sprite.setAlpha(0);
                                   result.affected = 4;
                                   result.affect = Constant.DO_PUTSTUFF;
                               }
                           } else {
                               // We can just rest. Tell the base we've arrived, with or without a thing.
                               this.state = RESTING;
                               this.sprite.setAlpha(0);

                               result.affected = 4;
                               result.affect = Constant.DO_RESTBOT;
                           }
                       }
                    }
                    break;
               case RESTING:
                    //nothing to do right now, except get more rest
                    break;
            }
        }
        return result;
    }

    isResting() {
        return this.state == RESTING;
    }
    getThing(generator) {
        this.state = COLLECT;
        this.target = generator;
    }
}