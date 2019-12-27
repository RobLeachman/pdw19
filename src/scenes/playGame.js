/* Produce, Defend, Win! 2019 edition
 *
 * A man walks a road,
 * driven by keypresses or swipes,
 * takes stuff and builds things,
 * generators, which make stuff, and need gas,
 * everything somewhat ready to fail altogether,
 * with a instructional clue, and bombs falling,
 * and death and a laser and an end explosion,
 * even a sound effect
 *
 * TODO's: -- all these plus any amount of other things!
 * - fix laser
 * - bot logic includes all tasks
 * - man (human) getter/setter cleanup
 * - tune up shield recharge, for now it is disabled for easiest testing
 * - shield "how to extend base class" - easy peasy
 *
 * - constant.js? or no?
 * - base comment about stashStuff and overflow?
 *
 * - be sure linter can't do more?
 * - keep working on scaling
 * - vertical map for better phone fun (2.0?)
 * - clean up repo
 */


/* global Phaser */
import { assetsDPR, WIDTH, HEIGHT } from '../index.js';
import Sprite from "../sprite.js";

import Constant from "../constants.js";
import {getSpotAtLocation} from "../util.js";

import Human from "../objects/human.js";
import BotFactory from "../objects/botFactory.js";
import GasFactory from "../objects/gasFactory.js";
import Shields from "../objects/shields.js";
import Laser from "../objects/laser.js";
import Base from "../objects/base.js";
import Generator from "../objects/generator.js";
import Market from "../objects/market.js";
import Mother from "./mother.js";
import Fighter from "./fighter.js";
import Bomb from "./bomb.js";

import {deathCrater} from "../util.js";

var TESTING_noZoom = false; // for testing skip the zoom feature

// GLOBALS
/* will want these soon
var gameOptions = {
    difficulty: 0,
    testing: 1,
};
*/
var manStart = { x: 0, y: 0};
// 2,1 normal start
// 5,2 is corner
// 8,3 is laser

var world = [];
var bots = [];
var didFail = false;
var funZoom = true; // start zoomed on man in center of grid

var fighterCount = 0;
var shootAt = {
    x: 0,
    y:0
};

var gameOver = false;

var drama_left = 330;

var test_bomb_start = 3;//300
var test_bomb_interval = 200;
var test_bomb_count = 0;
var test_bombing = true;
var deadX, deadY;
var deathTime=0;

var loopCount = 0;


export class PlayGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

/**************************************
 * INIT
 **************************************/
  init(data){
      this.mobile = data.mobile;
      console.log(`MOBILE: ${this.mobile}`);
  }

  create() {
        //let { width, height } = this.cameras.main;
        //width /= assetsDPR;
        //height /= assetsDPR;
        console.log("PlayGame create " + this.foo);

        this.theShield = new Phaser.GameObjects.Rectangle(this,200,200,300,300,0x0000ff,1);
        this.add.text(50*assetsDPR, 330*assetsDPR, "assetsDPR: " + assetsDPR,{ font: '18px Verdana' });
        this.add.text(50*assetsDPR, 350*assetsDPR, "WIDTH: " +WIDTH,{ font: '12px Verdana' });
        this.add.text(150*assetsDPR, 350*assetsDPR, "HEIGHT: " +HEIGHT,{ font: '12px Verdana' });

        //this.cameras.main.setBounds(0,0,800,600);

        this.cameras.main.setZoom(1.50); this.cameras.main.setScroll(-100*assetsDPR,-72*assetsDPR); // perfect!
        //this.cameras.main.setZoom(1.50); this.cameras.main.setScroll(120*assetsDPR,100*assetsDPR); //bottom row
        if (TESTING_noZoom) {
            funZoom = false;
            this.cameras.main.setZoom(1); this.cameras.main.setScroll(0,0);
            //this.cameras.main.setZoom(3); this.cameras.main.setScroll(200*assetsDPR,100*assetsDPR); //shield debug
        }

        // init every location
        for (var spot=0;spot<9;spot++) {
            if (spot == 0) {
               var botFactory = new BotFactory(this, spot);
               world.push(botFactory);
            } else if (spot == 4) {
               var base = new Base(this,"base", spot );
               world.push(base);
            } else if (spot == 8) {
               var gasFactory = new GasFactory(this,"gasFactoryPad", spot);
               world.push(gasFactory);
            } else if (spot == 1) {
               var firstGenerator = new Generator(this,"generator", spot);
               world.push(firstGenerator);
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
        firstGenerator.regenerate(true);

        if (!TESTING_noZoom) {
            this.instructions();
        }

        new Sprite(this, 0, 0, "bigBackground", "road4").setOrigin(0,0);

        // bomb collision test block, if the bomb touches this... kablooey
        this.homeBlock = this.add.rectangle(300*assetsDPR, 350*assetsDPR, 329*assetsDPR, 10*assetsDPR, 0xff0000).setOrigin(0,0);
        this.homeBlock.setAlpha(0);
        this.physics.add.existing(this.homeBlock, true);

        var start = new Phaser.Geom.Point(manStart.x,manStart.y); //TODO: a little clumbsy, but nice for testing vs having to edit the class
        this.man = new Human(this,start);

        this.bombCount = 0;
        this.bombList = [];

        this.mother = new Mother(this);
        this.motherTimer = 0;

        this.input.keyboard.on("keyup", this.handleKey, this);
        this.input.on("pointerup", this.handleSwipe, this);
        this.input.on("pointerdown", this.handleMashing, this);

        this.testNoise = this.sound.add('testNoise');
        var timeStarted = this.time.now;

        this.recording = [[300, "ArrowRight"],[500, "ArrowRight"]];
        this.nextRecorded = this.recording.shift();
    }

/**********************************
 * MAINLINE
 **********************************/

    update (time, delta) {
        var replayTime = this.time.now;

        loopCount++;
        if (gameOver) {
            if (deathTime++>50)
                deathCrater(this,deadX,deadY);
            if (deathTime++>100)
                this.add.bitmapText(deadX-100, deadY-80, 'gameplay-white', "RELOAD?" ,10*assetsDPR).setDepth(Number.MAX_VALUE);
            if (deathTime == 250 )
                this.cameras.main.fade(2000);
            if (deathTime > 2000) {
                this.scene.stop();
            }
            return;
        }
        if (typeof this.nextRecorded != "undefined") {
            if (replayTime >= this.nextRecorded[0]) {
                console.log(`now ${replayTime} next ${this.nextRecorded[0]} key ${this.nextRecorded[1]}`);
                this.doKey(this.nextRecorded[1]);
                this.nextRecorded = this.recording.shift();;
            }
        }
        try {
            if (this.man.isMoving()) {
                this.man.doMove(this.loopCount,delta);
            } else if (this.man.getBuffer() > -1) {
                if (this.man.getBuffer() == Constant.INTERACT) {
                    var theManAt = getSpotAtLocation(this.man.location);
                    if (theManAt !== null) {
                       world[theManAt].interact(this.man, bots); // pass the bot array to botFactory only
                    }
                } else
                    this.makeMove(this.man.getBuffer());
                this.man.clearBuffer();
            }
            /*
            if (!this.man.isMoving() && this.man.getBuffer() > -1) {
                if (this.man.getBuffer() == Constant.INTERACT) {
                    var theManAt = getSpotAtLocation(this.man.location);
                    if (theManAt !== null) {
                       world[theManAt].interact(this.man, bots); // pass the bot array to botFactory only
                    }
                } else
                    this.makeMove(this.man.getBuffer());
                this.man.clearBuffer();
                //console.log(world[9].getScore());// GET SCORE FROM MARKET
            }
            */

            // PLAN
            // If we can find a resting bot and a generator with a thing, plan to go get it
            for (var b=0;b<bots.length;b++) {
                if(bots[b].isResting()) {
                   for(var i=0;i<world.length;i++) {
                       if (world[i] instanceof Generator && world[i].isReadyToCollect()) {
                           //console.log("go get " + i);
                           world[i].collectionPending(); // update the generator, the thing will be collected soon
                           bots[b].getThing(i); // tell this bot to get the thing
                       }
                   }
                }
            }
/*TODO something like this, is next:
            // If we can find a resting bot, a generator which needs gas, and a thing, refuel it
            for (var b=0;b<bots.length;b++) {
                if(bots[b].isResting()) {
                   for(var i=0;i<world.length;i++) {
                       if (world[i] instanceof Generator && world[i].needsGas()) {
                           console.log("go get " + i);
                           world[i].collectionPending(); // update the generator, the thing will be collected soon
                           bots[b].getThing(i); // tell this bot to get the thing
                       }
                   }
                }
            }
*/

            // ACT
            for (var b=0;b<bots.length;b++) {
                var result = bots[b].act(world,loopCount,delta); // take the next step in the path, and when we've arrived signal the affected location
                if (result.affected > 0) {
                    //console.log("DO " + result.affect + " to " + result.affected);
                    world[result.affected].doAction(result.affect);
                }
            }

            this.shields.update();

            if (!this.mother.isMoving()) {
                if (++this.motherTimer > 20 && fighterCount < 1) { //20
                    this.fighter = new Fighter(this);
                    fighterCount = 1;
                }
            }
            /*
            if (this.motherTimer > 1000 && (!funZoom || this.motherTimer > 800)) {
                if (test_bomb_count++ > test_bomb_start && this.bombList.length < 1) {
                    this.bomb = new Bomb(this, this.shields, this.homeBlock, this.bombCount, this.cameras.main);
                    this.bombCount++;
                    this.bombList.push(this.bomb);
                }
                if ((this.bombList.length*test_bomb_interval+test_bomb_start)<test_bomb_count && test_bombing) {
                    this.bomb = new Bomb(this, this.shields, this.homeBlock, this.bombCount, this.cameras.main);
                    this.bombCount++;
                    this.bombList.push(this.bomb);
                }
            }
            */


            this.laser.shoot(shootAt.x, shootAt.y);
            if (this.laser.isShooting) {
                var victim = this.laser.lockTarget(this.mother, this.fighter, this.bombList);
                var hackDone=1;
                if (victim != null) {
                    if (victim instanceof Fighter)
                       test_bombing = false;
                    hackDone = victim.getShot();
                } else
                    console.log("miss");
                if (hackDone < 0) {
                    this.testNoise.play();
                    this.laser.victory();
                }
            }
            // check for winner
            for (var b=0;b<this.bombList.length;b++) {
                if (this.bombList[b].status == 2) {
                   gameOver = true;
                   deadX = this.bombList[b].sprite.x; deadY = this.bombList[b].sprite.y;
                   this.cameras.main.flash(500,0xffffff);
                   this.cameras.main.pan(this.bombList[b].sprite.x, this.bombList[b].sprite.y, 1400, 'Linear');
                   this.cameras.main.zoomTo(5, 1400);
                }

            }

        } catch (err) {
            // the shit's gonna fail, try to capture a clue when it does...
            // not too bad on PC but harder on phone and this attempt is sad,
            // but everything is blue if we get here at all.
            if (didFail) { // we need one more frame update to display the error
                throw ("the wheels, they have come off the wagon again");
            }
            console.log("ERROR " + err);
            console.log("STACK " + err.stack);
            didFail = true;

            this.cameras.main.setZoom(1);
            this.cameras.main.setScroll(0,0);
            var ratfarts = this.add.graphics();
            ratfarts.fillStyle(0x0000FF, 1);
            var fail = new Phaser.Geom.Rectangle(0,0,WIDTH,HEIGHT);
            ratfarts.fillRectShape(fail);

            this.add.text(0, 40, err).setFontSize(10*assetsDPR).setResolution(24000);
            this.add.text(0, 120, "RATFARTS").setFontSize(10*assetsDPR).setResolution(24000);
            this.add.text(0, 200, err.stack).setFontSize(10*assetsDPR).setResolution(24000);
        }
    }

    makeMove(dir) {
        if (funZoom && this.man.location.x == 5 && this.man.location.y == 2 && this.man.moveBuffer == Constant.DOWN) {
            funZoom = false;
            this.cameras.main.pan(1250, 950, 700, 'Linear');
            this.cameras.main.zoomTo(1, 700);
            this.instructions.setAlpha(0);
            this.px = this.shields.paintShieldBars(100);
        }

        if (this.man.moveBuffer > -1)
            this.man.tryMove();
    }

    handleKey(e){
        var timeKey = this.time.now;
        console.log(`key: ${timeKey} code ${e.code}`);
        console.log(e.code);
        this.doKey(e.code);
    }

    doKey(keycode) {
        switch(keycode){
            case "KeyA":
            case "ArrowLeft":
                this.man.setBuffer(Constant.LEFT);
                break;
            case "KeyD":
            case "ArrowRight":
                this.man.setBuffer(Constant.RIGHT);
                break;
            case "KeyW":
            case "ArrowUp":
                this.man.setBuffer(Constant.UP);
                break;
            case "KeyS":
            case "ArrowDown":
                this.man.setBuffer(Constant.DOWN);
                break;
            case "Space":
                this.man.setBuffer(Constant.INTERACT);
                break;

            case "Digit0":
              this.man.isNowCarrying(Constant.NOTHING);
              break;
            case "Digit1":
              this.man.isNowCarrying(Constant.THING);
              break;
            case "Digit2":
              this.man.isNowCarrying(Constant.GAS);
              break;
            case "Digit4":
              this.cameras.main.shake(50,.01);
              this.shields.hit();
              break;
            case "Digit5":
              this.bomb = new Bomb(this, this.shields, this.homeBlock, this.bombCount);
              this.bombCount++;
              this.bombList.push(this.bomb);
              break;
            case "KeyX":
              this.scene.stop();
              this.scene.resume('Recorder');
        }
    }

    handleMashing(e) {
        //console.log(`shoot ${e.downX},${e.downY}`);
        if (e.downX > drama_left*assetsDPR && e.downY < 360*assetsDPR) {
             shootAt.x = e.downX; shootAt.y = e.downY;
             //console.log("MASH " + shootAt.x + "," + shootAt.y);
        }
    }

    handleSwipe(e){
        var swipeTime = e.upTime - e.downTime;
        var fastEnough = swipeTime < Constant.swipeMaxTime;
        var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        var longEnough = swipeMagnitude > Constant.swipeMinDistance;

        if (longEnough && fastEnough) {
            Phaser.Geom.Point.SetMagnitude(swipe, 1);
            if(swipe.x > Constant.swipeMinNormal){
                this.man.setBuffer(Constant.RIGHT);
            }
            if(swipe.x < -Constant.swipeMinNormal){
                this.man.setBuffer(Constant.LEFT);
            }
            if(swipe.y > Constant.swipeMinNormal){
                this.man.setBuffer(Constant.DOWN);
            }
            if(swipe.y < -Constant.swipeMinNormal){
                this.man.setBuffer(Constant.UP);
            }
        } else if (e.downX > drama_left*assetsDPR && e.downY < 360*assetsDPR) {
            //console.log("quit shooting?");
            shootAt.x = -1;
        } else {
            //console.log("tap! " + e.downX + "," + e.downY);
            this.man.setBuffer(Constant.INTERACT);
        }
    }

    instructions() {
        this.text = "HEY FIRST, THANKS FOR\nPLAYING MY GAME!\n\n\
SEE THE BLUE\n\
GENERATOR WITH\n\
THE GREEN THING?\n\
GO GET IT!\n\n";
if (!this.mobile) {
this.text += "HIT W-A-S-D\nAND SPACEBAR,\n\
MOUSE TO SHOOT.\n\n";
} else {
this.text += "SWIPE AND TAP,\n\
OR PRESS AND\n\
HOLD TO SHOOT.\n\n";
}

this.text += "USE THE THING TO\n\
BUILD, BUY GAS\n\
AND ROBOTS.\n\n\
$50K WINS THE\n\
GAME.\n\n\
YOU'RE AWESOME,\n\
HAVE FUN AND\n\
TRY NOT TO DIE!";
        this.instructions = this.add.bitmapText(320*assetsDPR, 10*assetsDPR, 'xolonium-white', this.text ,10*assetsDPR);
    }
}
