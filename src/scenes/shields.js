/* global Phaser */
import Constant from "../constants.js";
import FueledLocation from "./fueledLocation.js";
import { assetsDPR, WIDTH, HEIGHT } from '../index.js';
import Sprite from "../sprite.js";
import {getLocationX, getLocationY} from "./util.js";

const NOTHING = 0;
const THING = 1;
const GAS = 2;

const DO_RESTBOT = 1;
const DO_TAKESTUFF = 2;
const DO_UPGRADE = 3;

export default class Shields extends FueledLocation {
    constructor (game,spriteName,spot) {
        super(game,spriteName,spot);
        this.built = true;
    }

    doAction(affect) {
        if (affect == DO_UPGRADE) {
               this.upgrades++;
               this.drawUpgrades();
        }
    }

    paint() {
        /* HARD WAY:
        var rect = new Phaser.Geom.Rectangle(400, 380, 330, 60);
        var g = this.game.add.graphics({ fillStyle: { color: 0xff0000 } });
        g.fillRectShape(rect);
        */

        if (1) {
            this.shieldBlock = this.game.add.rectangle(400, 380, 330, 30, 0x006fff).setOrigin(0,0);
            this.shieldBlock.setAlpha(.5);
            this.game.physics.add.existing(this.shieldBlock, true);
        }
    }

    getBlock() {
           return this.shieldBlock;
    }

    paintShieldBars(level) {
        var shieldBarWork = [];

        var remain = level;
        var spreadTotal = 0;
        var painted = 0;

        // as many as 10 bars need to be painted
        for (var bar=0;bar<10;bar++) {

            // the boring base height: each bar can be up to 10 high, the last might be shorter, and then 0 for all the rest
            var base =Math.max(0,Math.min(10,level-bar*10));
            if (base > 0)
               painted++; // yeah count the number of bars we're gonna paint
            remain = remain - base;
            var spread = base + remain; // spread them out in interesting fashion
            shieldBarWork.push(spread);
            spreadTotal += spread; // ... and beyond that your guess is as good as mine, will try harder next time
        }
        //console.log("painting " + painted + " bars");

        var shieldBar = [];
        var finalSumHack = 0;
        for (bar=0;bar<10;bar++) {
            var final = Math.round(level*shieldBarWork[bar]/spreadTotal,0);
            shieldBar.push(final);
            finalSumHack += final;
        }
        shieldBar[0] += level - finalSumHack;

        var bottom = 150;
        var shieldPix = this.game.add.graphics({
            x:0,
            y:0
        });

        let shieldScale = .5;
        let offset = 280;
        for (bar=0;bar<10;bar++) {
            var alpha = (level-bar*10)/10;
            if (alpha>1)
               alpha = 1;
            //console.log("BAR " + bar + " ALPHA " + alpha);
            //console.log(alpha + " " + shieldBar[bar]);
            if (alpha > 0) {
                var top = bottom - shieldBar[bar] +1;

                shieldPix.fillStyle(this.fullColorHex ((9-bar)*15,25*bar*(10/painted),255), alpha);
                if (level == 100 && bar==0) {
                    //console.log("top " + (top*shieldScale+offset));
                    //shieldPix.fillStyle(0xff0000, alpha);
                }
                shieldPix.fillRect(318*assetsDPR,(top*shieldScale+offset)*assetsDPR,298*assetsDPR,shieldBar[bar]*shieldScale*assetsDPR);
                bottom = top-1;
            }
        }

        // scaling hasn't killed me yet, but close
        /*
        shieldPix.lineStyle(1,0xff0000);
        shieldPix.strokeRect(0,216,500,19);
        shieldPix.lineStyle(1,0x00ff00);
        shieldPix.strokeRect(0,416*assetsDPR,500,19);
        console.log("ugh " + 416*assetsDPR);
        */
        shieldPix.closePath();
        return shieldPix;
    }

    colorToHex (rgb) {
        var hex = Number(Math.round(rgb)).toString(16);
        if (hex.length < 2) {
            hex = "0" + hex;
        }
        return hex;
    }

    fullColorHex (r,g,b) {
        var red = this.colorToHex(r);
        var green = this.colorToHex(g);
        var blue = this.colorToHex(b);
        return parseInt(red+green+blue,16);
    }
}
