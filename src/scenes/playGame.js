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

import Base from "./base.js";
import Generator from "./generator.js";

/* global Phaser */
var game;
var gameOptions = { // will want these soon
    difficulty: 0,
    testing: 1,

    swipeMaxTime: 1000,
    swipeMinDistance: 20,
    swipeMinNormal: 0.85
};

const map = [
          [[35,100,0], [100,100], [165,100,1], [230,100], [295,100,2], [360,100]],
          [[35,230,3], [100,230], [165,230,4], [230,230], [295,230,5], [360,230]],
          [[35,360,6], [100,360], [165,360,7], [230,360], [295,360,8], [360,360]],
          [[-1,-1], [-1,-1], [-1,-1], [-1,-1], [-1,-1],                [360,540], [425,540,10], [545,540,11], [665,540,12]]
            ];

const LEFT = 0;
const RIGHT = 1;
const UP = 2;
const DOWN = 3;
const INTERACT = 4;

const NOTHING = 0;
const THING = 1;
const GAS = 2;

var world = [];
var didFail = false;
var funZoom = true;

export class PlayGame extends Phaser.Scene {
  constructor() {
    super("PlayGame");
  }

  create() {
/**************************************
 * INIT
 **************************************/
        //this.cameras.main.setBounds(0,0,800,600);
        this.cameras.main.setZoom(1.55);
        this.cameras.main.setScroll(-200,-95);
        this.add.image(0, 0, "road").setOrigin(0, 0);


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

        this.man = {
            location: new Phaser.Geom.Point(2,1),
            spot: 4,
            moving: false,
            moveBuffer: -1,
            carrying: NOTHING
        };

        var manCoords = getMapCoords(this.man.location);

        this.man.sprite = this.add.sprite(manCoords.x, manCoords.y, "man", 0).setOrigin(0,0);

        this.input.keyboard.on("keyup", this.handleKey, this);
        this.input.on("pointerup", this.handleSwipe, this);
    }

    update () {
        try {
            if (!this.man.moving && this.man.moveBuffer > -1) {
                if (this.man.moveBuffer == INTERACT) {
                    var manAt = map[this.man.location.y][this.man.location.x][2];
                    //console.log("Interact at " + manAt);
                    if (typeof manAt != "undefined")
                        world[manAt].interact(this.man);
                } else
                    this.makeMove(this.man.moveBuffer);
                this.man.moveBuffer = -1;
            }
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
            this.add.text(0, 40, err,{ font: '18px Courier' });
            this.add.text(0, 70, "RATFARTS",{ font: '18px Courier' });
            this.add.text(0, 100, err.stack,{ font: '18px Courier' });
        }
    }

    handleKey(e){
        switch(e.code){
            case "KeyA":
            case "ArrowLeft":
                this.man.moveBuffer = LEFT;
                break;
            case "KeyD":
            case "ArrowRight":
                this.man.moveBuffer = RIGHT;
                break;
            case "KeyW":
            case "ArrowUp":
                this.man.moveBuffer = UP;
                break;
            case "KeyS":
            case "ArrowDown":
                this.man.moveBuffer = DOWN;
                break;
            case "Space":
                this.man.moveBuffer = INTERACT;
        }
    }

    handleSwipe(e){
        var swipeTime = e.upTime - e.downTime;
        var fastEnough = swipeTime < gameOptions.swipeMaxTime;
        var swipe = new Phaser.Geom.Point(e.upX - e.downX, e.upY - e.downY);
        var swipeMagnitude = Phaser.Geom.Point.GetMagnitude(swipe);
        var longEnough = swipeMagnitude > gameOptions.swipeMinDistance;
        if(longEnough && fastEnough){
            Phaser.Geom.Point.SetMagnitude(swipe, 1);
            if(swipe.x > gameOptions.swipeMinNormal){
                this.man.moveBuffer = RIGHT;
            }
            if(swipe.x < -gameOptions.swipeMinNormal){
                this.man.moveBuffer = LEFT;
            }
            if(swipe.y > gameOptions.swipeMinNormal){
                this.man.moveBuffer = DOWN;
            }
            if(swipe.y < -gameOptions.swipeMinNormal){
                this.man.moveBuffer = UP;
            }
        } else {
            //console.log('tap');
            this.man.moveBuffer = INTERACT;
        }
    }

    makeMove(dir) {
        var oldLocX = this.man.location.x; // copying these 2 attributes only... love JS
        var oldLocY = this.man.location.y;
        var manAt = map[this.man.location.y][this.man.location.x][2];
        switch (dir) {
            case LEFT:
                this.man.location.x--;
                break;
            case RIGHT:
                this.man.location.x++;
                break;
            case UP:
                this.man.location.y--;
                if (manAt > -1)
                   this.man.location.y = -1;
                break;
            case DOWN:
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

function BotFactory(game, spriteName, spot) {
    this.spot = spot;
    this.sprite = game.add.sprite(getLocationX(spot), getLocationY(spot), spriteName, 0).setOrigin(0,0);

    this.interact = function (theMan) {
        if (!this.built) {
           if (theMan.carrying == THING) {
              this.sprite = game.add.sprite(getLocationX(spot), getLocationY(spot), "botFactory", 0).setOrigin(0,0);

              theMan.sprite.setFrame(0);
              theMan.carrying = NOTHING;
              this.built = true;
           }
        }
    };
}

function GasFactory(game, spriteName, spot) {
    this.spot = spot;
    this.sprite = game.add.sprite(getLocationX(spot), getLocationY(spot), spriteName, 0).setOrigin(0,0);

    this.interact = function (theMan) {
        if (!this.built) {
           if (theMan.carrying == THING) {
              this.sprite = game.add.sprite(getLocationX(spot), getLocationY(spot), "gasFactory", 0).setOrigin(0,0);

              theMan.sprite.setFrame(0);
              theMan.carrying = NOTHING;
              this.built = true;
           }
        }
    };
}


/***********************************
 * MISC
 ***********************************/

// "Translate screen locations into screen coordinates"
function getLocationX(location) {
    var coordX = 0;
    if (location == 0 || location == 3 || location == 6)
        coordX = 10;
    if (location == 1 || location == 4 || location == 7)
        coordX = 140;
    if (location == 2 || location == 5 || location == 8)
        coordX = 270;
    return coordX;
}
function getLocationY(location) {
    var coordY = 0;

    if (location == 0 || location == 1 || location == 2)
        coordY = 10;
    if (location == 3 || location == 4 || location == 5)
        coordY = 140;
    if (location == 6 || location == 7 || location == 8)
        coordY = 270;
    return coordY;
}

function getMapCoords(goalPoint) {
    try {
        if (goalPoint.x < 0 || goalPoint.y < 0)
            return null;
        if (map[goalPoint.y][goalPoint.x][0] < 0)
            return null;
        if (map[goalPoint.y][goalPoint.x][1] < 0)
            return null;
        return new Phaser.Geom.Point(map[goalPoint.y][goalPoint.x][0], map[goalPoint.y][goalPoint.x][1]);
    } catch (err) { // array out of bounds
        return null;
    }
}

function resizeGame(){
    var canvas = document.querySelector("canvas");
    var windowWidth = window.innerWidth;
    var windowHeight = window.innerHeight;
    var windowRatio = windowWidth / windowHeight;
    var gameRatio = game.config.width / game.config.height;
    if(windowRatio < gameRatio){
        canvas.style.width = windowWidth + "px";
        canvas.style.height = (windowWidth / gameRatio) + "px";
    }
    else{
        canvas.style.width = (windowHeight * gameRatio) + "px";
        canvas.style.height = windowHeight + "px";
    }
}