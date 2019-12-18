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
/* global Phaser */
import { assetsDPR, WIDTH, HEIGHT } from '../index.js';
import Sprite from "../sprite.js";

import Constant from "../constants.js";
import Human from "./human.js";
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
import {getLocationX, getLocationY, getMapCoords, getSpotAtLocation} from "./util.js";


// GLOBALS
var gameOptions = { // will want these soon
    difficulty: 0,
    testing: 1,

};

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

        // 2,1 normal start
        // 5,2 is corner
        // 8,3 is laser
var manStart = { x: 0, y: 0};

var world = [];
var bots = [];
var didFail = false;
var funZoom = true; // start zoomed on man in center of grid
var noZoom = false; // for testing, don't zoom

var fighterCount = 0;
var shootAt = {
    x: 0,
    y:0
};

export class PlayGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  create() {
/**************************************
 * INIT
 **************************************/
        let { width, height } = this.cameras.main;
        width /= assetsDPR;
        height /= assetsDPR;
        //this.testBackground = new Sprite(this, 0,0, "roadtest").setOrigin(0,0); //fits nicely!
        this.background  = new Sprite(this, 0,0, "bigBackground", "road4").setOrigin(0,0); //TODO: don't need to store it?
        this.add.text(50*assetsDPR, 330*assetsDPR, "assetsDPR: " + assetsDPR,{ font: '18px Verdana' });
        this.add.text(50*assetsDPR, 350*assetsDPR, "WIDTH: " +WIDTH,{ font: '12px Verdana' });
        this.add.text(150*assetsDPR, 350*assetsDPR, "HEIGHT: " +HEIGHT,{ font: '12px Verdana' });


        //this.cameras.main.setBounds(0,0,800,600);
        this.cameras.main.setZoom(1.50);
        this.cameras.main.setScroll(-100*assetsDPR,-72*assetsDPR);
        // bottom row
        //this.cameras.main.setZoom(1.50); this.cameras.main.setScroll(120*assetsDPR,100*assetsDPR);
        if (noZoom) {
                   funZoom = false;
                   this.cameras.main.setZoom(1);
                   this.cameras.main.setScroll(0,0);
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

        //TEST
        var f = new Fighter(this);
        botFactory.build();

        this.text = "HEY FIRST, THANKS FOR\nPLAYING MY GAME!\n\n\
SEE THE BLUE\n\
GENERATOR WITH\n\
THE GREEN THING?\n\
GO GET IT!\n\n\
HIT W-A-S-D\nAND SPACEBAR\nOR SWIPE AND TAP.\n\n\
USE THE THING TO\n\
BUILD, BUY GAS\n\
AND ROBOTS.\n\n\
$50K WINS THE\n\
GAME.\n\n\
YOU'RE AWESOME,\n\
HAVE FUN AND\n\
TRY NOT TO DIE!";
        this.instructions = this.add.bitmapText(320*assetsDPR, 10*assetsDPR, 'gameplay-white', this.text ,10*assetsDPR);

/*
// bomb collision test block
        this.homeBlock = this.add.rectangle(400, 445, 330, 60, 0x0000ff).setOrigin(0,0);
        this.homeBlock.setAlpha(0);
        this.physics.add.existing(this.homeBlock, true);

*/

        var start = new Phaser.Geom.Point(manStart.x,manStart.y); //TODO: a little clumbsy, but nice for testing vs having to edit the class
        this.man = new Human(this,start);


/*
//rush to graphics:
        this.bombCount = 0; */

        this.mother = new Mother(this);
        this.motherTimer = 0;

        this.input.keyboard.on("keyup", this.handleKey, this);
        this.input.on("pointerup", this.handleSwipe, this);
        this.input.on("pointerdown", this.handleMashing, this);

        this.man.isNowCarrying(Constant.THING);
    }

/**********************************
 * MAINLINE
 **********************************/

    update () {
        try {
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


            for (var b=0;b<bots.length;b++) {
                var result = bots[b].act();
                if (result.affected > 0) {
                    console.log("DO " + result.affect + " to " + result.affected);
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
                if (this.motherTimer > 10 && this.mother.isAlive()) {
                    this.mother.die();
                }
                /*
                if (this.motherTimer > 250 && this.fighter.isAlive()) {
                    this.fighter.die();
                }
                */
            }

            this.laser.shoot(shootAt.x, shootAt.y);


        } catch (err) {
            // the shit's gonna fail, try to capture a clue when it does...
            // not too bad on PC but harder on phone and this attempt is sad,
            // but everything is blue if we get here at all.
            if (didFail) { // we need one more frame update to display the error
                throw ("the wheels, they have come off the wagon again")
            }
            console.log("ERROR " + err);
            console.log("STACK " + err.stack);
            didFail = true;

            var ratfarts = this.add.graphics();
            ratfarts.fillStyle(0x0000FF, 1);
            var fail = new Phaser.Geom.Rectangle(0,0,WIDTH,HEIGHT);
            ratfarts.fillRectShape(fail);
            this.add.text(0, 40, err).setFontSize(20).setResolution(24000);
            this.add.text(0, 70, "RATFARTS");
            this.add.text(0, 100, err.stack).setFontSize(20).setResolution(8000);
        }
    }

    makeMove(dir) {
        if (funZoom && this.man.location.x == 5 && this.man.location.y == 2 && this.man.moveBuffer == Constant.DOWN) {
            funZoom = false;
            //this.cameras.main.setZoom(1);
            //this.cameras.main.setScroll(0,0);
            this.cameras.main.pan(1250, 950, 700, 'Linear');
            this.cameras.main.zoomTo(1, 700);
            this.instructions.setAlpha(0);
            this.px = this.shields.paintShieldBars(100);
        }

        if (this.man.moveBuffer > -1)
            this.man.tryMove();
    }

    handleKey(e){
        switch(e.code){
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
        } else {
            if (e.downX > 400 && e.downX < 730 && e.downY < 350) {
                console.log("QUIT");
                shootAt.x = -1;
            } else {
                //console.log("tap! " + e.downX + "," + e.downY);
                this.man.setBuffer(Constant.INTERACT);
            }
        }
    }

}
