/* global Phaser */
import FueledLocation from "./fueledLocation.js";
import { assetsDPR} from '../index.js';

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

        this.shieldBody = this.game.add.rectangle(0, 310*assetsDPR, 2270*assetsDPR, 20*assetsDPR, 0x00ff00).setOrigin(0,0);
        this.shieldBody.setAlpha(0);
        this.game.physics.add.existing(this.shieldBody, false);
        this.shieldBody.body.immovable = true;
        this.shieldBody.body.allowGravity = false;

        this.level = 100;
        var newTop = this.paintShieldBars(this.level);
        if (newTop > 0) {
            //console.log(`new top ${newTop}`);
        }

        this.oldLevel = this.level;

        this.chargeLevel = 100;
        this.chargeRate = 220;
        this.chargeCount = 0;
    }

    getBlock() {
        return this.shieldBody; //TODO: perhaps we can use shieldPix?
    }

    update() {
        return; //TODO: so much easier to test!

        this.chargeCount++;
        if (this.chargeCount < this.chargeRate)
            return;
        this.chargeCount = 0;
        if (this.level < this.chargeLevel)
            this.level+=1;
        var newTop = this.paintShieldBars(this.level);
        if (newTop > 0)
            this.shieldBody.setY(newTop*4);
    }

    hit() {
        this.level = this.level - 15;
        if (this.level < 0)
            this.level = 0;
        var newTop = this.paintShieldBars(this.level);
        if (newTop > 0)
            this.shieldBody.setY(newTop*4);
    }

    doAction(affect) {
        if (affect == DO_UPGRADE) {
               this.upgrades++;
               this.drawUpgrades();
        }
    }

    upgrade() {
        //TODO: how to extend base class function???????????????????????????????????
        this.upgrades++;
        this.upgradeSprite.setFrame(`upgrades/${this.upgrades}`).setOrigin(0,0);

        this.chargeLevel += 10;
    }

    // Paint the fancy shield, updating an aggregate of all the bars used to clear the previous paint
    /*************************************
     *
     * Mostly indecipherable, but it works well enough!!
     *
     * ********************/
    paintShieldBars() {
        if (this.level == this.oldLevel)
            return -1;
        this.oldLevel = this.level;
        var level = this.level;//TODO: fix, don't need two variables
        //console.log(`set to level ${level}`);

        if (typeof this.shieldPix != "undefined") { // start over
            this.shieldPix.destroy();
        }
        if (level < 1) {
            console.log("oh shit no shield");
            this.shieldBody.setY(360*assetsDPR);
            return;
        }

        var shieldBarWork = [];

        var remain = level;
        var spreadTotal = 0;
        var painted = 0;

        // as many as 10 bars need to be painted
        for (var bar=0;bar<10;bar++) {

            // the boring base height: each bar can be up to 10 high, the last might be shorter, and then 0 for all the rest
            var base = Math.max(0,Math.min(10,level-bar*10));
            if (base > 0)
               painted++; // count the number of bars we're gonna paint
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
        var blockHeight = 0;
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
            //console.log(alpha + " " + shieldBar[bar]);
            if (alpha > 0) {
                var top = bottom - shieldBar[bar] +1;

                shieldPix.fillStyle(this.fullColorHex ((9-bar)*15,25*bar*(10/painted),255), alpha);
                if (level == 100 && bar==0) {
                    //console.log("top " + (top*shieldScale+offset));
                }
                shieldPix.fillRect(318*assetsDPR,(top*shieldScale+offset)*assetsDPR,298*assetsDPR,shieldBar[bar]*shieldScale*assetsDPR);
                blockHeight += shieldBar[bar]*shieldScale; //accumulate the height of all the bars... TODO: finalSumHack?
                bottom = top-1;
            }
        }

        shieldPix.closePath();
        this.shieldPix = shieldPix;

        // the actual collision body
        var shieldTop = (top*shieldScale+offset)*assetsDPR;
        this.shieldBody.setY(shieldTop);
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
