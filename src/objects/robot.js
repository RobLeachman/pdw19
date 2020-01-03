/* global Phaser */
import Constant from "../constants.js";
import { assetsDPR } from '../index.js';
import {getMapCoords} from "../util.js";
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
const TESTING = 8; // test.js will instantiate and set this

const paths = [
    [[0,0], [1,0], [1,1], [2,1]],
    [[2,0], [3,0], [3,1], [2,1]],
    [[4,0], [3,0], [3,1], [2,1]],
    [[0,1], [1,1], [2,1]],
    [[2,1]], // path #4 makes no sense, already there
    [[4,1], [3,1], [2,1]],
    [[0,2], [1,2], [1,1], [2,1]],
    [[2,2], [3,2], [3,1], [2,1]],
    [[4,2], [3,2], [2,2], [2,1]],
    [[6,3], [5,3], [5,2], [5,1], [4,1], [3,1], [2,1]],
    [[7,3], [6,3], [5,3], [5,2], [5,1], [4,1], [3,1], [2,1]],
    [[8,3], [7,3], [6,3], [5,3], [5,2], [5,1], [4,1], [3,1], [2,1]],
    [[2,1], [1,1], [2,1]], // waiting, just bounce and try again
    [[2,1], [3,1], [2,1]], // bounce the other way for fun

    [[8,3], [7,3], [6,3]], // TEST
    [[0,2], [1,2], [2,2], [3,2], [4,2], [5,2]], // TEST
    [[1,0], [5,0]], // TEST
    [[1,0], [1,2], [5,2], [5,0], [1,0]], // TEST
             ];

export default class Robot {
    constructor (game, startX=0, startY=0) {
        this.game = game;
        this.state = RETURNING;
        this.path = 0;
        this.step = 0;
        this.dir = 1;
        this.moving = false;
        this.location = new Phaser.Geom.Point(startX,startY);
        this.carrying = NOTHING;

        var botCoords = getMapCoords(this.location);
        this.sprite  = new Sprite(this.game, botCoords.x+18, botCoords.y+72, "bigBackground", "flatbot/bot0empty").setOrigin(0,0);
        //console.log(`init spot ${this.sprite.x},${this.sprite.y}`);

        this.nextStep = new Phaser.Geom.Point(0,1);

        this.speed = Phaser.Math.GetSpeed(500, 1);  // 500 pixels/second is good
        this.stepPx = new Phaser.Geom.Point(0,0);
        this.vector = new Phaser.Geom.Point(0,0);

        this.testLoopCount=0; // for loop timer in test.js
    }

    initStep() {
        this.nextStep.x = paths[this.path][this.step][0];
        this.nextStep.y = paths[this.path][this.step][1];
        var nextPx = getMapCoords(this.nextStep);
        this.stepPx.x = (nextPx.x+18)*assetsDPR;
        this.stepPx.y = (nextPx.y+72)*assetsDPR;
        //this.vector.x = 1;
    }

    act(world, loopCount, delta, testLoops) { // we need to know the state of the world but should never update it here
                 // right now, we need to know if the bot arrives at the base and it is full
        var result = {
            affected: -1,
            affect: -1,
            idle: true
        };
        if (this.moving) {
            /*
            if (loopCount < 7) {
                console.log(`SPRITE ${this.sprite.x},${this.sprite.y}`);
                console.log(`step ${this.stepPx.x},${this.stepPx.y}`);
                console.log(`delta ${delta} movePixels ${this.speed*delta} newX ${this.sprite.x + this.speed*delta}`);
            }
            */
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
            result.idle = false;
            return result;
        }

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
                result.idle = false;
                break;
            case RETURNING:
            case WAITING:
            case COLLECTING:
            case TESTING: // the test harness makes the man loop on a single path

                //console.log(paths[this.path]);
                //console.log(`step ${this.step} dir ${this.dir}`);
                //console.log(`from ${paths[this.path][this.step]} to ${paths[this.path][this.step + this.dir]}`);

                // for all those states, move to the next spot in the path until path is completed
                if (typeof paths[this.path][this.step + this.dir] != "undefined") {
                    this.moving = true;
                    result.idle = false;

                    //console.log(`from spot ${this.sprite.x},${this.sprite.y}`);
                    this.nextStep.x = paths[this.path][this.step + this.dir][0];
                    this.nextStep.y = paths[this.path][this.step + this.dir][1];
                    var nextPx = getMapCoords(this.nextStep);

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
                    //console.log(`next step ${this.stepPx.x},${this.stepPx.y}`);
                    this.step += this.dir;
                    //console.log(`vector ${this.vector.x},${this.vector.y}`);

                } else { // the bot is at the end of path, what's next?
                   if (this.state == TESTING) {
                       testLoops.text = "Loops " + (++this.testLoopCount);
                       this.dir *= -1;
                   } else if (this.state == COLLECTING) {
                       // made it to the generator and got the thing, take it back to the base
                       this.state = RETURNING;
                       this.carrying = THING;
                       this.sprite.setFrame("flatbot/bot1thing").setOrigin(0,0);
                       this.dir = 1;

                       result.affected = this.target;
                       result.affect = Constant.DO_TAKESTUFF;
                       result.idle = false;
                   } else {
                       // at the base, either store the thing and rest, or if it is full bounce and try again
                       if (this.carrying == THING) {
                           if (world[4].fuelBay[0] == 10 && world[4].fuelBay[1] == 10 && world[4].fuelBay[2] == 10) { //TODO: should be a method not this hardcode hack
                               //console.log("base full!");
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
                               result.idle = false;
                           }
                       } else {
                           // We can just rest. Tell the base we've arrived, with or without a thing.
                           this.state = RESTING;
                           this.sprite.setAlpha(0);

                           result.affected = 4;
                           result.affect = Constant.DO_RESTBOT;
                           result.idle = false;
                       }
                   }
                }
                break;
           case RESTING:
                //nothing to do right now, except get more rest
                break;
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