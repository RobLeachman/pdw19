/* global Phaser */
import Constant from "../constants.js";
import { assetsDPR, WIDTH, HEIGHT } from '../index.js';
import Sprite from "../sprite.js";
import {getLocationX, getLocationY} from "./util.js";
import FueledLocation from "./fueledLocation.js";

//TODO: this should be a class, duh
export default class Base extends FueledLocation {
    constructor(game, spriteName, spot) {
        super(game,spriteName,spot);

        this.game = game;
        this.spriteName = spriteName; // TODO: no
        this.spot = spot;

        this.botCount = 0;

        this.fuelBay = [0,0,0]; // or maybe we start with one or more here?
        this.drawFuelBays();

        // need multiple inheritance here, otherwise... same code as botFactory:
        this.botsAvailable = 10;
        this.botList = [];
        this.botsResting = 0;

        // two rows, lazy way
        for (var i=0;i<this.botsAvailable/2;i++) {
            var botCounter = {
                x: getLocationX(this.spot)+4+(i*12.5),
                y: getLocationY(this.spot)+53,
                sprite: new Sprite(this.game, getLocationX(this.spot)+4+(i*12.5), getLocationY(this.spot)+53, "bigBackground", "botCounter").setOrigin(0,0),
            };
            botCounter.sprite.setAlpha(0);
            this.botList.push(botCounter);
        }
        for (var i=0;i<this.botsAvailable/2;i++) {
            botCounter = {
                x: getLocationX(this.spot)+4+(i*12.5),
                y: getLocationY(this.spot)+56,
                sprite: new Sprite(this.game, getLocationX(this.spot)+4+(i*12.5), getLocationY(this.spot)+56, "bigBackground", "botCounter").setOrigin(0,0)
            };
            botCounter.sprite.setAlpha(0);
            this.botList.push(botCounter);
        }
    }

    interact (theMan) {
        if (theMan.isCarrying() == Constant.NOTHING) {
           if (this.takeStuff()) {
               theMan.isNowCarrying(Constant.THING);
           }
        } else if (theMan.isCarrying() == Constant.THING) {
           if (this.stashStuff()) {
               theMan.isNowCarrying(Constant.NOTHING);
           }
        }
    }

    doAction (affect) {
        var rect, g;
        switch (affect) {
            case Constant.DO_RESTBOT:
                  this.botList[this.botsResting++].sprite.setAlpha(1);
                  break;
            case Constant.DO_TAKESTUFF:
                  this.takeStuff();
                  rect = new Phaser.Geom.Rectangle((this.sprite.x+5)+(this.botCount)*7, this.sprite.y+20, 5, 2);
                  g = this.game.add.graphics({ fillStyle: { color: 0xffffff } });
                  g.fillRectShape(rect);
                  this.botCount--;
                  break;

        }
    }

    takeStuff () {
        for (var x=0;x<3;x++) {
            if (this.fuelBay[x] > 0) {
               this.fuelBay[x] = 0;
               this.drawFuelBays();
               return true;
            }
        }
        return false;
    }

    stashStuff () {
        for (var x=0;x<3;x++) {
            if (this.fuelBay[x] == 0) {
               this.fuelBay[x] = 10;
               this.drawFuelBays();
               return true;
            }
        }
        return false;
    }


}