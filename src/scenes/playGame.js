/* Produce, Defend, Win! 2019 edition
 *
 * A man walks a road,
 * driven by keypresses or swipes,
 * takes stuff and builds things,
 * generators, which make stuff, and need gas,
 * everything somewhat ready to fail altogether
 * (BUG) like when he gets over to the drama stage
 *
 *
 */

import Constant from "../constants.js";
import Base from "./base.js";
import Generator from "./generator.js";
import GasFactory from "./gasFactory.js";
import BotFactory from "./botFactory.js";
import Market from "./market.js";
import Shields from "./shields.js";
import Laser from "./laser.js";
import Mother from "./mother.js";
import Fighter from "./fighter.js";
import Bomb from "./bomb.js";
import {getLocationX, getLocationY, getMapCoords} from "./util.js";

/* global Phaser */

// GLOBALS
var gameOptions = { // will want these soon
    difficulty: 0,
    testing: 1,

};

const map = [
          [[35,100,0], [100,100], [165,100,1], [230,100], [295,100,2], [360,100]],
          [[35,230,3], [100,230], [165,230,4], [230,230], [295,230,5], [360,230]],
          [[35,360,6], [100,360], [165,360,7], [230,360], [295,360,8], [360,360]],
          [[-1,-1], [-1,-1], [-1,-1], [-1,-1], [-1,-1],                [360,540], [425,540,9], [545,540,10], [665,540,11]]
            ];

const path = [
    [[35,100], [100,100], [100,230], [165,230]],
    [[165,100], [100,100], [100,230], [165,230]],
    [[295,100], [230,100], [230,230], [165,230]],
    [[35,230], [100,230], [165,230]],
    [[230,230]], // path #4 makes no sense, already there
    [[295,230], [230,230], [165,230]],
    [[35,360], [100,360], [100,230], [165,230]],
    [[165,360], [230,360], [230,230], [165,230]],
    [[295,360], [230,360], [230,230], [165,230]], //8=gasFactory
    [[425,540], [360,540], [360,360], [360,230], [295,230], [230,230], [165,230]],
    [[545,540], [425,540], [360,540], [360,360], [360,230], [295,230], [230,230], [165,230]],//10=shields
    [[665,540], [545,540], [425,540], [360,540], [360,360], [360,230], [295,230], [230,230], [165,230]]
             ];


var world = [];
var didFail = false;
var funZoom = true;
var noZoom = true;

var fighterCount = 0;
var shootAt = {
    x: 0,
    y:0
};

export class PlayGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
    //console.log("constructed PlayGame");
  }

  create() {
/**************************************
 * INIT
 **************************************/
        //this.cameras.main.setBounds(0,0,800,600);
        this.cameras.main.setZoom(1.55);
        this.cameras.main.setScroll(-200,-95);
        this.add.image(0, 0, "road").setOrigin(0, 0);

        if (noZoom) {
                   funZoom = false;
                   this.cameras.main.setZoom(1);
                   this.cameras.main.setScroll(0,0);
        }

        for (var spot=0;spot<9;spot++) {
            if (spot == 0) {
               var botFactory = new BotFactory(this,"botFactoryPad", spot);
               world.push(botFactory);
            } else if (spot == 4) {
               var base = new Base(this,"base", spot, "fuelStore");
               world.push(base);
            } else if (spot == 8) {
               var gasFactory = new GasFactory(this,"gasFactoryPad", spot);
               world.push(gasFactory);
            } else {
               var loc = new Generator(this,"pad",spot);
               world.push(loc);
            }
        }
        var market = new Market(this,"market",9);
        world.push(market);
        this.shields = new Shields(this,"shields",10);
        world.push(this.shields);
        this.laser = new Laser(this,"laser",11);
        world.push(this.laser);

        this.homeBlock = this.add.rectangle(400, 445, 330, 60, 0x0000ff).setOrigin(0,0);
        this.homeBlock.setAlpha(0);
        this.physics.add.existing(this.homeBlock, true);

        this.shields.paint();

        this.man = {
            location: new Phaser.Geom.Point(2,1), // 2,1
            spot: 4,//4
            moving: false,
            moveBuffer: -1,
            carrying: Constant.NOTHING
        };
        var manCoords = getMapCoords(this.man.location);
        this.man.sprite = this.add.sprite(manCoords.x, manCoords.y, "man", 0).setOrigin(0,0);

        this.bots = [];

        this.mother = new Mother(this);
        this.motherTimer = 0;

        this.bombCount = 0;

        this.input.keyboard.on("keyup", this.handleKey, this);
        this.input.on("pointerup", this.handleSwipe, this);
        this.input.on("pointerdown", this.handleMashing, this);
        //console.log("created!");
    }

    update () {
        try {
            if (!this.man.moving && this.man.moveBuffer > -1) {
                if (this.man.moveBuffer == Constant.INTERACT) {
                    var manAt = map[this.man.location.y][this.man.location.x][2];
                    //console.log("Interact at " + manAt);
                    if (typeof manAt != "undefined")
                        world[manAt].interact(this.man, this.bots); // pass the bots array to botFactory only
                } else
                    this.makeMove(this.man.moveBuffer);
                this.man.moveBuffer = -1;
            }

            for (var b=0;b<this.bots.length;b++) {
                var result = this.bots[b].act();
                if (result.affected > 0) {
                    //console.log("DO " + result.affect + " to " + result.affected);
                    world[result.affected].doAction(result.affect);
                }
            }

            if (!this.mother.isMoving()) {
                if (++this.motherTimer > 20 && fighterCount < 1) { //20
                    this.fighter = new Fighter(this);
                    fighterCount = 1;
                    //console.log("launch");
                }
                if (this.motherTimer > 100 && this.bombCount < 1) { //100
                    this.bomb = new Bomb(this, this.shields, this.homeBlock, this.bombCount);
                    this.bombCount++;
                }
                if (this.motherTimer > 200 && this.bombCount < 2) { //150
                    this.bomb = new Bomb(this, this.shields, this.homeBlock, this.bombCount);
                    this.bombCount++;
                }
                if (this.motherTimer > 300 && this.mother.isAlive()) {
                    this.mother.die();
                }
                if (this.motherTimer > 250 && this.fighter.isAlive()) {
                    this.fighter.die();
                }
            }

            this.laser.shoot(shootAt.x, shootAt.y);


        } catch (err) {
            // the shit's gonna fail, try to capture a clue when it does...
            // not too bad on PC but harder on phone and this attmept is sad
            if (didFail) {
                throw ("the wheels, they have come off the wagon again")
            }
            console.log("ERROR " + err);
            console.log("STACK " + err.stack);
            didFail = true;

            var ratfarts = this.add.graphics();
            ratfarts.fillStyle(0x0000FF, 1);
            var fail = new Phaser.Geom.Rectangle(0,0,800,600);
            ratfarts.fillRectShape(fail);
            this.add.text(0, 40, err);
            this.add.text(0, 70, "RATFARTS");
            this.add.text(0, 100, err.stack);
        }
    }

    handleKey(e){
        switch(e.code){
            case "KeyA":
            case "ArrowLeft":
                this.man.moveBuffer = Constant.LEFT;
                break;
            case "KeyD":
            case "ArrowRight":
                this.man.moveBuffer = Constant.RIGHT;
                break;
            case "KeyW":
            case "ArrowUp":
                this.man.moveBuffer = Constant.UP;
                break;
            case "KeyS":
            case "ArrowDown":
                this.man.moveBuffer = Constant.DOWN;
                break;
            case "Space":
                this.man.moveBuffer = Constant.INTERACT;
                break;

            case "Digit0":
              this.man.sprite.setFrame(0);
              this.man.carrying = Constant.NOTHING;
              break;
            case "Digit1":
              this.man.sprite.setFrame(1);
              this.man.carrying = Constant.THING;
              break;
            case "Digit2":
              this.man.sprite.setFrame(2);
              this.man.carrying = Constant.GAS;
              break;
        }
    }

    handleMashing(e) {
        if (e.downX > 400 && e.downX < 730 && e.downY < 350) {
             shootAt.x = e.downX; shootAt.y = e.downY;
             console.log("MASH " + shootAt.x + "," + shootAt.y);
        }
    }

    handleSwipe(e){
        var swipeTime = e.upTime - e.downTime;
        var fastEnough = swipeTime < Constant.swipeMaxTime;
        var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        var longEnough = swipeMagnitude > Constant.swipeMinDistance;
        if(longEnough && fastEnough){
            Phaser.Geom.Point.SetMagnitude(swipe, 1);
            if(swipe.x > Constant.swipeMinNormal){
                this.man.moveBuffer = Constant.RIGHT;
            }
            if(swipe.x < -Constant.swipeMinNormal){
                this.man.moveBuffer = Constant.LEFT;
            }
            if(swipe.y > Constant.swipeMinNormal){
                this.man.moveBuffer = Constant.DOWN;
            }
            if(swipe.y < -Constant.swipeMinNormal){
                this.man.moveBuffer = Constant.UP;
            }
        } else {
            if (e.downX > 400 && e.downX < 730 && e.downY < 350) {
                console.log("QUIT");
                shootAt.x = -1;
            } else {
                console.log("tap! " + e.downX + "," + e.downY);
                this.man.moveBuffer = Constant.INTERACT;
            }
        }
    }

    makeMove(dir) {
        var oldLocX = this.man.location.x; // copying these 2 attributes only... love JS
        var oldLocY = this.man.location.y;
        var manAt = map[this.man.location.y][this.man.location.x][2];
        switch (dir) {
            case Constant.LEFT:
                this.man.location.x--;
                break;
            case Constant.RIGHT:
                this.man.location.x++;
                break;
            case Constant.UP:
                this.man.location.y--;
                if (manAt > -1)
                   this.man.location.y = -1;
                break;
            case Constant.DOWN:
                this.man.location.y++;
                if (funZoom && this.man.location.y > 2) {
                    funZoom = false;
                    var cam = this.cameras.main;
                    cam.pan(400, 300, 400, 'Linear');
                    cam.zoomTo(1, 400);
                }
                if (manAt > -1) {
                   this.man.location.y = -1;
                }
                break;
        }
        var newCoords = getMapCoords(this.man.location);
        if (!newCoords) {
            this.man.location.x = oldLocX;
            this.man.location.y = oldLocY;
        }
        else {
            var manCoords = getMapCoords(this.man.location);
            this.man.moving = true;
            this.tweens.add({
                targets: [this.man.sprite],
                duration: 300,
                x:manCoords.x,
                y:manCoords.y,
                callbackScope: this,
                onComplete: function() {
                    this.man.moving = false;
                }
            });
        }
    }
}
