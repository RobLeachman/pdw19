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
var _ = require('lodash/lang');

import { assetsDPR, WIDTH, HEIGHT } from '../index.js';
import Sprite from "../sprite.js";
import { stringify } from 'zipson';


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
import Simulator from "../objects/simulator.js";

import {deathCrater} from "../util.js";

var hookDebugMode = "unset";
// from https://code-boxx.com/javascript-hooks-beginners-guide/
var hooks = {
  queue : {},

  add : function (name, fn) {
  // hooks.add() : add a hook
  // PARAM name : name of function to add hook to
  //       fn : function to call

    if (!hooks.queue[name]) {
      hooks.queue[name] = [];
    }
    hooks.queue[name].push(fn);
  },

  call : function (name, ...params) {
  // hooks.call() : call the hook functions
  // PARAM name : name of function to add hook to
  //       params : parameters
    if (hookDebugMode != "idle") {
        if (hooks.queue[name])  {
          hooks.queue[name].forEach(fn => fn(...params));
          //delete hooks.queue[name];
        }
    }
  }
};

var TESTING_noZoom = false; // for testing skip the zoom feature
var testDebugger = true;

// GLOBALS
/* will want these soon
var gameOptions = {
    difficulty: 0,
    testing: 1,
};
*/
var manStart = { x: 2, y: 0};
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

var recording = false;
var gameState = {};


export class PlayGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

/**************************************
 * INIT
 **************************************/
  //If you're not sure which plugins you will need when you create your Scene you can install them via the Scene Systems. This must be done in an init method...
  // https://phaser.io/phaser3/devlog/119
  init(data){
      this.mobile = data.mobile;
      //console.log(`MOBILE: ${this.mobile}`);
  }

  create() {
        //let { width, height } = this.cameras.main;
        //width /= assetsDPR;
        //height /= assetsDPR;

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

        this.simulator = new Simulator(this);
        this.debugMode = this.simulator.getMode();
        hookDebugMode = this.debugMode;
        if (this.debugMode == "play-perfect" || this.debugMode == "play-fast") {
            this.recording = this.simulator.getRecording(true);
//const copy = Object.freeze(Object.assign({}, this.recording)); //TODO: use this elsewhere, nice syntax thanks Kyle
            console.log("DO THIS");
            this.simulator.list();
            //console.log(copy);
            this.nextRecorded = this.recording.shift();
        }

//TODO: stack a save-state function after each of my hokey saveMan, saveGen...
/*
        hooks.add("before", function() {
            console.log("HOOK BEFORE");
        });
        hooks.add("before", function() {
            console.log("COOL BEANS");
        });
*/
        hooks.add("saveMan", function(theMan) {
            console.log("saveMan");
            //console.log(theMan);
            var manState = {
                carrying: theMan.carrying,
                location: theMan.location, //TODO: location is a URL property, use loc or something
                moveBuffer: theMan.moveBuffer,
                moving: theMan.moving,
                speed: theMan.speed,
                spriteX: theMan.sprite.x,
                spriteY: theMan.sprite.y,
                stepPx: theMan.stepPx,
                vector: theMan.vector
            };
            //console.log(manState);
            gameState["man"] = manState;
        });
        hooks.add("saveWorld", function(myObj) { // the objects we can interact with
            console.log("SAVE WORLD:");
            //console.log(myObj);
            if (typeof myObj.name == "undefined") {
                console.log("Saveworld object has no name!");
                console.log(myObj);
                throw ("What is it even?");
            }
            if (typeof myObj['saveState'] == "undefined") {
                console.log("Saveworld object has no state to save!");
                console.log(myObj);
                throw (`Saving what now? ${myObj.name}`);
            }

            var objState = {};

            const saveProps = myObj['saveState'];
            saveProps.map(p => objState[p] = myObj[p]);

            //console.log(objState);

            if (myObj.name == "Generator")
                objState.name = myObj.name + objState.spot;
            else
                objState.name = myObj.name;
            console.log(`saving ${objState.name}`);
            //console.log(objState);

            if (typeof gameState[objState.name] == "undefined") {
                console.log(`new ${objState.name}`);
                gameState[objState.name] = Object.freeze(Object.assign({}, objState));
                console.log(gameState[objState.name]);
            } else {
                console.log("just test it");
                if (_.isEqual(gameState[objState.name], objState))
                    console.log("NO CHANGE");
                else
                    gameState[objState.name] = objState;


            }
            //console.log("current state:");
            //console.log(gameState);
        });
        hooks.add("saveBot", function(theBot) {
            console.log(theBot);
            /*
            var manState = {
                carrying: theMan.carrying,
                location: theMan.location, //TODO: location is a URL property, use loc or something
                moveBuffer: theMan.moveBuffer,
                moving: theMan.moving,
                speed: theMan.speed,
                spriteX: theMan.sprite.x,
                spriteY: theMan.sprite.y,
                stepPx: theMan.stepPx,
                vector: theMan.vector
            };
            console.log(manState);
            */
        });

        hooks.call("saveMan", this.man);
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
            console.log("replay!");
            if (this.debugMode == "play-perfect") {
                if (replayTime >= this.nextRecorded.time) {
                    //console.log(`now ${replayTime} next ${this.nextRecorded.time} key ${this.nextRecorded.code}`);
                    this.doKey(this.nextRecorded.code);
                    this.nextRecorded = this.recording.shift();;
                }
            } else { // this.debugMode == "play-fast"
                this.doKey(this.nextRecorded.code);
                this.nextRecorded = this.recording.shift();;
            }
        }
        try {
            if (this.man.isMoving()) {
                this.man.doMove(this.loopCount,delta);
                hooks.call("saveMan", this.man);
            } else if (this.man.getBuffer() > -1) {
                if (this.man.getBuffer() == Constant.INTERACT) {
                    var theManAt = getSpotAtLocation(this.man.location);
                    if (theManAt !== null) {
                       world[theManAt].interact(this.man, bots); //TODO: pass the bot array to botFactory only
                       hooks.call("saveWorld", world[theManAt]);
/*
            console.log("STUFF");
            console.log(gameState);
            var stuffed = this.simulator.stuff(gameState);
            console.log(stuffed);
           */

                    }
                } else
                    this.makeMove(this.man.getBuffer());
                this.man.clearBuffer();
                hooks.call("saveMan", this.man);
                //console.log(world[9].getScore());// GET SCORE FROM MARKET
            }

            // PLAN
            // If we can find a resting bot and a generator with a thing, plan to go get it
            for (var b=0;b<bots.length;b++) {
                if(bots[b].isResting()) {
                   for(var i=0;i<world.length;i++) {
                       if (world[i] instanceof Generator && world[i].isReadyToCollect()) {
                           //console.log("go get " + i);
                           world[i].collectionPending(); // update the generator, the thing will be collected soon
                           bots[b].getThing(i); // tell this bot to get the thing
                           hooks.call("saveWorld", world[i]);
                           console.log("test bot save!");
                           hooks.call("saveBot", bots[b]);
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
                if (!result.idle)
                    //hooks.call("saveBot", bots[b]);

                if (result.affected > 0) {
                    //console.log("DO " + result.affect + " to " + result.affected);
                    world[result.affected].doAction(result.affect);
                    hooks.call("saveWorld", world[result.affected]);
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

        if (this.man.moveBuffer > -1) {
            hooks.call("before");
            this.man.tryMove();
        }
    }

    handleKey(e){
        var timeKey = this.time.now;
        //console.log(`key: ${timeKey} code ${e.code}`);
        if (e.code != "KeyX" && e.code != "Backslash" && e.code != "Backquote" && e.code != "Equal" && e.code != "Minus") {
            if (this.simulator.getMode() == "record")
                this.simulator.record(timeKey, e.code);
            this.doKey(e.code);
        } else {
            switch (e.code) {
                case "Backquote":
                    console.log("begin recording");
                    this.simulator.reset();
                    this.simulator.setMode("record");
                    window.location.reload(false);
                    break;
                case "KeyX":
                    console.log("stop recording");
                    this.simulator.putRecording();
                    this.simulator.setMode("play");
                    //window.location.reload(false);
                    break;
                case "Equal":
                    console.log("replay recording");
                    this.simulator.setMode("play-fast");
                    window.location.reload(false);
                    break;
                case "Minus":
                    console.log("replay recording");
                    this.simulator.setMode("play-perfect");
                    window.location.reload(false);
                    break;
                case "Backslash":
                    console.log("quit replay");
                    this.simulator.setMode("idle");
                    break;
            }
        }
    }

    doKey(keycode) {
        switch(keycode) {
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
        if (testDebugger) {
            this.text = "Tick: start recording\nX: stop recording\n=: replay (fast)\nMinus: replay(perfect)\nBackslash: quit replay\n";
        } else {
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
      }
        this.instructions = this.add.bitmapText(320*assetsDPR, 10*assetsDPR, 'xolonium-white', this.text ,10*assetsDPR);
    }
}

